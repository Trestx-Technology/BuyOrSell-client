"use client";

import React from "react";
import { HorizontalCarouselSlider } from "@/components/global/horizontal-carousel-slider";
import { sampleListings } from "@/constants/sample-listings";

const CarouselDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Horizontal Carousel Slider Demo
          </h1>
          <p className="text-lg text-gray-600">
            A bottom-positioned horizontal carousel that displays listing cards
            and opens a drawer on click
          </p>
        </div>

        {/* Demo Section 1: Basic Carousel */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Basic Carousel (Auto-scroll enabled)
          </h2>
          <p className="text-gray-600 mb-4">
            This carousel automatically scrolls through items every 4 seconds
            and shows navigation arrows.
          </p>
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              Carousel will appear at the bottom of the screen
            </p>
          </div>
        </div>

        {/* Demo Section 2: Custom Configuration */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Custom Configuration Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Props Available:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  • <code className="bg-gray-100 px-1 rounded">items</code> -
                  Array of ListingCardProps
                </li>
                <li>
                  •{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    showNavigation
                  </code>{" "}
                  - Show/hide arrow buttons
                </li>
                <li>
                  • <code className="bg-gray-100 px-1 rounded">autoScroll</code>{" "}
                  - Enable/disable auto-scrolling
                </li>
                <li>
                  •{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    autoScrollInterval
                  </code>{" "}
                  - Time between auto-scrolls
                </li>
                <li>
                  • <code className="bg-gray-100 px-1 rounded">cardWidth</code>{" "}
                  - Width of each card
                </li>
                <li>
                  • <code className="bg-gray-100 px-1 rounded">gap</code> -
                  Space between cards
                </li>
                <li>
                  •{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    showScrollbar
                  </code>{" "}
                  - Show/hide scrollbar
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Features:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 🎯 Bottom-positioned fixed layout</li>
                <li>• 🖱️ Click cards to open detailed drawer</li>
                <li>• 🎨 Smooth animations with Framer Motion</li>
                <li>• 📱 Responsive design</li>
                <li>• 🔄 Auto-scroll functionality</li>
                <li>• 🎯 Navigation dots and arrows</li>
                <li>• 💖 Favorite toggle support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Section 3: Integration */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Integration with Existing Components
          </h2>
          <p className="text-gray-600 mb-4">
            The carousel integrates seamlessly with your existing{" "}
            <code className="bg-gray-100 px-1 rounded">ListingCard</code>{" "}
            component and uses the same data structure from{" "}
            <code className="bg-gray-100 px-1 rounded">sampleListings</code>.
          </p>
          <div className="bg-gray-100 rounded-lg p-4">
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {`import { HorizontalCarouselSlider } from "@/components/global/horizontal-carousel-slider";

<HorizontalCarouselSlider
  items={sampleListings.slice(0, 10)}
  showNavigation={true}
  autoScroll={true}
  autoScrollInterval={4000}
  cardWidth={280}
  gap={16}
  showScrollbar={false}
/>`}
            </pre>
          </div>
        </div>
      </div>

      {/* The actual carousel will appear at the bottom */}
      <HorizontalCarouselSlider
        items={sampleListings.slice(0, 10)}
        showNavigation={true}
        autoScroll={true}
        autoScrollInterval={4000}
        cardWidth={280}
        gap={16}
        showScrollbar={false}
      />
    </div>
  );
};

export default CarouselDemo;
