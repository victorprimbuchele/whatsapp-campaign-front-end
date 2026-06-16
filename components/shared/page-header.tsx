import { cn } from "@/lib/utils";
import React from "react";

export const PageHeader: React.FC<{
  title: string;
  className?: string;
  children?: React.ReactNode;
}> = ({ title, className, children }) => {
  return (
    <header className={cn("flex flex-col gap-4", className)}>
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </header>
  );
};
