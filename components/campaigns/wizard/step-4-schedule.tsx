"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SendType } from "@/app/types/create-campaign-dto";

type Step4ScheduleProps = {
  sendType: SendType;
  scheduledAt: string;
  scheduleError?: string;
  onChangeSendType: (type: SendType) => void;
  onChangeScheduledAt: (value: string) => void;
};

export const Step4Schedule = ({
  sendType,
  scheduledAt,
  scheduleError,
  onChangeSendType,
  onChangeScheduledAt,
}: Step4ScheduleProps) => {
  const minDateTime = (() => {
    const now = new Date();

    const d = new Date(now.getTime() + 60_000);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  })();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Tipo de envio</h2>
        <p className="text-sm text-muted-foreground">
          Escolha enviar imediatamente ou agendar para uma data futura.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChangeSendType("now")}
          className={cn(
            "rounded-md border p-4 text-left transition-colors",
            sendType === "now"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
          )}
        >
          <p className="font-medium text-sm">Enviar agora</p>
          <p className="text-xs text-muted-foreground mt-1">
            A campanha será enviada imediatamente após a criação.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onChangeSendType("scheduled")}
          className={cn(
            "rounded-md border p-4 text-left transition-colors",
            sendType === "scheduled"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50",
          )}
        >
          <p className="font-medium text-sm">Agendar</p>
          <p className="text-xs text-muted-foreground mt-1">Defina uma data e hora para o envio.</p>
        </button>
      </div>

      {sendType === "scheduled" && (
        <div className="space-y-2">
          <Label htmlFor="scheduled-at">Data e hora do agendamento</Label>
          <Input
            id="scheduled-at"
            type="datetime-local"
            min={minDateTime}
            value={scheduledAt}
            onChange={(e) => onChangeScheduledAt(e.target.value)}
            className={scheduleError ? "border-destructive" : ""}
          />
          {scheduleError && <p className="text-sm text-destructive">{scheduleError}</p>}
        </div>
      )}
    </div>
  );
};
