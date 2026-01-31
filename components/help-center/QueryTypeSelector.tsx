import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QueryType } from "@/lib/firebase/tickets/types";

interface QueryTypeSelectorProps {
  value: QueryType | '';
  onChange: (value: QueryType) => void;
  placeholder?: string;
}

const queryTypes: { value: QueryType; label: string }[] = [
  { value: "technical", label: "Technical Issue" },
  { value: "billing", label: "Billing & Payments" },
  { value: "account", label: "Account Management" },
  { value: "feature_request", label: "Feature Request" },
  { value: "bug_report", label: "Report a Bug" },
  { value: "other", label: "Other" },
];

export function QueryTypeSelector({ value, onChange, placeholder = "Select query type" }: QueryTypeSelectorProps) {
  return (
    <Select value={value || undefined} onValueChange={(val) => onChange(val as QueryType)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {queryTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
