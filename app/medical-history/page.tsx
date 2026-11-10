import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { MedicalHistoryEditor } from "@/components/medical-history/medical-history-editor";
import { Disclosure } from "@/components/ui/disclosure";
import { PageHeader } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "My medical history",
  description:
    "The pregnancy, delivery, and medical details that decide which postpartum education your safety plan shows you. Stored on your device only.",
};

export default function MedicalHistoryPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Your safety plan"
        title="My medical history"
        standfirst="This decides which education your safety plan shows you. It is stored in this browser, on this device, and nowhere else."
      />

      <MedicalHistoryEditor />

      <Disclosure summary="How this information is used, and how it is not">
        <p>
          Your answers choose which published education appears in your safety
          plan and on the warning-sign pages that relate to them. A cesarean
          brings up incision care. A history of preeclampsia brings up
          blood-pressure follow-up. That is the whole mechanism.
        </p>
        <p className="mt-2">
          It does not diagnose you, it does not calculate a risk score, and it
          does not predict whether you will develop a complication. It also
          cannot decide that you are safe — nothing in this app can.
        </p>
        <p className="mt-2">
          Nothing is sent anywhere. There is no account and no server holding
          your health details. Anyone with access to this device and this
          browser profile can open it, which matters if your device is shared or
          if you are not safe at home. You can delete all of it at any time from
          Privacy and your data.
        </p>
      </Disclosure>
    </PageShell>
  );
}
