"use client";

// import { useIsMobile } from "@/app/hooks/use-is-mobile";
import { Action, GenericTable, Header } from "../shared/table";
import useCampaigns from "@/app/hooks/use-campaigns";
import { LoadingSpinner } from "../shared/loading-spinner";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";

export const CampaignTable = () => {
  // const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useCampaigns({
    page,
    limit: 10,
    search: "",
  });

  const campaigns = useMemo(() => {
    return [...(data?.data ?? []), ...(data?.data ?? [])];
  }, [data]);

  const headers: Header[] = [
    { id: "name", label: "Nome" },
    {
      id: "status",
      label: "Status",
      render: (value) => value?.code ?? "-",
    },
    {
      id: "createdAt",
      label: "Criado em",
      render: (value) => (value ? new Date(value).toLocaleDateString("pt-BR") : "-"),
    },
    {
      id: "updatedAt",
      label: "Atualizado em",
      render: (value) => (value ? new Date(value).toLocaleDateString("pt-BR") : "-"),
    },
  ];

  const actions: Action[] = [
    {
      label: "Editar",
      onClick: () => {
        console.log("Editar");
      },
    },
    {
      label: "Excluir",
      onClick: () => {
        console.log("Excluir");
      },
    },
    {
      label: "Visualizar",
      onClick: () => {
        console.log("Visualizar");
      },
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  if (error) return <div>Erro ao carregar campanhas</div>;

  if (!data) return <div>Nenhuma campanha encontrada</div>;

  return (
    <>
      <GenericTable headers={headers} data={campaigns} actions={actions} />
      <Button
        onClick={() => {
          setPage(page + 1);
        }}
        disabled={page >= data.totalPages}
      >
        Carregar mais
      </Button>
    </>
  );
};
