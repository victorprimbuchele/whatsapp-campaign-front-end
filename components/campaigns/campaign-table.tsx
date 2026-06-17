"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertCircle,
  EllipsisVertical,
  Eye,
  Trash2,
} from "lucide-react";

import useCampaigns from "@/app/hooks/use-campaigns";
import useDeleteCampaign from "@/app/hooks/use-delete-campaign";
import { Campaign } from "@/app/types/campaign";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { CampaignStatusBadge } from "./campaign-status-badge";
import { DeleteCampaignModal } from "./delete-campaign-modal";
import { CampaignWizard } from "./wizard/campaign-wizard";

const PAGE_LIMIT = 20;

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-md" />
      ))}
    </div>
  );
}

function EmptyState({ hasSearch, onNew }: { hasSearch: boolean; onNew: () => void }) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <AlertCircle className="mb-2 h-8 w-8" />
        <p className="text-sm">Nenhum resultado encontrado.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
      <p className="text-sm">Nenhuma campanha encontrada.</p>
      <Button onClick={onNew}>
        <Plus className="mr-2 h-4 w-4" />
        Nova Campanha
      </Button>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-sm">Ocorreu um erro ao carregar as campanhas.</p>
      <Button variant="outline" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  );
}

function formatPercent(value?: number): string {
  if (value === undefined || value === null) return "—";
  return `${Math.round(value)}%`;
}

export const CampaignTable = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<Campaign | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading, error, refetch } = useCampaigns({
    page,
    limit: PAGE_LIMIT,
    search,
  });

  const { mutate: deleteCampaign, isPending: isDeleting } = useDeleteCampaign();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const handleDelete = () => {
    if (!toDelete) return;
    deleteCampaign(toDelete.id, {
      onSuccess: () => setToDelete(null),
    });
  };

  const campaigns = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const formattedDate = (dateString?: string | null) => {
    if (!dateString) return "—";

    const date = new Date(dateString);
    const dayDate = String(date.getUTCDate()).padStart(2, "0");
    const monthDate = String(date.getUTCMonth() + 1).padStart(2, "0");
    const yearDate = date.getUTCFullYear();
    const hourDate = String(date.getUTCHours()).padStart(2, "0");
    const minuteDate = String(date.getUTCMinutes()).padStart(2, "0");

    return `${dayDate}/${monthDate}/${yearDate} ${hourDate}:${minuteDate}`;
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Campanhas</h1>
        <Button onClick={() => setWizardOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

      {/* Campo de busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9 pr-9"
          placeholder="Buscar campanha..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {searchInput && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Conteúdo principal */}
      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : campaigns.length === 0 ? (
        <EmptyState hasSearch={!!search} onNew={() => setWizardOpen(true)} />
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Agendada</TableHead>
                  <TableHead className="text-right">Enviado</TableHead>
                  <TableHead className="text-right">Entregue</TableHead>
                  <TableHead className="text-right">Lido</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <CampaignStatusBadge code={campaign.status.code} />
                    </TableCell>
                    <TableCell>{formattedDate(campaign.scheduleAt)}</TableCell>
                    <TableCell className="text-right">
                      {formatPercent(campaign.percentSent)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercent(campaign.percentDelivered)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercent(campaign.percentRead)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <EllipsisVertical className="h-4 w-4" />
                            <span className="sr-only">Ações</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/campanhas/${campaign.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-8" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setToDelete(campaign)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page >= totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de exclusão */}
      <DeleteCampaignModal
        open={!!toDelete}
        campaignName={toDelete?.name ?? ""}
        isPending={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />

      {/* Modal de criação de campanha */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Nova Campanha</DialogTitle>
          </DialogHeader>
          <CampaignWizard onClose={() => setWizardOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
