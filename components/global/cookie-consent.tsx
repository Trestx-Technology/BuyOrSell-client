"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Cookie } from "lucide-react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
} from "@/components/ui/responsive-modal";
import Link from "next/link";
import { firebase } from "@/lib/firebase/config";
import { useAuthStore } from "@/stores/authStore";
import { updateUser } from "@/app/api/user/user.services";
import { CookieService } from "@/services/cookie-service";

const CONSENT_COOKIE_NAME = "buyorsell_cookie_consent";
const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    notifications: false,
  });

  useEffect(() => {
    // Check if consent has already been given - prioritizing cookie over localStorage
    const consent = CookieService.get(CONSENT_COOKIE_NAME) || localStorage.getItem("site-consent");
    
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        const parsedConsent = JSON.parse(consent);
        setPreferences(parsedConsent);
        
        // Migrate to cookie if it was only in localStorage
        if (!CookieService.get(CONSENT_COOKIE_NAME)) {
          CookieService.set(CONSENT_COOKIE_NAME, consent, { maxAge: ONE_YEAR_IN_SECONDS });
        }
      } catch (e) {
        console.error("Error parsing consent", e);
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      notifications: false,
    };
    savePreferences(allAccepted);
    requestNotificationPermission();
  };

  const savePreferences = (prefs: any) => {
    const prefsString = JSON.stringify(prefs);
    setPreferences(prefs);
    
    // Store in both for maximum persistence
    CookieService.set(CONSENT_COOKIE_NAME, prefsString, { maxAge: ONE_YEAR_IN_SECONDS });
    localStorage.setItem("site-consent", prefsString);
    
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    if (preferences.notifications) {
      requestNotificationPermission();
    }
  };

  const { session, updateUser: updateLocalUser } = useAuthStore();
  const user = session?.user;

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      if (
        Notification.permission !== "granted" &&
        Notification.permission !== "denied"
      ) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            const currentPrefs = JSON.parse(
              CookieService.get(CONSENT_COOKIE_NAME) || localStorage.getItem("site-consent") || "{}",
            );
            const newPrefs = { ...currentPrefs, notifications: true };
            const prefsString = JSON.stringify(newPrefs);
            
            CookieService.set(CONSENT_COOKIE_NAME, prefsString, { maxAge: ONE_YEAR_IN_SECONDS });
            localStorage.setItem("site-consent", prefsString);

            // Register FCM Token if the user is logged in
            if (user?._id) {
              const token = await firebase.getFCMToken();
              if (token) {
                await updateUser(user._id, { deviceKey: token });
                updateLocalUser({ deviceKey: token });
              }
            }
          }
        } catch (e) {
          console.error("Error requesting notification permission", e);
        }
      } else if (Notification.permission === "granted") {
        // If already granted, but we want to ensure token is synced when preferences change
        if (user?._id) {
          try {
            const token = await firebase.getFCMToken();
            if (token && user.deviceKey !== token) {
              await updateUser(user._id, { deviceKey: token });
              updateLocalUser({ deviceKey: token });
            }
          } catch (e) {
            console.error("Error updating FCM token", e);
          }
        }
      }
    }
  };

  if (!showBanner && !showPreferences) return null;

  return (
    <>
      {showBanner && !showPreferences && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 bg-background border-t shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center animate-in slide-in-from-bottom duration-500">
          <div className="flex-1 max-w-4xl">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
              <Cookie className="h-5 w-5 text-primary" />
              We value your privacy
            </h3>
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your browsing experience, serve
              personalized ads or content, and analyze our traffic. By clicking
              &quot;Accept All&quot;, you consent to our use of cookies and
              enable notifications.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              For more details, please review our{" "}
              <Link
                href="/privacy-policy"
                className="underline hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms-and-conditions"
                className="underline hover:text-primary transition-colors"
              >
                Terms & Conditions
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0 mt-3 sm:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowPreferences(true)}
              className="whitespace-nowrap"
            >
              Manage Preferences
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="whitespace-nowrap bg-primary text-primary-foreground"
            >
              Accept All
            </Button>
          </div>
        </div>
      )}

      <ResponsiveModal open={showPreferences} onOpenChange={setShowPreferences}>
        <ResponsiveModalContent className="sm:max-w-[550px] z-[110]">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              Privacy & Notification Preferences
            </ResponsiveModalTitle>
            <ResponsiveModalDescription>
              Manage your cookie and notification settings below. Strictly
              necessary cookies cannot be disabled as they are essential for the
              website to function. Read our{" "}
              <Link
                href="/privacy-policy"
                className="underline hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms-and-conditions"
                className="underline hover:text-primary transition-colors"
              >
                Terms & Conditions
              </Link>{" "}
              for more information.
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>

          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1 scrollbar-hide">
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 bg-muted/30">
              <Checkbox id="necessary" checked disabled className="mt-1" />
              <div className="space-y-1.5 leading-none flex-1">
                <label htmlFor="necessary" className="font-semibold text-sm">
                  Strictly Necessary Cookies
                </label>
                <p className="text-sm text-muted-foreground leading-snug">
                  These cookies are required for the website to function and
                  cannot be switched off. They are usually only set in response
                  to actions made by you.
                </p>
              </div>
            </div>

            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 transition-colors hover:bg-muted/30">
              <Checkbox
                id="analytics"
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    analytics: checked === true,
                  }))
                }
                className="mt-1"
              />
              <div className="space-y-1.5 leading-none flex-1">
                <label
                  htmlFor="analytics"
                  className="font-semibold text-sm cursor-pointer"
                >
                  Analytics Cookies
                </label>
                <p className="text-sm text-muted-foreground leading-snug">
                  These cookies allow us to count visits and traffic sources so
                  we can measure and improve the performance of our site.
                </p>
              </div>
            </div>

            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 transition-colors hover:bg-muted/30">
              <Checkbox
                id="marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    marketing: checked === true,
                  }))
                }
                className="mt-1"
              />
              <div className="space-y-1.5 leading-none flex-1">
                <label
                  htmlFor="marketing"
                  className="font-semibold text-sm cursor-pointer"
                >
                  Marketing Cookies
                </label>
                <p className="text-sm text-muted-foreground leading-snug">
                  These cookies may be set through our site by our advertising
                  partners to build a profile of your interests and show you
                  relevant ads.
                </p>
              </div>
            </div>

            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-primary/20 bg-primary/5 p-4 transition-colors">
              <Checkbox
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    notifications: checked === true,
                  }))
                }
                className="mt-1"
              />
              <div className="space-y-1.5 leading-none flex-1">
                <label
                  htmlFor="notifications"
                  className="font-semibold text-sm cursor-pointer flex items-center gap-2"
                >
                  <Bell className="h-4 w-4 text-primary" /> Enable Notifications
                </label>
                <p className="text-sm text-muted-foreground leading-snug">
                  Allow us to send you push notifications for important updates,
                  new messages from buyers/sellers, and localized alerts.
                </p>
              </div>
            </div>
          </div>

          <ResponsiveModalFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setShowPreferences(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </Button>
          </ResponsiveModalFooter>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </>
  );
}
