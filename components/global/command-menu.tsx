"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "nextjs-toploader/app";
import {
      Search,
      Home,
      PlusCircle,
      CreditCard,
      User,
      MessageSquare,
      Heart,
      MapPin,
      Settings,
      LayoutGrid,
      Sparkles,
      Navigation,
      Bell,
      History,
      Briefcase,
      Users,
      UserPlus,
      FilePlus,
      Building2,
      Gift,
      ShieldCheck,
      HelpCircle,
      Phone,
      Star,
      Lock,
      FileText,
      BriefcaseBusiness,
} from "lucide-react";
import {
      ResponsiveModal,
      ResponsiveModalContent,
} from "@/components/ui/responsive-modal";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

export function CommandMenu() {
      const [open, setOpen] = useState(false);
      const [search, setSearch] = useState("");
      const [selectedIndex, setSelectedIndex] = useState(0);
      const router = useRouter();
      const { localePath, t } = useLocale();

      const scrollContainerRef = React.useRef<HTMLDivElement>(null);
      const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

      useEffect(() => {
            const down = (e: KeyboardEvent) => {
                  if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        setOpen((open) => !open);
                  }
            };

            document.addEventListener("keydown", down);
            return () => document.removeEventListener("keydown", down);
      }, []);

      useEffect(() => {
            setSelectedIndex(0);
            itemRefs.current = [];
      }, [search, open]);

      useEffect(() => {
            if (open && itemRefs.current[selectedIndex]) {
                  itemRefs.current[selectedIndex]?.scrollIntoView({
                        block: "nearest",
                        behavior: "smooth"
                  });
            }
      }, [selectedIndex, open]);

      const navItems = useMemo(() => [
            // --- General ---
            { title: "Home", icon: <Home className="w-4 h-4" />, href: "/", category: "General" },
            { title: "Post Ad", icon: <PlusCircle className="w-4 h-4" />, href: "/post-ad", category: "General" },
            { title: "Map View", icon: <MapPin className="w-4 h-4" />, href: "/map-view", category: "General" },
            { title: "Help Center", icon: <HelpCircle className="w-4 h-4" />, href: "/help-centre", category: "General" },

            // --- Marketplace ---
            { title: t.home.navbar.myAds, icon: <LayoutGrid className="w-4 h-4" />, href: "/user/profile", category: "Marketplace" },
            { title: t.home.navbar.myChats, icon: <MessageSquare className="w-4 h-4" />, href: "/chat", category: "Marketplace" },
            { title: t.home.navbar.favourites, icon: <Heart className="w-4 h-4" />, href: "/favorites", category: "Marketplace" },
            { title: t.home.navbar.mySearches, icon: <History className="w-4 h-4" />, href: "/user/search-history", category: "Marketplace" },
            { title: t.home.navbar.notifications, icon: <Bell className="w-4 h-4" />, href: "/user/notifications", category: "Marketplace" },

            // --- Jobs & Networking ---
            { title: t.home.navbar.jobsDashboard, icon: <Briefcase className="w-4 h-4" />, href: "/jobs", category: "Jobs & Networking" },
            { title: t.home.navbar.jobseekers, icon: <Users className="w-4 h-4" />, href: "/jobs/jobseeker", category: "Jobs & Networking" },
            { title: t.home.navbar.myConnections, icon: <UserPlus className="w-4 h-4" />, href: "/connections", category: "Jobs & Networking" },
            { title: t.home.navbar.postJob, icon: <FilePlus className="w-4 h-4" />, href: "/post-job/select", category: "Jobs & Networking" },
            { title: t.home.navbar.myJobListings, icon: <BriefcaseBusiness className="w-4 h-4" />, href: "/jobs/listing/my", category: "Jobs & Networking" },
            { title: t.home.navbar.myJobProfile, icon: <User className="w-4 h-4" />, href: "/jobs/my-profile", category: "Jobs & Networking" },

            // --- Business ---
            { title: t.home.navbar.myOrganizations, icon: <Building2 className="w-4 h-4" />, href: "/organizations/my", category: "Business" },
            { title: t.home.navbar.savedOrganizations, icon: <Heart className="w-4 h-4" />, href: "/organizations/saved", category: "Business" },

            // --- Billing & Tokens ---
            { title: t.home.navbar.offersPackages, icon: <Gift className="w-4 h-4" />, href: "/plans", category: "Billing & Tokens" },
            { title: t.home.navbar.mySubscriptions, icon: <CreditCard className="w-4 h-4" />, href: "/my-subscriptions", category: "Billing & Tokens" },
            { title: t.home.navbar.aiTokens, icon: <Sparkles className="w-4 h-4" />, href: "/ai-tokens", category: "Billing & Tokens" },

            // --- Account ---
            { title: t.home.navbar.myProfile, icon: <User className="w-4 h-4" />, href: "/user/profile", category: "Account" },
            { title: t.home.navbar.emaratiStatus, icon: <ShieldCheck className="w-4 h-4" />, href: "/user/emarati-status", category: "Account" },
            { title: t.home.navbar.settings, icon: <Settings className="w-4 h-4" />, href: "/user/profile/settings", category: "Account" },

            // --- Support & Legal ---
            { title: t.home.navbar.contactUs, icon: <Phone className="w-4 h-4" />, href: "/contact-us", category: "Support & Legal" },
            { title: t.home.navbar.rateUs, icon: <Star className="w-4 h-4" />, href: "/rate-us", category: "Support & Legal" },
            { title: t.home.navbar.privacyPolicy, icon: <Lock className="w-4 h-4" />, href: "/privacy-policy", category: "Support & Legal" },
            { title: t.home.navbar.termsConditions, icon: <FileText className="w-4 h-4" />, href: "/terms-conditions", category: "Support & Legal" },
      ], [t]);

      const filteredItems = useMemo(() => {
            if (!search) return navItems;
            return navItems.filter((item) =>
                  item.title.toLowerCase().includes(search.toLowerCase()) ||
                  item.category.toLowerCase().includes(search.toLowerCase())
            );
      }, [search, navItems]);

      const categories = Array.from(new Set(filteredItems.map((item) => item.category)));

      const handleSelect = (href: string) => {
            setOpen(false);
            setSearch("");
            router.push(localePath(href));
      };

      const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
            } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
            } else if (e.key === "Enter") {
                  e.preventDefault();
                  const selected = filteredItems[selectedIndex];
                  if (selected) {
                        handleSelect(selected.href);
                  }
            }
      };

      let itemCounter = 0;

      return (
            <ResponsiveModal open={open} onOpenChange={setOpen}>
                  <ResponsiveModalContent showCloseButton={false} className="p-0 overflow-hidden border-none shadow-2xl max-w-lg bg-white dark:bg-gray-950">
                        <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                              <Search className="w-5 h-5 text-gray-400 mr-3" />
                              <input
                                    placeholder="Search navigation... (e.g. 'Post Ad')"
                                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                              />
                              <div className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-[10px] text-gray-400 flex items-center gap-1">
                                    <kbd className="font-sans">ESC</kbd>
                              </div>
                        </div>

                        <div
                              ref={scrollContainerRef}
                              className="max-h-[350px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800"
                        >
                              {filteredItems.length === 0 ? (
                                    <div className="py-12 text-center">
                                          <p className="text-sm text-gray-500">No results found for "{search}"</p>
                                    </div>
                              ) : (
                                    categories.map((category) => (
                                          <div key={category} className="mb-2">
                                                <h3 className="px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                                                      {category}
                                                </h3>
                                                <div className="space-y-1">
                                                      {filteredItems
                                                            .filter((item) => item.category === category)
                                                            .map((item) => {
                                                                  const currentIndex = itemCounter++;
                                                                  const isSelected = selectedIndex === currentIndex;

                                                                  return (
                                                                        <button
                                                                              key={item.href}
                                                                              ref={(el) => {
                                                                                    itemRefs.current[currentIndex] = el;
                                                                              }}
                                                                              onClick={() => handleSelect(item.href)}
                                                                              onMouseEnter={() => setSelectedIndex(currentIndex)}
                                                                              className={cn(
                                                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group text-left outline-none",
                                                                                    isSelected
                                                                                          ? "bg-purple/10 text-purple"
                                                                                          : "text-gray-700 dark:text-gray-300 hover:bg-purple/5 hover:text-purple"
                                                                              )}
                                                                        >
                                                                              <div className={cn(
                                                                                    "p-1.5 rounded-md transition-colors",
                                                                                    isSelected ? "bg-purple/20" : "bg-gray-50 dark:bg-gray-900 group-hover:bg-purple/10"
                                                                              )}>
                                                                                    {item.icon}
                                                                              </div>
                                                                              <span className="flex-1 font-medium">{item.title}</span>
                                                                              <Navigation className={cn(
                                                                                    "w-3.5 h-3.5 transition-opacity text-purple",
                                                                                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                                                              )} />
                                                                        </button>
                                                                  );
                                                            })}
                                                </div>
                                          </div>
                                    ))
                              )}
                        </div>

                        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                              <div className="flex items-center gap-4 text-[10px] text-gray-400">
                                    <div className="flex items-center gap-1">
                                          <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">↵</kbd>
                                          <span>to select</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                          <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">↑↓</kbd>
                                          <span>to navigate</span>
                                    </div>
                              </div>
                              <div className="text-[10px] font-medium text-purple/60">
                                    BuyOrSell QuickNav
                              </div>
                        </div>
                  </ResponsiveModalContent>
            </ResponsiveModal>
      );
}
