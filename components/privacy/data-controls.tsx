"use client";

import { Download, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { DATA_RETENTION } from "@/lib/privacy/notices";
import {
  clearAllRecords,
  downloadExport,
  isStorageAvailable,
} from "@/lib/storage/local-store";

export function DataControls() {
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-[1.2rem] font-semibold">
          Export a copy
        </h3>
        <p className="text-ink-soft mt-2 max-w-[62ch]">
          {DATA_RETENTION.export}
        </p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => {
            downloadExport();
            setStatus("Your export has been written to this device.");
          }}
        >
          <Download aria-hidden="true" className="size-4" />
          Download my data as JSON
        </Button>
      </div>

      <div className="border-rule border-t pt-6">
        <h3 className="font-serif text-[1.2rem] font-semibold">
          Delete everything
        </h3>
        <p className="text-ink-soft mt-2 max-w-[62ch]">
          {DATA_RETENTION.deletion}
        </p>
        {confirming ? (
          <Callout
            tone="serious"
            title="This cannot be undone"
            className="mt-4"
            assertive
          >
            <p>
              Your medical history, safety plan, recovery notes, saved location,
              and preferences will be removed from this browser.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="serious"
                onClick={() => {
                  clearAllRecords();
                  setConfirming(false);
                  setStatus(
                    "All Eunica Safe data has been deleted from this browser.",
                  );
                }}
              >
                Yes, delete all my data
              </Button>
              <Button variant="quiet" onClick={() => setConfirming(false)}>
                Keep my data
              </Button>
            </div>
          </Callout>
        ) : (
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => setConfirming(true)}
          >
            <Trash2 aria-hidden="true" className="size-4" />
            Delete all my data
          </Button>
        )}
      </div>

      <p aria-live="polite" className="text-ink-muted text-[0.9rem]">
        {status ??
          (isStorageAvailable()
            ? DATA_RETENTION.summary
            : "This browser is blocking local storage, so nothing can be saved here. The app still works for reading and for the questionnaire.")}
      </p>
    </div>
  );
}
