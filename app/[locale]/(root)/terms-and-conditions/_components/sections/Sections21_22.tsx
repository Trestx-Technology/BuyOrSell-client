import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { Typography } from "@/components/typography";

export const Section21Miscellaneous = () => (
  <SectionWrapper id="miscellaneous" title="Miscellaneous" number="21">
    <p>
      21.1 If any provision of these Terms is held to be invalid, illegal, or unenforceable, that
      provision shall be enforced to the maximum extent permissible, and the remaining provisions
      shall continue in full force and effect.
    </p>
    <p>
      21.2 Our failure to enforce any right or provision of these Terms shall not be deemed a waiver
      of such right or provision.
    </p>
    <p>
      21.3 You may not assign or transfer any of your rights or obligations under these Terms without
      our prior written consent. We may assign or transfer our rights and obligations under these
      Terms, in whole or in part, without restriction.
    </p>
    <p>
      21.4 These Terms, together with our Privacy Policy and Cookie Policy, and any additional
      terms applicable to specific features or promotions, constitute the entire agreement between
      you and us regarding the Platform and supersede any prior agreements or understandings
      relating to the same subject matter.
    </p>
    <p>
      21.5 <strong>Verified Business Account:</strong> BuyOrSell may from time to time make available a &apos;Verified
      Business Account&apos; feature, allowing business users to secure a &apos;Verified Business&apos; status. The
      perks associated with this feature may change over time and will be described on the Platform
      at all relevant times. As part of this feature, you may display your business logo, a description of
      your business, and a link to your website. All content must be accurate, appropriate, compliant
      with our Acceptable Use Policy, and must not infringe any third-party rights.
    </p>
    <p>
      21.6 The Annexes to these Terms contain additional terms applicable to specific features of the
      Platform. If there is any conflict between the main Terms and any Annex, the main Terms take
      precedence.
    </p>
    <p className="italic text-sm text-gray-500 mt-2">
      Annexes: Property for Sale and Rent (Annex 1) | Motors (Annex 2) | Jobs (Annex 3)
    </p>
  </SectionWrapper>
);

export const Section22ContactUs = () => (
  <SectionWrapper id="contact" title="Contact Us" number="22" className="text-center pt-10">
    <p className="mb-8">If you have any questions about these Terms, Subscriptions, or the Platform, please contact us:</p>
    <div className="bg-purple text-white p-10 rounded-[2rem] inline-block text-left shadow-2xl relative overflow-hidden group max-w-lg mx-auto w-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full flex items-center justify-center -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"></div>
      <Typography variant="h3" className="font-bold text-xl mb-4 relative z-10 text-white">Souq Labs Technologies LLC SPC</Typography>
      <div className="space-y-3 relative z-10 opacity-90 text-sm md:text-base">
        <p className="flex items-start gap-3">
          <span className="font-bold">Address:</span>
          <span>Abu Dhabi, United Arab Emirates</span>
        </p>
        <p className="flex items-center gap-3">
          <span className="font-bold">Email:</span>
          <a href="mailto:support@buyorsell.ae" className="hover:text-gray-200 transition-colors underline decoration-white/30 underline-offset-4">support@buyorsell.ae</a>
        </p>
        <p className="flex items-center gap-3">
          <span className="font-bold">Phone:</span>
          <a href="tel:+97126756766" className="hover:text-gray-200 transition-colors">+971 2 675 6766</a>
        </p>
      </div>
    </div>
  </SectionWrapper>
);
