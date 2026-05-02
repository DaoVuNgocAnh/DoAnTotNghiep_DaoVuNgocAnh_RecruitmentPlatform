import React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToggleSave, useCheckSavedStatus } from "../hooks/useSavedItems";
import type { TargetType } from "../api/saved-items.api";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface SaveButtonProps {
  targetId: string;
  targetType: TargetType;
  className?: string;
}

export const SaveButton = ({ targetId, targetType, className }: SaveButtonProps) => {
  const { isAuthenticated } = useAuthStore();
  const { data: status, isLoading } = useCheckSavedStatus(targetId, isAuthenticated);
  const toggleSave = useToggleSave();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để lưu tin");
      return;
    }

    toggleSave.mutate({ targetId, targetType });
  };

  const isSaved = status?.isSaved;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full transition-all duration-300",
        isSaved ? "text-red-500 hover:text-red-600 bg-red-50" : "text-slate-400 hover:text-red-500 hover:bg-slate-50",
        className
      )}
      onClick={handleToggle}
      disabled={isLoading || toggleSave.isPending}
    >
      <Heart 
        size={20} 
        className={cn(
          "transition-transform", 
          isSaved ? "fill-current scale-110" : "scale-100",
          toggleSave.isPending && "animate-pulse"
        )} 
      />
    </Button>
  );
};
