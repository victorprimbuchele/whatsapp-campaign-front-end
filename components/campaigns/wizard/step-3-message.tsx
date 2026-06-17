"use client";

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Template } from "@/app/types/template";
import { cn } from "@/lib/utils";

function renderPreview(body: string, variables: string[]): string {
  let preview = body;
  variables.forEach((variable) => {
    const exampleValues: Record<string, string> = {
      nome: "João",
      name: "João",
      produto: "Produto X",
      desconto: "10%",
      link: "https://exemplo.com",
    };
    const example = exampleValues[variable.toLowerCase()] ?? `[${variable} não informado]`;
    preview = preview.replace(new RegExp(`{{${variable}}}`, "g"), example);
  });
  return preview;
}

type Step3MessageProps = {
  templateId: string;
  templates: Template[];
  isLoading: boolean;
  isError: boolean;
  error?: string;
  onChange: (templateId: string) => void;
};

export const Step3Message = ({
  templateId,
  templates,
  isLoading,
  isError,
  error,
  onChange,
}: Step3MessageProps) => {
  const selected = templates.find((t) => t.id === templateId);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Mensagem</h2>
        <p className="text-sm text-muted-foreground">
          Selecione um template de mensagem para a campanha.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-destructive">
          Erro ao carregar templates. Tente recarregar a página.
        </p>
      ) : (
        <div className="space-y-2">
          <Label>Template</Label>
          <div className="grid gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => onChange(template.id)}
                className={cn(
                  "w-full rounded-md border p-3 text-left transition-colors",
                  templateId === template.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <p className="font-medium text-sm">{template.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{template.body}</p>
              </button>
            ))}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}

      {selected && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">
            {renderPreview(selected.body, selected.variables)}
          </div>
          {selected.variables.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Variáveis: {selected.variables.map((v) => `{{${v}}}`).join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
