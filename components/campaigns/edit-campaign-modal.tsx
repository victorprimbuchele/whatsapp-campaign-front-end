"use client";

import { useState } from "react";

import { Campaign } from "@/app/types/campaign";
import { SendType } from "@/app/types/create-campaign-dto";
import useUpdateCampaign from "@/app/hooks/use-update-campaign";
import useTemplates from "@/app/hooks/use-templates";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// IDs de status fixos semeados no back-end
const STATUS_ID_SCHEDULED = "00000000-0000-0000-0000-000000000101";
const STATUS_ID_DRAFT = "00000000-0000-0000-0000-000000000102";

function toDatetimeLocal(isoString?: string | null): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function inferSendType(campaign: Campaign): SendType {
  const code = campaign.status?.code ?? "";
  if (code === "draft" || code === "rascunho") return "draft";
  if (code === "scheduled" || code === "agendada") return "scheduled";
  return "now";
}

function getInitialScheduledAt(campaign: Campaign, sendType: SendType): string {
  return sendType === "scheduled" ? toDatetimeLocal(campaign.scheduleAt) : "";
}

type EditCampaignModalProps = {
  campaign: Campaign | null;
  onClose: () => void;
};

export const EditCampaignModal = ({ campaign, onClose }: EditCampaignModalProps) => {
  return (
    <Dialog open={!!campaign} onOpenChange={(open) => !open && onClose()}>
      {campaign && <EditCampaignForm key={campaign.id} campaign={campaign} onClose={onClose} />}
    </Dialog>
  );
};

type EditCampaignFormProps = {
  campaign: Campaign;
  onClose: () => void;
};

function EditCampaignForm({ campaign, onClose }: EditCampaignFormProps) {
  const initialSendType = inferSendType(campaign);
  const { data: templates = [], isLoading: loadingTemplates } = useTemplates();
  const { mutateAsync: updateCampaign, isPending } = useUpdateCampaign();

  const [name, setName] = useState(campaign.name);
  const [templateId, setTemplateId] = useState(campaign.templateId ?? "");
  const [sendType, setSendType] = useState<SendType>(initialSendType);
  const [scheduledAt, setScheduledAt] = useState(() =>
    getInitialScheduledAt(campaign, initialSendType),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const minDateTime = (() => {
    const now = new Date();
    const d = new Date(now.getTime() + 60_000);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  })();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Nome da campanha é obrigatório.";
    else if (name.length > 100) newErrors.name = "O nome deve ter no máximo 100 caracteres.";
    if (!templateId) newErrors.templateId = "Selecione um template.";
    if (sendType === "scheduled") {
      if (!scheduledAt) newErrors.scheduledAt = "Informe a data e hora do agendamento.";
      else if (new Date(scheduledAt) <= new Date())
        newErrors.scheduledAt = "A data de agendamento deve ser no futuro.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setApiError("");
      await updateCampaign({
        id: campaign.id,
        dto: {
          name,
          templateId,
          statusId:
            sendType === "draft"
              ? STATUS_ID_DRAFT
              : sendType === "scheduled"
                ? STATUS_ID_SCHEDULED
                : undefined,
          scheduleAt: sendType === "scheduled" ? scheduledAt : null,
        },
      });
      onClose();
    } catch {
      setApiError("Ocorreu um erro ao salvar a campanha. Tente novamente.");
    }
  };

  return (
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Editar campanha</DialogTitle>
      </DialogHeader>

      <div className="space-y-5 py-2">
        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="edit-name">Nome</Label>
          <Input
            id="edit-name"
            placeholder="Ex: Promoção de Verão 2026"
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "border-destructive" : ""}
          />
          <div className="flex justify-between">
            {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : <span />}
            <p className="text-sm text-muted-foreground ml-auto">{name.length}/100</p>
          </div>
        </div>

        {/* Template */}
        <div className="space-y-2">
          <Label>Template</Label>
          {loadingTemplates ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-2 max-h-48 overflow-y-auto pr-1">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateId(t.id)}
                  className={cn(
                    "w-full rounded-md border p-3 text-left transition-colors",
                    templateId === t.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{t.body}</p>
                </button>
              ))}
            </div>
          )}
          {errors.templateId && <p className="text-sm text-destructive">{errors.templateId}</p>}
        </div>

        {/* Tipo de envio */}
        <div className="space-y-2">
          <Label>Tipo de envio</Label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { value: "now", label: "Enviar agora" },
                { value: "scheduled", label: "Agendar" },
                { value: "draft", label: "Rascunho" },
              ] as { value: SendType; label: string }[]
            ).map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSendType(value)}
                className={cn(
                  "rounded-md border p-2.5 text-center text-sm transition-colors",
                  sendType === value
                    ? "border-primary bg-primary/5 font-medium"
                    : "border-border hover:border-primary/50 text-muted-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Data de agendamento */}
        {sendType === "scheduled" && (
          <div className="space-y-2">
            <Label htmlFor="edit-scheduled-at">Data e hora do agendamento</Label>
            <Input
              id="edit-scheduled-at"
              type="datetime-local"
              min={minDateTime}
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className={errors.scheduledAt ? "border-destructive" : ""}
            />
            {errors.scheduledAt && <p className="text-sm text-destructive">{errors.scheduledAt}</p>}
          </div>
        )}

        {/* Erro da API */}
        {apiError && (
          <div className="rounded-md border border-destructive bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{apiError}</p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
