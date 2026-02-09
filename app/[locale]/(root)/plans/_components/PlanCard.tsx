import React from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { cn } from "@/lib/utils";
import { useCreatePlanSubscriptionCheckout, useCreatePlanOneTimeCheckout } from "@/hooks/usePayments";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

interface PlanCardProps {
      plan: {
            id: string;
            validation: number;
            validationPeriod: string;
            name: string;
            icon: React.ElementType;
            price: string;
            originalPrice: string;
            description: string;
            features: string[];
            buttonText: string;
            isPopular: boolean;
            isPremium: boolean;
            isCurrent?: boolean;
      };
      perMonthText: string;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, perMonthText }) => {
      const IconComponent = plan.icon;
      const user = useAuthStore((state) => state.session.user);
      const router = useRouter();
      const params = useParams();
      const locale = params?.locale || "en-US";

      // Checkout mutations
      const { mutate: createSubscriptionCheckout, isPending: isSubPending } = useCreatePlanSubscriptionCheckout();
      const { mutate: createOneTimeCheckout, isPending: isOneTimePending } = useCreatePlanOneTimeCheckout();

      const isPending = isSubPending || isOneTimePending;

      const handleSubscribe = () => {
            if (!user) {
                  toast.error("Please login to subscribe");
          router.push(`/${locale}/login?redirect=/${locale}/plans`);
          return;
    }

        const isLifetime = plan.name.toLowerCase().includes("lifetime") || plan.validationPeriod.toLowerCase() === "lifetime";
        const numericPrice = parseFloat(plan.price.replace(/,/g, ""));
        const amountInSmallestUnit = Math.round(numericPrice * 100);

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        const successUrl = `${baseUrl}/${locale}/pay/response?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${baseUrl}/${locale}/plans`;

        if (isLifetime) {
              // One-time payment
              createOneTimeCheckout({
                    lineItems: [
                          {
                                name: plan.name,
                                amount: amountInSmallestUnit,
                                currency: "aed",
                        quantity: 1,
                  },
            ],
            successUrl,
            cancelUrl,
            type: "PLAN",
            typeId: plan.id,
            userId: user._id,
            customerEmail: user.email,
            mode: "payment",
      }, {
            onSuccess: (data) => {
                  if (data.data.checkoutUrl) {
                        window.location.href = data.data.checkoutUrl;
                  } else {
                        toast.error("Failed to generate payment link.");
                  }
                    },
      });
    } else {
          // Subscription
          createSubscriptionCheckout({
                successUrl,
                cancelUrl,
                type: "PLAN",
                typeId: plan.id,
                userId: user._id,
                customerEmail: user.email,
                mode: "subscription",
          }, {
                onSuccess: (data) => {
                      if (data.data.checkoutUrl) {
                            window.location.href = data.data.checkoutUrl;
                      } else {
                            toast.error("Failed to generate payment link.");
                      }
                },
      });
    }
  };

      return (
        <div
                  className={`w-full sm:max-w-xs rounded-2xl flex flex-col p-8 transition-all duration-300 relative ${plan.isPremium
                    ? "bg-purple-600 text-white"
                    : "bg-white border border-gray-200 hover:shadow-lg"
                        } ${plan.isPopular ? "border-purple shadow-md shadow-purple" : ""}`}
        >
                  {plan.isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm z-10">
                              Most Popular
                        </div>
                  )}
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
                                className={cn(
                                      "flex items-center",
                                      plan.isPremium ? "text-white" : "text-black"
                                )}
                          >
                                <Image
                                      src={
                                            plan.isPremium
                                                  ? ICONS.currency.aedWhite
                                                  : ICONS.currency.aedBlack
                                      }
                                      alt={plan.name}
                                      width={40}
                                      height={40}
                                />{" "}
                                {plan.price}
                          </Typography>
                          <div>
                                <Typography
                                      variant="sm-regular"
                                      className={`line-through ${plan.isPremium ? "text-purple-200" : "text-gray-400"
                                            }`}
                                >
                                          {plan.originalPrice && plan.originalPrice !== "0" && plan.originalPrice !== plan.price ? plan.originalPrice : ""}
                                </Typography>
                                <Typography
                                      variant="sm-regular"
                                          className={cn(
                                                "font-medium",
                                                plan.isPremium ? "text-purple-100" : "text-purple-600",
                                                plan.validation > 1 && "bg-purple-100/50 text-purple-700 px-2 py-0.5 rounded-md mt-1 inline-block"
                                          )}
                                >
                                          {plan.validation > 1
                                                ? `For ${plan.validation} ${plan.validationPeriod.toLowerCase()}${plan.validation > 1 ? 's' : ''}`
                                                : perMonthText}
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
                                <CheckCircle2 className="size-6 mt-0.5 flex-shrink-0 text-purple fill-white border-black" />
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
                    onClick={plan.isCurrent ? () => toast.info("You are already subscribed to this plan") : handleSubscribe}
                    disabled={isPending || plan.isCurrent}
                    className={`w-full rounded-lg font-medium ${plan.isPremium
                          ? "bg-white text-purple-600 hover:bg-gray-100"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                          } ${plan.isCurrent ? "opacity-100 bg-purple-200 text-purple-500 cursor-not-allowed" : ""}`}
              >
                    {isPending ? "Processing..." : plan.buttonText}
              </Button>
        </div>
  );
};
