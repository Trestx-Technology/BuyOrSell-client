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
            if (typeof window !== "undefined" && window.google && window.google.maps) {
                  setIsLoaded(true);
            }
      }, []);

      return (
            <GoogleMapsContext.Provider value={{ isLoaded, error }}>
                  <Script
                        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&libraries=places`}
                        strategy="afterInteractive"
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setError(true)}
                  />
                  {children}
            </GoogleMapsContext.Provider>
      );
}
