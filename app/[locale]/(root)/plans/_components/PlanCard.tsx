import React, { useState } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { cn } from "@/lib/utils";
import { useCreatePaymentIntent } from "@/hooks/usePayments";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13+ app directory (though this file is client component, it might be safer to use next/navigation) - checking if used elsewhere. Default usually works.


interface PlanCardProps {
      plan: {
            id: string; // Added
            validation: number; // Added
            validationPeriod: string; // Added
            name: string;
            icon: React.ElementType;
            price: string;
            originalPrice: string;
            description: string;
            features: string[];
            buttonText: string;
            isPopular: boolean;
            isPremium: boolean;
      };
      perMonthText: string;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, perMonthText }) => {
      const IconComponent = plan.icon;
      const { mutate: createPaymentIntent, isPending } = useCreatePaymentIntent();
      const user = useAuthStore((state) => state.session.user);
      const router = useRouter(); // Use a hook to get router if navigation needed (e.g. to login)

      const handleSubscribe = () => {
            if (!user) {
                  toast.error("Please login to subscribe");
                  // Optional: router.push("/login");
                  return;
            }

            // Ensure amount is in correct unit (cents/fils)
            // Assuming plan.price is in full units (e.g., 50 for 50 AED) and API expects cents/fils (5000)
            // Remove commas if any from string price before parsing
            const numericPrice = parseFloat(plan.price.replace(/,/g, ''));
            const amount = Math.round(numericPrice * 100);

            // Map validationPeriod to planType format expected by backend (WEEKLY, MONTHLY, YEARLY)
            let planType = "MONTHLY"; // Default
            if (plan.validationPeriod === "MONTH") planType = "MONTHLY";
            else if (plan.validationPeriod === "YEAR") planType = "YEARLY";
            else if (plan.validationPeriod === "WEEK") planType = "WEEKLY";
            else if (plan.validationPeriod === "DAY") planType = "DAILY"; // Assuming DAILY might exist or fallback to MONTHLY if unknown

            const payload = {
                  amount: amount,
                  currency: "aed",
                  status: "pending" as const, // Explicit literal type
                  type: "PLAN",
                  typeId: plan.id,
                  userId: user._id,
            };

            createPaymentIntent(payload, {
                  onSuccess: (data) => {
                        // Handle success - likely redirect to payment gateway or show success
                        // If data contains a redirect URL or client secret, handle it
                        if (data.data?.clientSecret) {
                              // Example: Redirect or open Stripe Elements
                              console.log("Payment created", data);
                              toast.success("Payment initiated");
                        } else {
                              toast.success(`Payment initiated for ${plan.name}`);
                        }
                  },
                  onError: (error) => {
                        console.error(error);
                        toast.error("Failed to initiate payment");
                  }
            });
      };

      return (
            <div
                  className={`rounded-2xl flex flex-col p-8 transition-all duration-300 ${plan.isPremium
                        ? "bg-purple-600 text-white"
                        : "bg-white border border-gray-200 hover:shadow-lg"
                        }`}
            >
                  {/* Icon */}
                  <div className="flex justify-start mb-6">
                        <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${plan.isPremium ? "bg-white" : "bg-purple-600"
                                    }`}
                        >
                              <IconComponent
                                    className={`w-6 h-6 ${plan.isPremium ? "text-purple-600" : "text-white"
                                          }`}
                              />
                        </div>
                  </div>

                  {/* Plan Name */}
                  <Typography
                        variant="xl-semibold"
                        className={`text-left mb-2 ${plan.isPremium ? "text-white" : "text-black"
                              }`}
                  >
                        {plan.name}
                  </Typography>

                  {/* Pricing */}
                  <div className="text-left mb-4">
                        <div className="flex items-center justify-start gap-2">
                              <Typography
                                    variant="4xl-bold"
                                    className={cn("flex items-center", plan.isPremium ? "text-white" : "text-black")}
                              >
                                    <Image src={plan.isPremium ? ICONS.currency.aedWhite : ICONS.currency.aedBlack} alt={plan.name} width={40} height={40} />{" "}

                                    {plan.price}
                              </Typography>
                              <div>
                                    <Typography
                                          variant="sm-regular"
                                          className={`line-through ${plan.isPremium ? "text-purple-200" : "text-gray-400"
                                                }`}
                                    >
                                          {plan.originalPrice}
                                    </Typography>
                                    <Typography
                                          variant="sm-regular"
                                          className={plan.isPremium ? "text-purple-200" : "text-gray-500"}
                                    >
                                          {perMonthText}
                                    </Typography>
                              </div>
                        </div>
                  </div>

                  {/* Description */}
                  <Typography
                        variant="sm-regular"
                        className={`text-left mb-6 ${plan.isPremium ? "text-purple-200" : "text-gray-600"
                              }`}
                  >
                        {plan.description}
                  </Typography>

                  {/* Features List */}
                  <div className="space-y-3 flex-1 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-start gap-3">
                                    <CheckCircle2
                                          className={`size-6 mt-0.5 flex-shrink-0 ${plan.isPremium ? "fill-white text-purple" : "text-white fill-purple"
                                                }`}
                                    />
                                    <Typography
                                          variant="sm-regular"
                                          className={plan.isPremium ? "text-white" : "text-gray-600"}
                                    >
                                          {feature}
                                    </Typography>
                              </div>
                        ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                        onClick={handleSubscribe}
                        disabled={isPending}
                        className={`w-full rounded-lg font-medium ${plan.isPremium
                              ? "bg-white text-purple-600 hover:bg-gray-100"
                              : "bg-purple-600 text-white hover:bg-purple-700"
                              }`}
                  >
                        {isPending ? "Processing..." : plan.buttonText}
                  </Button>
            </div>
      );
};

