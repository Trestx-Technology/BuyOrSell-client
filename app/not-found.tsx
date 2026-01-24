"use client";

import { NotFoundCard } from "@/components/global/fallback-cards";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Container1080 } from "@/components/layouts/container-1080";

export default function NotFound() {
      return (
            <div className="min-h-screen bg-white flex flex-col">
                  <Container1080 className="flex-1 flex flex-col items-center justify-center">
                        <NotFoundCard
                              title="Page Not Found"
                              description="The page you are looking for does not exist or has been moved."
                              action={
                                    <Link href="/">
                                          <Button size="lg" className="min-w-[200px]">
                                                Return Home
                                          </Button>
                                    </Link>
                              }
                        />
                  </Container1080>
            </div>
      );
}
