import { Atom } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-border shadow-md sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="container mx-auto p-4 flex items-center gap-4">
        <Atom className="w-8 h-8 text-accent" />
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-accent">
          পরমাণু জগৎ
        </h1>
      </div>
    </header>
  );
}
