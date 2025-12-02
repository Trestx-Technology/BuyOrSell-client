"use client";

import React from "react";
import { Typography } from "@/components/typography";
import Link from "next/link";

export default function Disclaimer() {
  return (
    <div className="bg-white rounded-2xl border border-blue-200 p-4">
      <Typography
        variant="body-small"
        className="text-dark-blue text-sm leading-relaxed"
      >
        <span className="font-semibold">Disclaimer:</span> BuyOrSell.ae is only a platform to bring jobseekers & employers together. Applicants are advised to research the bonafides of the prospective employer independently. We do NOT endorse any requests for money payments and strictly advice against sharing personal or bank related information. We also recommend you visit{" "}
        <Link
          href="mailto:support@buyorsell.ae"
          className="text-blue-600 hover:underline"
        >
          support@buyorsell.ae
        </Link>{" "}
        for more information. If you suspect any fraud or malpractice, email us at{" "}
        <Link
          href="mailto:support@buyorsell.ae"
          className="text-blue-600 hover:underline"
        >
          support@buyorsell.ae
        </Link>
      </Typography>
    </div>
  );
}

