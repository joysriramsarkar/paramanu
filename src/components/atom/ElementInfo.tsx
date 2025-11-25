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
    <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-b-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  );
}

export default function ElementInfo({ element }: ElementInfoProps) {
  return (
    <Card className="bg-card overflow-hidden">
      <CardHeader className="text-center p-6">
        <CardTitle className="text-5xl font-bold text-accent mx-auto relative w-28 h-28 flex items-center justify-center bg-background rounded-full border-4 border-primary shadow-inner">
          {element.symbol}
          <div className="absolute top-1 right-1 text-base font-mono bg-primary text-primary-foreground rounded-full h-7 w-7 flex items-center justify-center">
            {toBengaliNumber(element.atomicNumber)}
          </div>
           <div className="absolute bottom-1 -right-1 text-sm font-mono bg-secondary text-secondary-foreground rounded-full px-1">
            {toBengaliNumber(Math.round(element.mass))}
          </div>
        </CardTitle>
        <CardDescription className="text-3xl font-bold pt-4 text-foreground">{element.name_bn}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <dl className="text-lg space-y-1">
          <InfoRow label="পারমাণবিক সংখ্যা" value={toBengaliNumber(element.atomicNumber)} />
          <InfoRow label="ভর সংখ্যা" value={toBengaliNumber(Math.round(element.mass))} />
          <InfoRow label="প্রোটন" value={toBengaliNumber(element.protons)} />
          <InfoRow label="নিউট্রন" value={toBengaliNumber(element.neutrons)} />
          <InfoRow label="ইলেকট্রন" value={toBengaliNumber(element.electrons)} />
          <InfoRow label="ইলেকট্রন বিন্যাস" value={element.electronConfiguration_bn.join(', ')} />
        </dl>
      </CardContent>
    </Card>
  );
}
