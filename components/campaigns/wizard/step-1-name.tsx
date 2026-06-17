"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step1NameProps = {
  name: string;
  error?: string;
  onChange: (value: string) => void;
};

export const Step1Name = ({ name, error, onChange }: Step1NameProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Nome da campanha</h2>
        <p className="text-sm text-muted-foreground">
          Dê um nome identificador para esta campanha.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Nome</Label>
        <Input
          id="campaign-name"
          placeholder="Ex: Promoção de Verão 2026"
          value={name}
          maxLength={100}
          onChange={(e) => onChange(e.target.value)}
          className={error ? "border-destructive" : ""}
        />
        <div className="flex justify-between">
          {error ? <p className="text-sm text-destructive">{error}</p> : <span />}
          <p className="text-sm text-muted-foreground ml-auto">{name.length}/100</p>
        </div>
      </div>
    </div>
  );
};
