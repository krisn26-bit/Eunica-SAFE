"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { setSeekCareHandoff } from "@/lib/seek-care/handoff";

export function ExperiencingThisButton({
  symptomId,
  label = "I am experiencing this now",
}: {
  symptomId: string;
  label?: string;
}) {
  const router = useRouter();

  return (
    <Button
      variant="primary"
      size="lg"
      fullWidth
      onClick={() => {
        setSeekCareHandoff(symptomId);
        router.push("/seek-care");
      }}
    >
      {label}
      <ArrowRight aria-hidden="true" className="size-5" />
    </Button>
  );
}
