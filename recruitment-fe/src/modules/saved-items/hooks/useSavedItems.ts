import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { savedItemsApi } from "../api/saved-items.api";
import { toast } from "sonner";
import type { TargetType } from "../api/saved-items.api";

export const useSavedItems = (type?: TargetType) => {
  return useQuery({
    queryKey: ["saved-items", type],
    queryFn: () => savedItemsApi.getAll(type),
  });
};

export const useCheckSavedStatus = (targetId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["saved-items", "check", targetId],
    queryFn: () => savedItemsApi.checkStatus(targetId),
    enabled: !!targetId && enabled,
  });
};

export const useToggleSave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savedItemsApi.toggle,
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["saved-items"] });
      queryClient.invalidateQueries({ queryKey: ["saved-items", "check", variables.targetId] });
      
      if (data.saved) {
        toast.success("Đã lưu vào danh sách yêu thích");
      } else {
        toast.info("Đã xóa khỏi danh sách yêu thích");
      }
    },
    onError: () => {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, note }: { itemId: string; note: string }) => 
      savedItemsApi.updateNote(itemId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-items"] });
      toast.success("Đã cập nhật ghi chú");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi cập nhật ghi chú");
    },
  });
};
