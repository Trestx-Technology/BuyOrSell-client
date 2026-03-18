import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useLocale } from "@/hooks/useLocale";

export type ChatType = "ad" | "dm" | "organisation" | "ticket";

interface ChatTypeSelectorProps {
  value: ChatType;
  onChange: (value: ChatType) => void;
}

export function ChatTypeSelector({ value, onChange }: ChatTypeSelectorProps) {
  const { clearUrlQueries } = useUrlParams()
  const { t } = useLocale()
  
  const removeChatId = () => {
    if (clearUrlQueries) {
      clearUrlQueries()
    }
  }
  return (
    <Tabs value={value} onValueChange={(value) => { removeChatId(); onChange(value as ChatType) }} className="w-full">
      <TabsList className="w-full grid grid-cols-3 h-10 gap-2 bg-gray-100 p-1 bg-purple">
        <TabsTrigger
          value="ad"
          className="flex-1 text-xs sm:text-sm"
        >
          {t.chat.chatTypes.ad}
        </TabsTrigger>
        <TabsTrigger
          value="dm"
          className="flex-1 text-xs sm:text-sm"
        >
          {t.chat.chatTypes.dm}
        </TabsTrigger>
        <TabsTrigger
          value="organisation"
          className="flex-1 text-xs sm:text-sm "
        >
          {t.chat.chatTypes.organisation}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

