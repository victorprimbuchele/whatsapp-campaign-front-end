"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteCampaignModalProps = {
  open: boolean;
  campaignName: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteCampaignModal = ({
  open,
  campaignName,
  isPending,
  onConfirm,
  onCancel,
}: DeleteCampaignModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir campanha</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a campanha{" "}
            <span className="font-semibold">{campaignName}</span>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? "Excluindo..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
