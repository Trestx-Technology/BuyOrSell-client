"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/typography";
import { FALLBACK_ICONS } from "@/constants/icons";
import { cn } from "@/lib/utils";

interface FallbackCardProps {
      title: string;
      description?: string;
      icon?: string;
      action?: React.ReactNode;
      className?: string;
      iconClassName?: string;
      children?: React.ReactNode;
}

const FallbackCard: React.FC<FallbackCardProps> = ({
      title,
      description,
      icon,
      action,
      className,
      iconClassName,
      children,
}) => {
      return (
            <Card className={cn("w-full h-full flex items-center justify-center p-6 bg-transparent border-none shadow-none", className)}>
                  <CardContent className="flex flex-col items-center justify-center text-center space-y-4 p-0">
                        {icon && (
                              <div className={cn("relative w-56 h-56 mb-4", iconClassName)}>
                                    <Image
                                          src={icon}
                                          alt={title}
                                          fill
                                          className="object-contain"
                                          priority
                                    />
                              </div>
                        )}
                        <div className="space-y-2 max-w-md">
                              <Typography variant="h1" className="text-gray-900">
                                    {title}
                              </Typography>
                              {description && (
                                    <Typography variant="body" className="text-gray-500">
                                          {description}
                                    </Typography>
                              )}
                        </div>
                        {children}
                        {action && <div className="mt-6">{action}</div>}
                  </CardContent>
            </Card>
      );
};

interface SpecificFallbackProps extends Omit<FallbackCardProps, "icon"> {
      icon?: string; // Optional override
}

export const NotFoundCard: React.FC<SpecificFallbackProps> = ({
      title = "Page Not Found",
      description = "The page you are looking for does not exist or has been moved.",
      icon = FALLBACK_ICONS["404"],
      ...props
}) => {
      return <FallbackCard title={title} description={description} icon={icon} {...props} />;
};

export const NoDataCard: React.FC<SpecificFallbackProps> = ({
      title = "No Data Found",
      description = "We couldn't find any data to display here.",
      icon = FALLBACK_ICONS.noData,
      ...props
}) => {
      return <FallbackCard title={title} description={description} icon={icon} {...props} />;
};

export default FallbackCard;
