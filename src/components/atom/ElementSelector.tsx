import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ElementData } from "@/lib/data";
import { toBengaliNumber } from "@/lib/utils";

interface ElementSelectorProps {
  elements: ElementData[];
  onSelect: (atomicNumber: number) => void;
  defaultValue: number;
}

export default function ElementSelector({ elements, onSelect, defaultValue }: ElementSelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="element-select" className="block text-lg font-medium text-foreground">
        উপাদান নির্বাচন করুন
      </label>
      <Select onValueChange={(value) => onSelect(parseInt(value))} defaultValue={String(defaultValue)}>
        <SelectTrigger id="element-select" className="w-full text-lg h-12 bg-card">
          <SelectValue placeholder="একটি উপাদান নির্বাচন করুন..." />
        </SelectTrigger>
        <SelectContent>
          {elements.map((el) => (
            <SelectItem key={el.atomicNumber} value={String(el.atomicNumber)} className="text-lg cursor-pointer">
              {`${toBengaliNumber(el.atomicNumber)}. ${el.name_bn}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
