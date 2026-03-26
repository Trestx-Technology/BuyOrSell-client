"use client";

import React from "react";
import { Typography } from "@/components/typography";
import {
  Star,
  FileText,
  CheckCircle,
  Users,
  Clock,
  Shield,
  MapPin,
  Globe,
  Tag,
  Building2,
  Phone,
  Mail,
  Award,
  Briefcase,
  Hash,
  Calendar,
} from "lucide-react";
import { Organization } from "@/interfaces/organization.types";
import { format } from "date-fns";

interface OrgInfoProps {
  organization: Organization;
}

const OrgInfo: React.FC<OrgInfoProps> = ({ organization }) => {
  const languages = organization.languages || [];
  const certifications = organization.certificates || [];
  const businessHours = organization.businessHours || [];
  const locations = organization.locations || [];
  const tags = organization.tags || [];

  const address = [
    organization.addressLine1,
    organization.addressLine2,
    organization.city,
    organization.emirate,
    organization.country,
  ]
    .filter(Boolean)
    .join(", ");

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    if (isNaN(hour)) return time;
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getOrgTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      AGENCY: "Real Estate Agency",
      DEALER: "Car Dealer",
      BROKER: "Broker",
      DEVELOPER: "Property Developer",
    };
    return map[type] || type;
  };

  const SectionCard = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
  }) => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 transition-all">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-purple" />
        <Typography variant="h3" className="text-base font-semibold text-dark-blue dark:text-white">
          {title}
        </Typography>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    href,
    className,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label?: string;
    value: string;
    href?: string;
    className?: string;
  }) => (
    <div className="flex items-start gap-3 py-2 border-b border-gray-50 dark:border-slate-800/50 last:border-0">
      <Icon className="h-4 w-4 text-grey-blue dark:text-slate-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        {label && (
          <Typography variant="body" className="text-xs text-grey-blue dark:text-slate-500 mb-0.5">
            {label}
          </Typography>
        )}
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm text-blue-600 dark:text-blue-400 hover:underline break-all ${className || ""}`}
          >
            {value}
          </a>
        ) : (
          <Typography variant="body" className={`text-sm text-dark-blue dark:text-white break-words ${className || ""}`}>
            {value}
          </Typography>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: FileText,
            value: organization.totalAds ?? 0,
            label: "Total Ads",
            color: "text-blue-600",
          },
          {
            icon: CheckCircle,
            value: organization.activeAds ?? 0,
            label: "Active Listings",
            color: "text-green-600",
          },
          {
            icon: Star,
            value: organization.ratingCount ?? 0,
            label: "Reviews",
            color: "text-yellow-500",
          },
          {
            icon: Users,
            value: organization.followersCount ?? 0,
            label: "Followers",
            color: "text-purple",
          },
        ].map(({ icon: Icon, value, label, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-4 flex flex-col items-center gap-1 transition-all"
          >
            <Icon className={`h-8 w-8 ${color}`} />
            <Typography variant="h2" className="text-xl font-bold text-dark-blue dark:text-white">
              {value}
            </Typography>
            <Typography variant="body" className="text-xs text-grey-blue dark:text-slate-400 text-center">
              {label}
            </Typography>
          </div>
        ))}
      </div>

      {/* Description */}
       {organization.description && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 transition-all">
          <Typography variant="h3" className="text-base font-semibold text-dark-blue dark:text-white mb-3">
            About
          </Typography>
          <Typography variant="body" className="text-sm text-grey-blue dark:text-slate-400 leading-relaxed">
            {organization.description}
          </Typography>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact & Business Info */}
        <SectionCard title="Contact Information" icon={Phone}>
          <div className="space-y-0">
            {organization.contactName && (
              <InfoRow icon={Users} label="Contact Person" value={organization.contactName} />
            )}
            {organization.contactPhone ? (
              <InfoRow
                icon={Phone}
                label="Phone"
                value={organization.contactPhone}
                href={`tel:${organization.contactPhone}`}
              />
            ) : (
              <div className="flex items-center gap-3 py-2 opacity-40">
                <Phone className="h-4 w-4 text-grey-blue dark:text-slate-400" />
                <Typography variant="body" className="text-sm text-grey-blue dark:text-slate-400 italic">
                  No phone number provided
                </Typography>
              </div>
            )}
            {organization.contactEmail ? (
              <InfoRow
                icon={Mail}
                label="Email"
                value={organization.contactEmail}
                href={`mailto:${organization.contactEmail}`}
              />
            ) : (
              <div className="flex items-center gap-3 py-2 opacity-40">
                <Mail className="h-4 w-4 text-grey-blue dark:text-slate-400" />
                <Typography variant="body" className="text-sm text-grey-blue dark:text-slate-400 italic">
                  No email provided
                </Typography>
              </div>
            )}
            {organization.website && (
              <InfoRow
                icon={Globe}
                label="Website"
                value={organization.website}
                href={organization.website}
              />
            )}
          </div>
        </SectionCard>

        {/* Business Details */}
        <SectionCard title="Business Details" icon={Briefcase}>
          <div className="space-y-0">
            <InfoRow icon={Briefcase} label="Business Type" value={getOrgTypeLabel(organization.type)} />
            {organization.tradeLicenseNumber && (
              <InfoRow
                icon={Building2}
                label="Trade License"
                value={organization.tradeLicenseNumber}
              />
            )}
            {organization.tradeLicenseExpiry && (
              <InfoRow
                icon={Calendar}
                label="License Expiry"
                value={format(new Date(organization.tradeLicenseExpiry), "dd MMM yyyy")}
              />
            )}
            {organization.reraNumber && (
              <InfoRow icon={Shield} label="RERA Number" value={organization.reraNumber} />
            )}
            {organization.trn && (
              <InfoRow icon={Hash} label="TRN" value={organization.trn} />
            )}
          </div>
        </SectionCard>

        {/* Address */}
        {address && (
          <SectionCard title="Address" icon={MapPin}>
            <div className="space-y-0">
              <InfoRow icon={MapPin} value={address} />
              {organization.poBox && (
                <InfoRow icon={Hash} label="PO Box" value={organization.poBox.toString()} />
              )}
            </div>
          </SectionCard>
        )}

        {/* Business Hours */}
        {businessHours.length > 0 && (
          <SectionCard title="Business Hours" icon={Clock}>
            <div className="space-y-2">
              {businessHours.map((bh, index) => {
                const dayIndex = typeof bh.day === "number" ? bh.day - 1 : parseInt(String(bh.day), 10) - 1;
                const dayName = dayNames[dayIndex] || `Day ${bh.day}`;
                let hoursText = "";
                if ((bh as any).closed || bh.closed) {
                  hoursText = "Closed";
                } else if (bh.allDay) {
                  hoursText = "Open 24 hours";
                } else if (bh.open && bh.close) {
                  hoursText = `${formatTime(bh.open)} – ${formatTime(bh.close)}`;
                }

                return (
                  <div key={index} className="flex justify-between items-center py-1.5 border-b border-gray-50 dark:border-slate-800/50 last:border-0">
                    <Typography variant="body" className="text-sm text-dark-blue dark:text-white font-medium w-28">
                      {dayName}
                    </Typography>
                    <Typography
                      variant="body"
                      className={`text-sm ${hoursText === "Closed" ? "text-red-400 dark:text-red-500" : "text-grey-blue dark:text-slate-400"}`}
                    >
                      {hoursText || "—"}
                    </Typography>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}
      </div>

      {/* Additional Locations */}
      {locations.length > 0 && (
        <SectionCard title="Locations" icon={MapPin}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {locations.map((loc, index) => (
              <div
                key={loc._id || index}
                className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700 transition-all"
              >
                {loc.name && (
                  <Typography variant="body" className="text-sm font-semibold text-dark-blue dark:text-white mb-1">
                    {loc.name}
                  </Typography>
                )}
                <Typography variant="body" className="text-xs text-grey-blue dark:text-slate-400">
                  {[loc.address, loc.city, loc.emirate].filter(Boolean).join(", ")}
                </Typography>
                {loc.phone && (
                  <a href={`tel:${loc.phone}`} className="text-xs text-blue-600 dark:text-blue-400 mt-1 block hover:underline">
                    {loc.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <SectionCard title="Certifications" icon={Award}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {certifications.map((cert, index) => (
              <div
                key={cert._id || index}
                className="p-4 bg-purple/5 dark:bg-purple-900/10 rounded-xl border border-purple/10 dark:border-purple-800/20 transition-all"
              >
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-purple mt-0.5 flex-shrink-0" />
                  <div>
                    <Typography variant="body" className="text-sm font-semibold text-dark-blue dark:text-white">
                      {cert.name}
                    </Typography>
                    {cert.issuer && (
                      <Typography variant="body" className="text-xs text-grey-blue dark:text-slate-400 mt-0.5">
                        Issued by {cert.issuer}
                      </Typography>
                    )}
                    {cert.issuedOn && (
                      <Typography variant="body" className="text-xs text-grey-blue dark:text-slate-400">
                        {format(new Date(cert.issuedOn), "MMM yyyy")}
                        {cert.expiresOn && ` – ${format(new Date(cert.expiresOn), "MMM yyyy")}`}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Languages & Tags row */}
      {(languages.length > 0 || tags.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {languages.length > 0 && (
            <SectionCard title="Languages" icon={Globe}>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg text-sm font-medium text-blue-700 dark:text-blue-300"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}

          {tags.length > 0 && (
            <SectionCard title="Tags" icon={Tag}>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-lg text-sm text-dark-blue dark:text-white"
                  >
                    <Tag className="h-3 w-3 text-grey-blue dark:text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      )}
    </div>
  );
};

export default OrgInfo;
