"use client";

import React, { useState } from "react";
import DrawerWrapper from "../../../../components/global/drawer-wrapper";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { FolderPlus, MoreHorizontal, Search, Plus, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateCollectionDialog } from "@/app/(root)/favorites/_components/CreateCollectionDialog";
import { mockAds } from "@/constants/sample-listings";
import { Collection } from "./add-to-collection-dialog";
import NewCollectionDrawer from "./new-collection-drawer";

export interface CollectionDrawerProps {
  trigger: React.ReactNode;
  className?: string;
  collections?: Collection[];
}

const dummyCollections: Collection[] = [
  {
    id: "1",
    name: "Collection 1",
    count: 10,
    images: [mockAds[0].images[0]],
  },
  {
    id: "2",
    name: "Collection 1",
    count: 10,
    images: [mockAds[1].images[1]],
  },
  {
    id: "3",
    name: "Collection 1",
    count: 10,
    images: [mockAds[2].images[0]],
  },
  {
    id: "4",
    name: "Collection 1",
    count: 10,
    images: [mockAds[3].images[0]],
  },
];

const CollectionDrawer: React.FC<CollectionDrawerProps> = ({
  collections = dummyCollections,
  trigger,
  className,
}) => {
  return (
    <DrawerWrapper
      title="Favorites"
      trigger={trigger}
      direction="bottom"
      className={className}
    >
      <div className="space-y-4 p-4">
        {/* Create New Collection - First Item */}
        <NewCollectionDrawer
          trigger={
            <div className="flex items-center gap-3 cursor-pointer transition-colors group">
              <div className="size-10 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <Typography
                variant="body-small"
                className="font-medium text-dark-blue group-hover:text-purple"
              >
                Create new list
              </Typography>
            </div>
          }
        ></NewCollectionDrawer>

        {/* Collections List */}
        <div className="space-y-0">
          {collections.length > 0 ? (
            collections.map((collection) => (
              <div
                key={collection.id}
                className={`flex group items-center justify-between py-1  cursor-pointer transition-colors`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-sm overflow-hidden flex-shrink-0">
                    <img
                      src={collection.images[0] || "/placeholder.jpg"}
                      alt={collection.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography
                      variant="sm-semibold"
                      className=" text-dark-blue group-hover:text-purple"
                    >
                      {collection.name}
                    </Typography>
                    <Typography
                      variant="xs-regular"
                      className="text-grey-blue group-hover:text-purple"
                    >
                      {collection.count} Favorites
                    </Typography>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center group-hover:bg-purple/10 transition-colors">
                    <Plus className="h-4 w-4 text-gray-600 group-hover:text-purple" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-gray-400" />
              </div>
              <Typography variant="body-small" className="text-grey-blue">
                No collections found
              </Typography>
              <Typography variant="body-small" className="text-gray-400">
                Create your first collection to get started
              </Typography>
            </div>
          )}
        </div>
      </div>
    </DrawerWrapper>
  );
};

export default CollectionDrawer;
