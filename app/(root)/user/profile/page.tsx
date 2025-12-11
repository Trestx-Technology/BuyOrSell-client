"use client";
import React from "react";
import ProfileCard from "../_components/profile-card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAds } from "@/constants/sample-listings";
import MyAdCard from "../_components/my-ads-card";
import UserReviews from "../_components/user-reviews";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Typography } from "@/components/typography";

const ProfilePage = () => {
  const router = useRouter();
  const handleEdit = () => {
    console.log("Edit profile clicked");
    router.push("/user/profile/edit");
    // Add your edit logic here
  };

  return (
    <div className="w-full bg-gray-50">
      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant={"ghost"}
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size={"icon-sm"}
          className="absolute left-4 text-purple"
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          My Profile
        </Typography>
      </div>

      <div className="flex flex-col gap-5 py-8 px-4 xl:px-0">
        <Link
          href={"/user/profile"}
          className="text-purple-600 font-semibold text-sm"
        >
          My Profile
        </Link>
        <ProfileCard
          name="Sameer Khan"
          rating={4.8}
          joinDate="24th Aug, 2025"
          isVerified={true}
          onEdit={handleEdit}
        />

        <Tabs
          defaultValue="ads"
          className="w-full mx-auto flex justify-center flex-col items-center"
        >
          <TabsList className="w-full">
            <TabsTrigger className="w-full sm:w-[150px]" value="ads">
              My Ads
            </TabsTrigger>
            <TabsTrigger className="w-full sm:w-[150px]" value="reviews">
              My Ratings
            </TabsTrigger>
          </TabsList>
          <TabsContent
            className=" w-full grid grid-cols-2 sm:flex flex-wrap gap-3 justify-center"
            value="ads"
          >
            {mockAds.slice(0, 8).map((ad) => (
              <React.Fragment key={ad.id}>
                <MyAdCard
                  {...ad}
                  onFavorite={(id) => console.log("Favorited:", id)}
                  onShare={(id) => console.log("Shared:", id)}
                  onClick={(id) => console.log("Clicked:", id)}
                  className="min-h-[284px] w-full max-w-[255px]"
                />
              </React.Fragment>
            ))}
          </TabsContent>
          <TabsContent className=" w-full" value="reviews">
            <UserReviews userId="1" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
