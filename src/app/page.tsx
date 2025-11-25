"use client";

import { useState } from "react";
import { elements, type ElementData } from "@/lib/data";
import AtomVisualizer from "@/components/atom/AtomVisualizer";
import ElementInfo from "@/components/atom/ElementInfo";
import ElementSelector from "@/components/atom/ElementSelector";
import Header from "@/components/layout/Header";

export default function Home() {
  const [selectedElement, setSelectedElement] = useState<ElementData>(
    elements[0]
  );

  const handleSelectElement = (atomicNumber: number) => {
    const element = elements.find((el) => el.atomicNumber === atomicNumber);
    if (element) {
      setSelectedElement(element);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <ElementSelector
              elements={elements}
              onSelect={handleSelectElement}
              defaultValue={selectedElement.atomicNumber}
            />
            <ElementInfo element={selectedElement} />
          </div>
          <div className="lg:col-span-2">
            <AtomVisualizer
              element={selectedElement}
              key={selectedElement.atomicNumber}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
