import React from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";

export class StripeErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Stripe Elements Error:", error, errorInfo);
  }

  render() {
    console.log("Stripe Error Boundary Rendered", this.state.hasError);
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="mb-4 text-green-600 flex justify-center">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <Typography variant="h4" className="mb-2 font-bold text-gray-900">
              Payment Session Expired
            </Typography>
            <p className="text-gray-500 mb-8">
              The current session is expired. Please create a new payment request
              from the app.
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              Return to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
