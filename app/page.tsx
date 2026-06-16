import { CampaignTable } from "@/components/campaigns/campaign-table";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function CampanhasPage() {
  return (
    <>
      <PageHeader title="Campanhas" className="flex flex-row justify-between items-center">
        <Button variant="outline">Nova Campanha</Button>
      </PageHeader>
      <CampaignTable />
    </>
  );
}
