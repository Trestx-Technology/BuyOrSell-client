"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  REGULAR_NAVIGATION_ITEMS,
  NavigationItem,
} from "@/constants/navigation.constants";

interface NavigationMenuProps {
  onLogout: () => void;
  translations: Record<string, string>;
}

export function NavigationMenu({
  onLogout,
  translations,
}: NavigationMenuProps) {
  const renderNavigationItem = (item: NavigationItem) => {
    if (item.type === "divider") {
      return <div key={item.id} className="border-t my-1" />;
    }

    const IconComponent =
      item.iconType === "lucide" && typeof item.icon !== "string"
        ? item.icon
        : null;
    const iconSrc =
      item.iconType === "image" && typeof item.icon === "string"
        ? item.icon
        : null;

    const content = (
      <>
        {IconComponent ? (
          <IconComponent className="w-6 h-6" />
        ) : iconSrc ? (
          <Image
            src={iconSrc}
            alt={item.alt || item.id}
            width={24}
            height={24}
          />
        ) : null}
        {translations[item.translationKey] || item.translationKey}
      </>
    );

    const className = `flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-purple-100 transition-colors text-gray-700 hover:text-purple ${
      item.className || ""
    }`;

    if (item.type === "button") {
      return (
        <button
          key={item.id}
          onClick={item.id === "sign-out" ? onLogout : item.onClick}
          className={className}
        >
          {content}
        </button>
      );
    }

    if (item.type === "link" && item.href) {
      return (
        <Link key={item.id} href={item.href} className={className}>
          {content}
        </Link>
      );
    }

    return null;
  };

  return (
    <div className="space-y-1">
      {REGULAR_NAVIGATION_ITEMS.map((item, index) => (
        <React.Fragment key={item.id}>
          {item.showDividerBefore && index > 0 && (
            <div className="border-t my-1" />
          )}
          {renderNavigationItem(item)}
        </React.Fragment>
      ))}
    </div>
  );
}
