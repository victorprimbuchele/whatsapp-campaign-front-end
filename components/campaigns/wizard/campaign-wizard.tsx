"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { useWizardStore } from "@/app/stores/use-wizard-store";
import useCreateCampaign from "@/app/hooks/use-create-campaign";
import useTemplates from "@/app/hooks/use-templates";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Step1Name } from "./step-1-name";
import { Step2Audience } from "./step-2-audience";
import { Step3Message } from "./step-3-message";
import { Step4Schedule } from "./step-4-schedule";
import { Step5Summary } from "./step-5-summary";

// Status IDs fixos semeados no banco pelo back-end
const STATUS_ID_SCHEDULED = "00000000-0000-0000-0000-000000000101";
const STATUS_ID_DRAFT = "00000000-0000-0000-0000-000000000102";

const STEPS = ["Nome", "Audiência", "Mensagem", "Envio", "Finalizar"];

interface CampaignWizardProps {
  onClose?: () => void;
}

export const CampaignWizard = ({ onClose }: CampaignWizardProps) => {
  const router = useRouter();
  const {
    currentStep,
    name,
    selectedContactIds,
    templateId,
    sendType,
    scheduledAt,
    nextStep,
    prevStep,
    setField,
    reset,
  } = useWizardStore();

  const {
    data: templates = [],
    isLoading: loadingTemplates,
    error: templateError,
  } = useTemplates();
  const { mutateAsync: createCampaign, isPending } = useCreateCampaign();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!name.trim()) newErrors.name = "Nome da campanha é obrigatório.";
      else if (name.length > 100) newErrors.name = "O nome deve ter no máximo 100 caracteres.";
    }

    if (currentStep === 2) {
      if (selectedContactIds.length === 0) newErrors.contacts = "Selecione ao menos um contato.";
    }

    if (currentStep === 3) {
      if (!templateId) newErrors.templateId = "Selecione um template para continuar.";
    }

    if (currentStep === 4) {
      if (sendType === "scheduled") {
        if (!scheduledAt) {
          newErrors.scheduledAt = "Informe a data e hora do agendamento.";
        } else if (new Date(scheduledAt) <= new Date()) {
          newErrors.scheduledAt = "A data de agendamento deve ser no futuro.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) nextStep();
  };

  function toISOLocalString(date: Date): string {
    const pad = (n: number): string => n.toString().padStart(2, "0");

    return (
      `${date.getFullYear()}-` +
      `${pad(date.getMonth() + 1)}-` +
      `${pad(date.getDate())}T` +
      `${pad(date.getHours())}:` +
      `${pad(date.getMinutes())}:` +
      `${pad(date.getSeconds())}`
    );
  }

  const buildPayload = (overrideSendType?: "draft") => {
    const effectiveSendType = overrideSendType ?? sendType;
    return {
      name,
      contactIds: selectedContactIds,
      templateId: templateId || "00000000-0000-0000-0000-000000000000",
      statusId:
        effectiveSendType === "draft"
          ? STATUS_ID_DRAFT
          : effectiveSendType === "scheduled" || effectiveSendType === "now"
            ? STATUS_ID_SCHEDULED
            : undefined,
      scheduleAt:
        effectiveSendType === "scheduled"
          ? scheduledAt
          : effectiveSendType === "now"
            ? toISOLocalString(new Date())
            : undefined,
      idempotencyKey: crypto.randomUUID(),
    };
  };

  const handleClose = () => {
    reset();
    if (onClose) {
      onClose();
    } else {
      router.push("/campanhas");
    }
  };

  const handleSaveDraft = async () => {
    if (!name.trim()) {
      setErrors({ name: "Informe o nome da campanha antes de salvar." });
      return;
    }
    try {
      await createCampaign(buildPayload("draft"));
      handleClose();
    } catch {
      setApiError("Ocorreu um erro ao salvar o rascunho. Tente novamente.");
    }
  };

  const handleCreate = async () => {
    try {
      setApiError("");
      await createCampaign(buildPayload());
      handleClose();
    } catch {
      setApiError("Ocorreu um erro ao criar a campanha. Tente novamente.");
    }
  };

  return (
    <div className="mx-auto w-full space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nova Campanha</h1>
        <Button variant="ghost" size="sm" onClick={handleSaveDraft} disabled={isPending}>
          Salvar como rascunho
        </Button>
      </div>

      {/* Indicador de progresso */}
      <div className="flex items-center gap-1">
        {STEPS.map((label, idx) => {
          const step = idx + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          return (
            <div key={step} className="flex items-center gap-1 flex-1">
              <div className="flex flex-col items-center gap-1 flex-1">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step}
                </div>
                <span
                  className={cn(
                    "text-xs text-center hidden sm:block",
                    isActive ? "font-medium text-primary" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={cn("h-0.5 flex-1 mb-4", isCompleted ? "bg-primary" : "bg-muted")} />
              )}
            </div>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground text-right">
        Passo {currentStep} de {STEPS.length}
      </p>

      {/* Conteúdo do passo */}
      <div className="rounded-md border p-6 min-h-[240px]">
        {currentStep === 1 && (
          <Step1Name name={name} error={errors.name} onChange={(v) => setField("name", v)} />
        )}
        {currentStep === 2 && (
          <Step2Audience
            selectedContactIds={selectedContactIds}
            error={errors.contacts}
            onChange={(v) => setField("selectedContactIds", v)}
          />
        )}
        {currentStep === 3 && (
          <Step3Message
            templateId={templateId}
            templates={templates}
            isLoading={loadingTemplates}
            isError={!!templateError}
            error={errors.templateId}
            onChange={(v) => setField("templateId", v)}
          />
        )}
        {currentStep === 4 && (
          <Step4Schedule
            sendType={sendType}
            scheduledAt={scheduledAt}
            scheduleError={errors.scheduledAt}
            onChangeSendType={(v) => setField("sendType", v)}
            onChangeScheduledAt={(v) => setField("scheduledAt", v)}
          />
        )}
        {currentStep === 5 && (
          <Step5Summary
            name={name}
            selectedContactIds={selectedContactIds}
            templateId={templateId}
            sendType={sendType}
            scheduledAt={scheduledAt}
            templates={templates}
            apiError={apiError}
          />
        )}
      </div>

      {/* Ações de navegação */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1 || isPending}>
          Voltar
        </Button>

        {currentStep < 5 ? (
          <Button onClick={handleNext} disabled={isPending}>
            Próximo
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={isPending}>
            {isPending ? "Criando..." : "Criar campanha"}
          </Button>
        )}
      </div>
    </div>
  );
};
