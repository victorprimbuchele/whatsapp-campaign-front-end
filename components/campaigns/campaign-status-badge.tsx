import { cn } from "@/lib/utils";

type StatusConfig = {
  label: string;
  className: string;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  scheduled: {
    label: "Agendada",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  agendada: {
    label: "Agendada",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  draft: {
    label: "Rascunho",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  rascunho: {
    label: "Rascunho",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  completed: {
    label: "Concluída",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  concluida: {
    label: "Concluída",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  finished: {
    label: "Concluída",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  running: {
    label: "Enviando",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  enviando: {
    label: "Enviando",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  cancelled: {
    label: "Cancelada",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  cancelada: {
    label: "Cancelada",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  paused: {
    label: "Pausada",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  pausada: {
    label: "Pausada",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
};

type CampaignStatusBadgeProps = {
  code: string;
  label?: string;
};

export const CampaignStatusBadge = ({ code, label }: CampaignStatusBadgeProps) => {
  const config = STATUS_CONFIG[code];
  const displayLabel = label ?? config?.label ?? code;
  const colorClasses = config?.className ?? "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        colorClasses,
      )}
    >
      {displayLabel}
    </span>
  );
};
