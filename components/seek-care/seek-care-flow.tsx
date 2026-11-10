"use client";

import { ArrowLeft, ArrowRight, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { GuidanceResult } from "@/components/seek-care/guidance-result";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { ChoiceGroup } from "@/components/ui/field";
import {
  NO_RED_FLAGS,
  RED_FLAG_QUESTION,
  SYMPTOMS,
  evaluateGuidance,
  hasRedFlag,
  type Question,
  type SymptomDefinition,
} from "@/lib/safety-rules";
import { takeSeekCareHandoff } from "@/lib/seek-care/handoff";

type Step =
  | { kind: "symptom" }
  | { kind: "question"; question: Question }
  | { kind: "result" };

function matchesSymptom(symptom: SymptomDefinition, query: string): boolean {
  const haystack = [symptom.label, symptom.detail, ...symptom.searchTerms]
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function SeekCareFlow() {
  const [symptomId, setSymptomId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // A one-shot session hand-off, read after mount so the prerendered markup
    // and the first client render match.
    const handoff = takeSeekCareHandoff();
    if (handoff && SYMPTOMS.some((symptom) => symptom.id === handoff)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSymptomId(handoff);
      setStepIndex(1);
    }
  }, []);

  const symptom = useMemo(
    () => SYMPTOMS.find((item) => item.id === symptomId) ?? null,
    [symptomId],
  );

  const steps: Step[] = useMemo(() => {
    const list: Step[] = [{ kind: "symptom" }];
    if (!symptom) return list;
    list.push({ kind: "question", question: RED_FLAG_QUESTION });

    const redFlagged = hasRedFlag(answers);
    if (!redFlagged) {
      for (const question of symptom.followUps) {
        list.push({ kind: "question", question });
      }
    }
    list.push({ kind: "result" });
    return list;
  }, [symptom, answers]);

  const current = steps[Math.min(stepIndex, steps.length - 1)];
  const questionSteps = steps.filter((step) => step.kind === "question").length;
  const answeredQuestions = steps
    .slice(0, stepIndex)
    .filter((step) => step.kind === "question").length;

  function setAnswer(questionId: string, values: string[]) {
    setError(null);
    setAnswers((previous) => ({ ...previous, [questionId]: values }));
  }

  function goNext() {
    if (current.kind === "symptom") {
      if (!symptomId) {
        setError("Choose what you are noticing so the questions can match it.");
        return;
      }
    }
    if (current.kind === "question") {
      const selected = answers[current.question.id] ?? [];
      if (selected.length === 0) {
        setError(
          "Please answer this one. If you are unsure, choose the option that is closest.",
        );
        return;
      }
    }
    setError(null);
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  }

  function goBack() {
    setError(null);
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  function restart() {
    setSymptomId(null);
    setAnswers({});
    setStepIndex(0);
    setQuery("");
    setError(null);
  }

  if (current.kind === "result" && symptom) {
    const guidance = evaluateGuidance({ symptomId: symptom.id, answers });
    return (
      <div className="space-y-8">
        <GuidanceResult guidance={guidance} />
        <div className="border-rule flex flex-wrap gap-3 border-t pt-6">
          <Button variant="secondary" onClick={goBack}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Change my last answer
          </Button>
          <Button variant="quiet" onClick={restart}>
            <RotateCcw aria-hidden="true" className="size-4" />
            Start over with a different symptom
          </Button>
        </div>
      </div>
    );
  }

  const filteredSymptoms =
    query.trim().length === 0
      ? SYMPTOMS
      : SYMPTOMS.filter((item) => matchesSymptom(item, query.trim()));

  return (
    <div className="space-y-8">
      {questionSteps > 0 ? (
        <div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={questionSteps}
            aria-valuenow={answeredQuestions}
            aria-label="Questions answered"
            className="flex gap-1"
          >
            {Array.from({ length: questionSteps }, (_, index) => (
              <span
                key={index}
                className={
                  index < answeredQuestions
                    ? "bg-clay h-1 flex-1"
                    : "bg-rule h-1 flex-1"
                }
              />
            ))}
          </div>
          <p className="text-ink-muted mt-2 text-[0.85rem]">
            {answeredQuestions} of {questionSteps} questions answered. You can
            go back at any point.
          </p>
        </div>
      ) : null}

      {current.kind === "symptom" ? (
        <div>
          <h2 className="font-serif text-[length:var(--step-2)] font-semibold">
            What are you noticing?
          </h2>
          <p className="text-ink-soft mt-2">
            Pick the closest match. If more than one applies, start with the one
            that worries you most — you can run this again.
          </p>

          <div className="relative mt-5">
            <label htmlFor="symptom-search" className="sr-only">
              Search symptoms
            </label>
            <Search
              aria-hidden="true"
              className="text-ink-muted pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2"
            />
            <input
              id="symptom-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search, for example bleeding or headache"
              autoComplete="off"
              className="border-rule-strong text-ink min-h-12 w-full rounded-[var(--radius-control)] border bg-[color:var(--paper)] py-3 pr-4 pl-11 text-[1rem]"
            />
          </div>

          <div className="mt-5">
            <ChoiceGroup
              legend="Choose one"
              name="symptom"
              options={filteredSymptoms.map((item) => ({
                value: item.id,
                label: item.label,
                detail: item.detail,
              }))}
              value={symptomId ? [symptomId] : []}
              onChange={(next) => {
                setError(null);
                setSymptomId(next[0] ?? null);
              }}
              error={error ?? undefined}
            />
            {filteredSymptoms.length === 0 ? (
              <Callout tone="note" title="No match for those words">
                <p>
                  Try a simpler word. If nothing fits, choose the closest option
                  after clearing the search, or call your care team and describe
                  it in your own words.
                </p>
              </Callout>
            ) : null}
          </div>
        </div>
      ) : null}

      {current.kind === "question" ? (
        <div>
          {current.question.id === RED_FLAG_QUESTION.id ? (
            <Callout tone="emergency" title="Before anything else">
              <p>
                If any of these are happening, stop and call 911. You do not
                need to finish these questions first.
              </p>
            </Callout>
          ) : null}
          <div className="mt-5">
            <ChoiceGroup
              legend={current.question.prompt}
              help={current.question.help}
              name={current.question.id}
              options={current.question.options}
              multiple={current.question.kind === "multi"}
              exclusiveValue={current.question.exclusiveValue}
              value={answers[current.question.id] ?? []}
              onChange={(next) => setAnswer(current.question.id, next)}
              error={error ?? undefined}
            />
          </div>
          {current.question.id === RED_FLAG_QUESTION.id &&
          (answers[RED_FLAG_QUESTION.id] ?? []).some(
            (value) => value !== NO_RED_FLAGS,
          ) ? (
            <Callout
              tone="emergency"
              title="Call 911"
              assertive
              className="mt-5"
            >
              <p>
                Based on what you just selected, this needs emergency care now.
                Continue to see what to do and say.
              </p>
            </Callout>
          ) : null}
        </div>
      ) : null}

      <div className="border-rule flex flex-wrap items-center gap-3 border-t pt-6">
        {stepIndex > 0 ? (
          <Button variant="secondary" onClick={goBack}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back
          </Button>
        ) : null}
        <Button variant="primary" size="lg" onClick={goNext}>
          Continue
          <ArrowRight aria-hidden="true" className="size-5" />
        </Button>
        {stepIndex > 0 ? (
          <Button variant="quiet" onClick={restart}>
            Start over
          </Button>
        ) : null}
      </div>

      <p className="text-ink-muted text-[0.88rem]">
        Your answers stay in this browser tab. They are not saved, not sent
        anywhere, and never put in the web address.
      </p>
    </div>
  );
}
