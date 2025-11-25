
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ElementData } from "@/lib/data";

interface ElementSelectorProps {
  elements: ElementData[];
  onSelect: (atomicNumber: number) => void;
  defaultValue: number;
}

export default function ElementSelector({ elements, onSelect, defaultValue }: ElementSelectorProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="element-select" className="block text-sm font-medium text-muted-foreground">
        মৌল নির্বাচন করুন
      </label>
      <Select onValueChange={(value) => onSelect(parseInt(value))} defaultValue={String(defaultValue)}>
        <SelectTrigger id="element-select" className="w-48 h-10 bg-input border-border">
          <SelectValue placeholder="একটি উপাদান নির্বাচন করুন..." />
        </SelectTrigger>
        <SelectContent>
          {elements.map((el) => (
            <SelectItem key={el.atomicNumber} value={String(el.atomicNumber)} className="text-md cursor-pointer">
              {`${el.name_bn} (${el.symbol})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
