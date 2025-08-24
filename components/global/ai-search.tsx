import React from "react";
import { DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DropdownMenu } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { DropdownMenuContent } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import white_AI_logo from "@/public/icons/ai-bg-white.svg";

const AiSearch = () => {
  return (
    <div className="relative flex items-center bg-[#F2F4F7] border border-gray-300 rounded-lg h-10 flex-1">
      {/* All Categories Dropdown on the Left */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            icon={<ChevronDown className="-ml-3" />}
            iconPosition="right"
            className="px-2 text-xs text-gray-600 hover:text-purple transition-colors h-5 border-r border-[#929292] rounded-none hover:bg-transparent data-[state=open]:text-purple lg:flex hidden"
          >
            All Categories
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 z-[60]" align="start">
          <DropdownMenuItem>Electronics</DropdownMenuItem>
          <DropdownMenuItem>Vehicles</DropdownMenuItem>
          <DropdownMenuItem>Property</DropdownMenuItem>
          <DropdownMenuItem>Fashion</DropdownMenuItem>
          <DropdownMenuItem>Home & Garden</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search Input */}
      <Input
        leftIcon={<SearchIcon className="size-5 text-gray-400 -ml-2" />}
        rightIcon={<Image src={white_AI_logo} alt="AI Logo" />}
        type="text"
        inputSize="sm"
        placeholder="Search any product.."
        className="pl-8 flex-1 block w-full bg-transparent text-xs placeholder-gray-500 focus:outline-none focus:ring-0 border-0"
      />
    </div>
  );
};

export default AiSearch;
