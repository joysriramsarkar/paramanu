
"use client";

import { useState } from "react";
import { elements, type ElementData } from "@/lib/data";
import AtomVisualizer from "@/components/atom/AtomVisualizer";
import ElementInfo from "@/components/atom/ElementInfo";
import ElementSelector from "@/components/atom/ElementSelector";
import Header from "@/components/layout/Header";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Minus, Plus } from "lucide-react";

function Legend() {
  return (
    <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm p-3 rounded-lg text-sm">
      <ul className="space-y-2">
        <li className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>প্রোটন (+)</span>
        </li>
        <li className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
          <span>নিউট্রন (0)</span>
        </li>
        <li className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <span>ইলেকট্রন (-)</span>
        </li>
      </ul>
    </div>
  );
}

export default function Home() {
  const [selectedElement, setSelectedElement] = useState<ElementData>(
    elements[5] // Default to Carbon
  );
  const [speed, setSpeed] = useState(50);
  const [zoom, setZoom] = useState(1);

  const handleSelectElement = (atomicNumber: number) => {
    const element = elements.find((el) => el.atomicNumber === atomicNumber);
    if (element) {
      setSelectedElement(element);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
          <ElementInfo element={selectedElement} />
        </div>
        <div className="flex-grow flex flex-col gap-4">
          <div className="bg-card rounded-lg p-4 flex flex-wrap items-center justify-center md:justify-between gap-4">
            <ElementSelector
              elements={elements}
              onSelect={handleSelectElement}
              defaultValue={selectedElement.atomicNumber}
            />
            <div className="flex items-center gap-4">
              <div className="w-40 space-y-1">
                <label className="text-sm text-muted-foreground">ইলেকট্রনের গতি</label>
                <Slider value={[speed]} onValueChange={(v) => setSpeed(v[0])} />
              </div>
              <div className="flex items-center gap-2">
                 <label className="text-sm text-muted-foreground">জুম</label>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.5, z-0.1))}>
                  <Minus className="w-4 h-4"/>
                </Button>
                 <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(2, z+0.1))}>
                  <Plus className="w-4 h-4"/>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-grow bg-card rounded-lg relative">
            <AtomVisualizer
              element={selectedElement}
              speed={speed}
              zoom={zoom}
              key={selectedElement.atomicNumber}
            />
            <Legend />
          </div>
        </div>
      </main>
    </div>
  );
}
