"use client";

import { Template } from "@/app/types/template";
import { SendType } from "@/app/types/create-campaign-dto";

type Step5SummaryProps = {
  name: string;
  selectedContactIds: string[];
  templateId: string;
  sendType: SendType;
  scheduledAt: string;
  templates: Template[];
  apiError?: string;
};

const sendTypeLabel: Record<SendType, string> = {
  now: "Enviar agora",
  scheduled: "Agendado",
  draft: "Rascunho",
};

export const Step5Summary = ({
  name,
  selectedContactIds,
  templateId,
  sendType,
  scheduledAt,
  templates,
  apiError,
}: Step5SummaryProps) => {
  const template = templates.find((t) => t.id === templateId);
  const contactCount = selectedContactIds.length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Resumo</h2>
        <p className="text-sm text-muted-foreground">
          Revise as informações antes de criar a campanha.
        </p>
      </div>

      <div className="rounded-md border divide-y">
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-sm text-muted-foreground">Nome</span>
          <span className="text-sm font-medium">{name}</span>
        </div>
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-sm text-muted-foreground">Contatos</span>
          <span className="text-sm font-medium">
            {contactCount} contato{contactCount !== 1 ? "s" : ""} selecionado
            {contactCount !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-sm text-muted-foreground">Template</span>
          <span className="text-sm font-medium">{template?.name ?? "—"}</span>
        </div>
        <div className="flex justify-between items-center px-4 py-3">
          <span className="text-sm text-muted-foreground">Tipo de envio</span>
          <span className="text-sm font-medium">{sendTypeLabel[sendType]}</span>
        </div>
        {sendType === "scheduled" && scheduledAt && (
          <div className="flex justify-between items-center px-4 py-3">
            <span className="text-sm text-muted-foreground">Data de envio</span>
            <span className="text-sm font-medium">
              {new Date(scheduledAt).toLocaleString("pt-BR")}
            </span>
          </div>
        )}
      </div>

      {apiError && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{apiError}</p>
        </div>
      )}
    </div>
  );
};
