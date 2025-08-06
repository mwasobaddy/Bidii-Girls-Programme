"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemType: string;
  itemName?: string;
}

export function DeleteConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemType,
  itemName
}: DeleteConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      toast({
        title: "Successfully Deleted",
        description: `The ${itemType} has been deleted.`,
      });
      onClose();
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${itemType}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete {itemType}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p>
            Are you sure you want to delete this {itemType}
            {itemName ? `: "${itemName}"` : ""}?
          </p>
          <p className="text-sm text-red-500">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
