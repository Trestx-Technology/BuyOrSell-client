"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
      LogOut,
      User,
      Briefcase,
      Building2,
      CreditCard,
      Settings,
      ChevronRight,
      ShoppingBag,
      ShieldCheck,
      HelpCircle,
} from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";
import { ICONS } from "@/constants/icons";

interface UnifiedProfileMenuProps {
      onLogout: () => void;
      onClose?: () => void;
}

export function UnifiedProfileMenu({
      onLogout,
      onClose,
}: UnifiedProfileMenuProps) {
      const { t, locale, localePath } = useLocale();

      const menuGroups = [
            {
                  label: "Marketplace",
                  items: [
                        { id: "profile", href: "/user/profile", icon: ICONS.navigation.profile, label: t.home.navbar.myProfile },
                        { id: "my-ads", href: "/user/profile", icon: ICONS.navigation.myAds, label: t.home.navbar.myAds },
                        { id: "my-chats", href: "/chat", icon: ICONS.ui.chat, label: t.home.navbar.myChats },
                        { id: "favorites", href: "/favorites", icon: ICONS.navigation.favorites, label: t.home.navbar.favourites },
                        { id: "my-searches", href: "/user/search-history", icon: ICONS.navigation.search, label: t.home.navbar.mySearches },
                        { id: "notifications", href: "/user/notifications", icon: ICONS.navigation.notificationBell, label: t.home.navbar.notifications },
                  ]
            },
            {
                  label: "Jobs & Networking",
                  items: [
                        { id: "jobs-dashboard", href: "/jobs", icon: ICONS.jobNavigation.jobsDashboard, label: t.home.navbar.jobsDashboard },
                        { id: "jobseekers", href: "/jobs/jobseeker", icon: ICONS.jobNavigation.jobseekers, label: t.home.navbar.jobseekers },
                        { id: "connections", href: "/connections", icon: ICONS.ui.connections, label: t.home.navbar.myConnections },
                        { id: "post-job", href: "/post-job/select", icon: ICONS.jobNavigation.postJob, label: t.home.navbar.postJob },
                        { id: "my-job-listings", href: "/jobs/listing/my", icon: ICONS.jobNavigation.myJobListings, label: t.home.navbar.myJobListings },
                        { id: "my-job-profile", href: "/jobs/my-profile", icon: ICONS.jobNavigation.myJobProfile, label: t.home.navbar.myJobProfile },
                  ]
            },
            {
                  label: "Business",
                  items: [
                        { id: "organizations", href: "/organizations/my", icon: ICONS.jobNavigation.organizations, label: t.home.navbar.myOrganizations },
                        { id: "saved-organizations", href: "/organizations/saved", icon: ICONS.navigation.favorites, label: t.home.navbar.savedOrganizations },
                  ]
            },
            {
                  label: "Billing & Tokens",
                  items: [
                        { id: "offers", href: "/plans", icon: ICONS.navigation.offersPackages, label: t.home.navbar.offersPackages },
                        { id: "my-subscriptions", href: "/my-subscriptions", icon: ICONS.navigation.mySubscriptions, label: t.home.navbar.mySubscriptions },
                        { id: "ai-tokens", href: "/ai-tokens", icon: ICONS.ai.aiPurpleBg, label: t.home.navbar.aiTokens },
                  ]
            },
            {
                  label: "Account",
                  items: [
                        { id: "emarati-status", href: "/user/emarati-status", icon: ICONS.ui.emaratiStatus, label: t.home.navbar.emaratiStatus },
                        { id: "view-on-map", href: "/map-view", icon: ICONS.ui.Map, label: t.home.navbar.viewOnMap },
                        { id: "settings", href: "/user/profile/settings", icon: ICONS.navigation.settings, label: t.home.navbar.settings },
                  ]
            },
            {
                  label: "Support",
                  items: [
                        { id: "help-center", href: "/help-centre", icon: ICONS.navigation.helpCenter, label: t.home.navbar.helpCenter },
                        { id: "contact-us", href: "/contact-us", icon: ICONS.navigation.contactUs, label: t.home.navbar.contactUs },
                        { id: "rate-us", href: "/rate-us", icon: ICONS.navigation.starRate, label: t.home.navbar.rateUs },
                        {
                              id: "share",
                              icon: ICONS.navigation.share,
                              label: t.home.navbar.shareWithFriend,
                              onClick: () => {
                                    if (typeof navigator !== "undefined" && navigator.share) {
                                          navigator.share({
                                                title: "BuyOrSell",
                                                text: "Check out this amazing marketplace app!",
                                                url: window.location.origin,
                                          });
                                    }
                              }
                        },
                  ]
            },
            {
                  label: "Legal",
                  items: [
                        { id: "privacy-policy", href: "/privacy-policy", icon: ICONS.navigation.privacyPolicy, label: t.home.navbar.privacyPolicy },
                        { id: "terms-conditions", href: "/terms-conditions", icon: ICONS.navigation.termsConditions, label: t.home.navbar.termsConditions },
                  ]
            }
      ];

      const renderItemContent = (icon: any, label: string) => (
            <>
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                        {typeof icon === 'string' ? (
                              <Image src={icon} alt={label} width={24} height={24} className="object-contain" />
                        ) : (
                              React.createElement(icon, { className: "w-6 h-6 text-gray-500 group-hover:text-purple" })
                        )}
                  </div>
                  <span className="flex-grow text-gray-700 dark:text-gray-200 font-medium text-sm group-hover:text-purple transition-colors">
                        {label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
            </>
      );

      return (
            <div className="w-[320px] bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
                  <div className="p-2 space-y-4 max-h-[calc(100vh-160px)] sm:max-h-[600px] overflow-y-auto custom-scrollbar">
                        {menuGroups.map((group, gIdx) => (
                              <div key={group.label} className="space-y-1">
                                    <div className="px-3 py-1.5 flex items-center gap-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-900/50 rounded-lg mb-1">
                                          {group.label}
                                    </div>
                                    {group.items.map((item: any) => {
                                          const content = renderItemContent(item.icon, item.label);
                                          const className = "group flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-200 w-full text-left";

                                          if (item.onClick) {
                                                return (
                                                      <button
                                                            key={item.id}
                                                            onClick={() => {
                                                                  item.onClick();
                                                                  onClose?.();
                                                            }}
                                                            className={className}
                                                      >
                                                            {content}
                                                      </button>
                                                );
                                          }

                                          return (
                                                <Link
                                                      key={item.id}
                                                      href={localePath(item.href)}
                                                      onClick={onClose}
                                                      className={className}
                                                >
                                                      {content}
                                                </Link>
                                          );
                                    })}
                              </div>
                        ))}
                  </div>

                  {/* Sign Out Section */}
                  <div className="p-2 bg-gray-50/80 dark:bg-gray-900/80 border-t border-gray-100 dark:border-gray-800">
                        <button
                              onClick={() => {
                                    onLogout();
                                    onClose?.();
                              }}
                              className="group flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
                        >
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                    <LogOut className="w-5 h-5 text-red-500" />
                              </div>
                              <span className="text-red-500 font-bold text-sm tracking-wide">
                                    {t.home.navbar.signOut}
                              </span>
                        </button>
                  </div>

                  <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
        }
      `}</style>
            </div>
      );
}
