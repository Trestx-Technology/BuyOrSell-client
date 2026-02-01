import { MoreVertical, ChevronLeft, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { AvatarImage, Chat } from "./ChatSidebar";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface ChatHeaderProps {
  currentChat: Chat | undefined;
  onSearch?: () => void;
  onCall?: () => void;
  onMoreOptions?: () => void;
  onBackToSidebar?: () => void;
  showBackButton?: boolean;
  onDeleteChat?: () => void;
}

export function ChatHeader({
  currentChat,
  onMoreOptions,
  onBackToSidebar,
  showBackButton = false,
  onDeleteChat,
}: ChatHeaderProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Back to sidebar button */}
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={onBackToSidebar}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}

            <div className="w-10 h-10 flex items-center justify-center border border-purple rounded-full overflow-hidden">
              {currentChat?.avatar ? <Image
                src={currentChat?.avatar || ""}
                alt={currentChat?.name || ""}
                width={10}
                height={10}
                className="w-10 h-10 object-contain rounded-full"
              /> : <User className="w-6 h-6 object-contain rounded-full text-gray-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Typography
                  variant="body-small"
                  className="font-semibold text-gray-900"
                >
                  {currentChat?.name || "Unknown"}
                </Typography>
                {currentChat?.isVerified && (
                  <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center p-[2px]">
                    <Image
                      src={ICONS.auth.verified}
                      alt="Verified"
                      width={10}
                      height={10}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {currentChat?.isOnline && (
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full border border-white shadow-sm" />
                )}
              </div>
              <Typography
                variant="caption"
                className={cn(
                  "text-gray-500 transition-colors duration-300",
                  currentChat?.isOnline && "text-green-600 font-medium"
                )}
              >
                {currentChat?.isOnline ? "Online" : "Last seen recently"}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Delete Chat Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onDeleteChat?.();
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
