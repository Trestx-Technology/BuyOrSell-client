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
import { useRouter, useParams } from "next/navigation";


import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { StripeErrorBoundary } from "@/components/payment/StripeErrorBoundary"; // Fixed import path logic
import { LocalStorageService } from "@/services/local-storage";
import { AUTH_TOKEN_NAMES } from "@/constants/auth.constants";

const stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

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
      const { mutate: createPaymentIntent, isPending } = useCreatePaymentIntent();
      const user = useAuthStore((state) => state.session.user);
      const router = useRouter();
      const params = useParams(); // Get params
      const locale = params?.locale || "en-US"; // Fallback locale

      // Payment state
      const [showPaymentModal, setShowPaymentModal] = useState(false);
      const [paymentData, setPaymentData] = useState<{
            clientSecret: string;
            paymentIntentId: string;
            amount: number;
      } | null>(null);

      const handleSubscribe = () => {
            if (!user) {
                  toast.error("Please login to subscribe");
                  // Optional: router.push("/login");
                  return;
            }

            const numericPrice = parseFloat(plan.price.replace(/,/g, ""));
            const amount = Math.round(numericPrice * 100);

            const payload = {
                  amount: amount,
                  currency: "aed",
                  status: "pending" as const,
                  type: "PLAN",
                  typeId: plan.id,
                  userId: user._id,
            };

            createPaymentIntent(payload, {
                  onSuccess: (response) => {
                        const responseData = response.data || (response as any);
                        const clientSecret = responseData?.secret;
                        const paymentIntentId = responseData?.paymentIntentId;

                        if (clientSecret && paymentIntentId) {
                              setPaymentData({
                                    clientSecret: clientSecret,
                                    paymentIntentId: paymentIntentId,
                                    amount: amount,
                              });
                              setShowPaymentModal(true);
                        } else {
                              toast.error(`Failed to initiate subscription for ${plan.name}`);
                        }
                  },

            });
      };

      return (
            <>
                  <div
                        className={`w-full sm:max-w-xs rounded-2xl flex flex-col p-8 transition-all duration-300 ${plan.isPremium
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
                                                {plan.originalPrice}
                                          </Typography>
                                          <Typography
                                                variant="sm-regular"
                                                className={
                                                      plan.isPremium ? "text-purple-200" : "text-gray-500"
                                                }
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

                  {/* Payment Modal */}
                  {/* Payment Modal */}
                  <ResponsiveDialogDrawer
                        open={showPaymentModal}
                        onOpenChange={setShowPaymentModal}
                        title={`Subscribe to ${plan.name}`}
                        dialogContentClassName="sm:max-w-[500px]"
                  >
                        <div className="mt-4">
                              {paymentData && (
                                    <StripeErrorBoundary>
                                          <Elements
                                                stripe={stripePromise}
                                                options={{
                                                      clientSecret: paymentData.clientSecret,
                                                      appearance: { theme: "stripe" },
                                                }}
                                          >
                                                <PaymentForm
                                                      paymentIntentId={paymentData.paymentIntentId}
                                                      redirectUrl={process.env.NEXT_PUBLIC_APP_URL
                                                            ? `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/pay/response`
                                                            : `${window.location.origin}/${locale}/pay/response`
                                                      }
                                                      type="PLAN"
                                                      typeId={plan.id}
                                                      amount={(paymentData.amount / 100).toFixed(2)}
                                                      clientSecret={paymentData.clientSecret}
                                                      accessToken={
                                                            LocalStorageService.get(AUTH_TOKEN_NAMES.ACCESS_TOKEN) ||
                                                            ""
                                                      }
                                                />
                                          </Elements>
                                    </StripeErrorBoundary>
                              )}
                        </div>
                  </ResponsiveDialogDrawer>
            </>
      );
};


