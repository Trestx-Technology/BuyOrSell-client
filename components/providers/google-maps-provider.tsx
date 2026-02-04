"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Script from "next/script";

interface GoogleMapsContextType {
      isLoaded: boolean;
      error: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
      isLoaded: false,
      error: false,
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
      const [isLoaded, setIsLoaded] = useState(false);
      const [error, setError] = useState(false);

      useEffect(() => {
      // Check if script is already loaded by other means or persistent navigation
        if (typeof window !== "undefined") {
              if (window.google && window.google.maps) {
                    setIsLoaded(true);
      } else {
            const script = document.getElementById("google-maps-script");
            if (script) {
                  // If script exists but window.google.maps is not ready, we might want to attach listeners
                  // But usually next/script handles this.
                  // For now, simpler check.
                  script.addEventListener('load', () => setIsLoaded(true));
                  script.addEventListener('error', () => setError(true));
            }
      }
        }
  }, []);

      return (
            <GoogleMapsContext.Provider value={{ isLoaded, error }}>
                  <Script
                    id="google-maps-script"
                        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&libraries=places,geometry,drawing`}
                    strategy="afterInteractive"
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setError(true)}
              />
              {children}
        </GoogleMapsContext.Provider>
  );
}
