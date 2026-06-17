"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Users, Send, CheckCheck, BookOpen, Clock } from "lucide-react";

import useGetCampaign from "@/app/hooks/use-get-campaign";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CampaignStatusBadge } from "@/components/campaigns/campaign-status-badge";

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

type MetricCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function MetricCard({ icon, label, value }: MetricCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
      <div className="rounded-lg bg-muted p-2.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: campaign, isLoading, error } = useGetCampaign(id);

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      {/* Navegação */}
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      {isLoading ? (
        <DetailSkeleton />
      ) : error || !campaign ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
          <p className="text-sm">Campanha não encontrada ou erro ao carregar.</p>
          <Button variant="outline" onClick={() => router.push("/campanhas")}>
            Ir para Campanhas
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cabeçalho */}
          <div className="flex flex-wrap items-start gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">{campaign.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Criada em {new Date(campaign.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>
            <CampaignStatusBadge code={campaign.status.code} />
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              icon={<Users className="h-5 w-5" />}
              label="Contatos"
              value={String(campaign.phoneNumbers?.length ?? 0)}
            />
            <MetricCard
              icon={<Calendar className="h-5 w-5" />}
              label="Data Agendada"
              value={
                campaign.scheduleAt ? new Date(campaign.scheduleAt).toLocaleString("pt-BR") : "—"
              }
            />
            <MetricCard
              icon={<Clock className="h-5 w-5" />}
              label="Última atualização"
              value={
                campaign.updatedAt ? new Date(campaign.updatedAt).toLocaleString("pt-BR") : "—"
              }
            />
            <MetricCard
              icon={<Send className="h-5 w-5" />}
              label="Enviado"
              value={`${Math.round(campaign.percentSent ?? 0)}%`}
            />
            <MetricCard
              icon={<CheckCheck className="h-5 w-5" />}
              label="Entregue"
              value={`${Math.round(campaign.percentDelivered ?? 0)}%`}
            />
            <MetricCard
              icon={<BookOpen className="h-5 w-5" />}
              label="Lido"
              value={`${Math.round(campaign.percentRead ?? 0)}%`}
            />
          </div>

          {/* Variáveis do template */}
          {campaign.variables && Object.keys(campaign.variables).length > 0 && (
            <div className="rounded-xl border bg-card p-5 space-y-3">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Variáveis da mensagem
              </h2>
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {Object.entries(campaign.variables).map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-sm">
                    <dt className="font-medium text-muted-foreground">{`{{${key}}}`}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Lista de contatos */}
          {campaign.phoneNumbers && campaign.phoneNumbers.length > 0 && (
            <div className="rounded-xl border bg-card p-5 space-y-3">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Contatos ({campaign.phoneNumbers.length})
              </h2>
              <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3 text-sm font-mono">
                {campaign.phoneNumbers.map((phone) => (
                  <li key={phone} className="text-muted-foreground">
                    {phone}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
