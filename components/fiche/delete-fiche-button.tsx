"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteFiche } from "@/lib/actions/fiche";

export function DeleteFicheButton({
  ficheId,
  projet,
}: {
  ficheId: string;
  projet: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteFiche(ficheId);
        toast.success("Fiche supprimée.");
      } catch {
        toast.error("Impossible de supprimer la fiche. Réessayez.");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          />
        }
      >
        Supprimer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la fiche</DialogTitle>
          <DialogDescription>
            Voulez-vous vraiment supprimer la fiche « {projet} » ? Cette action
            est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Annuler
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
