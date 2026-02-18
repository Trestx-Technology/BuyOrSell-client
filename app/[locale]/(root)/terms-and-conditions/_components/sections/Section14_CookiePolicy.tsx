import React from "react";
import { SectionWrapper } from "../SectionWrapper";
import { Typography } from "@/components/typography";

export const Section14CookiePolicy = () => (
  <SectionWrapper id="cookies" title="Cookie Policy" number="14" className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-purple/5">
    <div className="mb-8">
      <Typography variant="body" className="italic text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-full inline-block">
        Effective Date: February 2025 | Applies to: www.buyorsell.ae
      </Typography>
    </div>

    <div className="space-y-10">
      <div>
        <Typography variant="h4" className="text-purple mb-4 font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-purple rounded-full"></span>
          14.1 What Are Cookies?
        </Typography>
        <p>
          Cookies are small text files placed on your device when you visit our Platform. They help us
          operate the Platform, understand how you use it, and deliver relevant content and
          advertisements. Similar technologies (such as pixels, web beacons, and local storage) may also
          be used and are collectively referred to as &quot;cookies&quot; in this policy.
        </p>
      </div>

      <div>
        <Typography variant="h4" className="text-purple mb-6 font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-purple rounded-full"></span>
          14.2 Cookies We Use and Why
        </Typography>
        <div className="overflow-x-auto rounded-[2rem] border border-gray-100 shadow-2xl shadow-gray-200/30 bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-5 text-left font-bold text-gray-400 uppercase tracking-widest text-[10px]">Cookie Name</th>
                <th className="p-5 text-left font-bold text-gray-400 uppercase tracking-widest text-[10px]">Provider</th>
                <th className="p-5 text-left font-bold text-gray-400 uppercase tracking-widest text-[10px]">Purpose</th>
                <th className="p-5 text-left font-bold text-gray-400 uppercase tracking-widest text-[10px]">Duration</th>
                <th className="p-5 text-left font-bold text-gray-400 uppercase tracking-widest text-[10px]">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: "session_id, csrf_token", provider: "BuyOrSell.ae", purpose: "Manages login sessions, security and CSRF protection", duration: "Session", cat: "Essential" },
                { name: "cookie_consent", provider: "BuyOrSell.ae", purpose: "Stores your cookie preferences", duration: "1 year", cat: "Essential" },
                { name: "_ga, _gid, _gat_UA-*", provider: "Google Analytics", purpose: "Usage analytics and request throttling", duration: "2 years / 24h", cat: "Performance" },
                { name: "_gcl_au", provider: "Google Ads", purpose: "Ad performance and conversion tracking", duration: "3 months", cat: "Marketing" },
                { name: "stripe_*", provider: "Stripe", purpose: "Secure payment processing and fraud prevention", duration: "Session", cat: "Essential" },
                { name: "fbp, fbc", provider: "Meta (Facebook)", purpose: "Ad tracking and conversion for Facebook ads", duration: "90 days", cat: "Marketing" },
                { name: "_uetsid, _uetvid", provider: "Microsoft Bing", purpose: "Tracks ad conversions and retargeting", duration: "1 day / 16 days", cat: "Marketing" },
                { name: "pref_language", provider: "BuyOrSell.ae", purpose: "Stores preferred language (Arabic/English)", duration: "1 year", cat: "Functional" },
                { name: "recent_searches", provider: "BuyOrSell.ae", purpose: "Saves recent search terms for convenience", duration: "30 days", cat: "Functional" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-purple/[0.01] transition-colors">
                  <td className="p-5 font-bold text-purple/80">{row.name}</td>
                  <td className="p-5 text-gray-500">{row.provider}</td>
                  <td className="p-5 text-gray-600 leading-relaxed">{row.purpose}</td>
                  <td className="p-5 whitespace-nowrap text-gray-400">{row.duration}</td>
                  <td className="p-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] uppercase font-black tracking-tighter ${row.cat === 'Essential' ? 'bg-green-100 text-green-700' :
                        row.cat === 'Performance' ? 'bg-blue-100 text-blue-700' :
                          row.cat === 'Marketing' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                      {row.cat}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <Typography variant="h4" className="text-purple mb-4 font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-purple rounded-full"></span>
          14.3 Cookie Categories
        </Typography>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <span className="font-bold text-gray-900 min-w-[100px]">Essential:</span>
            <span className="text-gray-600">Required for the Platform to function (login, payments, security). Cannot be disabled.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-gray-900 min-w-[100px]">Performance:</span>
            <span className="text-gray-600">Help us understand how visitors use the Platform (e.g., Google Analytics). No personally identifiable information stored.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-gray-900 min-w-[100px]">Marketing:</span>
            <span className="text-gray-600">Enable relevant ads on/off Platform and measure campaign effectiveness.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-gray-900 min-w-[100px]">Functional:</span>
            <span className="text-gray-600">Enhance experience by remembering preferences (language, recent searches).</span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <Typography variant="h4" className="text-purple mb-3 font-bold">14.4 Management</Typography>
          <p className="text-sm leading-relaxed text-gray-600">
            <strong>First Visit:</strong> Use the consent banner to Accept All or Manage Preferences.<br />
            <strong>Anytime:</strong> Account Settings &rarr; Privacy, or browser settings.
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <Typography variant="h4" className="text-purple mb-3 font-bold">14.5 Third Parties</Typography>
          <ul className="text-xs space-y-1 text-gray-500">
            <li>Google: policies.google.com/privacy</li>
            <li>Stripe: stripe.com/privacy</li>
            <li>Meta: facebook.com/privacy/policy</li>
            <li>Microsoft: privacy.microsoft.com</li>
          </ul>
        </div>
      </div>

      <div className="pt-6">
        <Typography variant="h4" className="text-purple mb-4 font-bold">14.6 UAE Legal Compliance</Typography>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "Consent recorded & revocable",
            "Bilingual (AR/EN) banners",
            "Granular controls",
            "No 'cookie walls'",
            "PDPL Article 12 compliant",
            "Federal Law 45/2021"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
              <span className="text-green-500">✓</span> {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  </SectionWrapper>
);
