"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useContacts from "@/app/hooks/use-contacts";

const PAGE_SIZE = 10;

type Step2AudienceProps = {
  selectedContactIds: string[];
  error?: string;
  onChange: (ids: string[]) => void;
};

export const Step2Audience = ({ selectedContactIds, error, onChange }: Step2AudienceProps) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useContacts({
    page,
    limit: PAGE_SIZE,
  });

  const contacts = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const toggleContact = (id: string) => {
    if (selectedContactIds.includes(id)) {
      onChange(selectedContactIds.filter((c) => c !== id));
    } else {
      onChange([...selectedContactIds, id]);
    }
  };

  const toggleAll = () => {
    const visibleIds = contacts.map((c) => c.id);
    const allSelected = visibleIds.every((id) => selectedContactIds.includes(id));
    if (allSelected) {
      onChange(selectedContactIds.filter((id) => !visibleIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedContactIds, ...visibleIds]));
      onChange(merged);
    }
  };

  const clearSelection = () => onChange([]);

  const visibleIds = contacts.map((c) => c.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedContactIds.includes(id));
  const someVisibleSelected = visibleIds.some((id) => selectedContactIds.includes(id));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Audiência</h2>
        <p className="text-sm text-muted-foreground">
          Selecione os contatos que receberão essa campanha.
        </p>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 border-b">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input accent-primary cursor-pointer"
            checked={allVisibleSelected}
            ref={(el) => {
              if (el) el.indeterminate = !allVisibleSelected && someVisibleSelected;
            }}
            onChange={toggleAll}
            disabled={isLoading || contacts.length === 0}
          />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Selecionar visíveis
          </span>
        </div>

        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="h-4 w-4 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
            <Users className="h-8 w-8" />
            <p className="text-sm">Nenhum contato encontrado.</p>
          </div>
        ) : (
          <div
            className={`divide-y transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
          >
            {contacts.map((contact) => {
              const selected = selectedContactIds.includes(contact.id);
              return (
                <label
                  key={contact.id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input accent-primary cursor-pointer shrink-0"
                    checked={selected}
                    onChange={() => toggleContact(contact.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{contact.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{contact.phoneNumber}</p>
                  </div>
                  {contact.email && (
                    <span className="text-xs text-muted-foreground hidden sm:block truncate max-w-[160px]">
                      {contact.email}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isFetching}
          >
            Anterior
          </Button>
          <span className="text-xs text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isFetching}
          >
            Próximo
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {selectedContactIds.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedContactIds.length} contato
              {selectedContactIds.length !== 1 ? "s" : ""} selecionado
              {selectedContactIds.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {selectedContactIds.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearSelection}>
            Limpar seleção
          </Button>
        )}
      </div>
    </div>
  );
};
