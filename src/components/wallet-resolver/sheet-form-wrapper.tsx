
"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SheetFormWrapperProps {
    trigger: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}

export function SheetFormWrapper({ trigger, title, description, children }: SheetFormWrapperProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader className="text-left px-4 pt-4">
                    <SheetTitle className="text-2xl">{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    )
}
