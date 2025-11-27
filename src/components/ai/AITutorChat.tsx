
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, X, MessageCircleQuestion } from "lucide-react";
import { ElementData } from "@/lib/data";
import { askAITutor } from "@/app/actions";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AITutorChatProps {
  element: ElementData;
}

export default function AITutorChat({ element }: AITutorChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `হ্যালো! আমি তোমার রসায়ন শিক্ষক। ${element.name_bn} (${element.name}) সম্পর্কে তোমার কোনো প্রশ্ন থাকলে করতে পারো।`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Update welcome message when element changes
  useEffect(() => {
    setMessages((prev) => {
      // Keep existing chat but add a system note or just acknowledge the switch?
      // For now, let's just add a new message indicating context switch
      return [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `এখন আমরা ${element.name_bn} (${element.name}) নিয়ে কথা বলছি।`,
        },
      ];
    });
  }, [element.atomicNumber]);

  useEffect(() => {
     if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const elementContext = `
        Name: ${element.name} (${element.name_bn})
        Symbol: ${element.symbol}
        Atomic Number: ${element.atomicNumber}
        Mass: ${element.mass}
        Protons: ${element.protons}
        Neutrons: ${element.neutrons}
        Electrons: ${element.electrons}
        Electron Configuration: ${element.electronConfiguration.join(", ")}
      `;

      const response = await askAITutor(userMessage.content, elementContext);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "দুঃখিত, কোনো একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
        aria-label="AI রসায়ন শিক্ষক"
      >
        <MessageCircleQuestion className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[350px] md:w-[400px] h-[500px] shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b space-y-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircleQuestion className="w-5 h-5 text-primary" />
          AI রসায়ন শিক্ষক
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {/* Simple markdown rendering could be added here later */}
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>লিখছি...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3 border-t">
        <form
          className="flex w-full items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            placeholder="প্রশ্ন করুন..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
