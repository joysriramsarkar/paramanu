
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ElementData } from "@/lib/data";
import { toBengaliNumber } from "@/lib/utils";

interface ElementInfoProps {
  element: ElementData;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  );
}

export default function ElementInfo({ element }: ElementInfoProps) {
  return (
    <Card className="bg-card overflow-hidden h-full">
      <CardHeader className="p-6">
        <CardTitle className="text-3xl font-bold text-accent">{element.name_bn}</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">{element.symbol}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <dl className="text-md space-y-2">
          <InfoRow label="পারমাণবিক সংখ্যা" value={toBengaliNumber(element.atomicNumber)} />
          <InfoRow label="ভর সংখ্যা" value={toBengaliNumber(Math.round(element.mass))} />
          <InfoRow label="প্রোটন" value={toBengaliNumber(element.protons)} />
          <InfoRow label="নিউট্রন" value={toBengaliNumber(element.neutrons)} />
          <InfoRow label="ইলেকট্রন" value={toBengaliNumber(element.electrons)} />
          <InfoRow label="ইলেকট্রন বিন্যাস (কক্ষপথ)" value={element.electronConfiguration_bn.join(', ')} />
        </dl>
      </CardContent>
    </Card>
  );
}
