import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { savedItemsApi } from "../api/saved-items.api";
import { toast } from "sonner";
import type { TargetType } from "../api/saved-items.api";

export const useSavedItems = (type?: TargetType, enabled = true) => {
  return useQuery({
    queryKey: ["saved-items", type],
    queryFn: () => savedItemsApi.getAll(type),
    enabled,
  });
};

export const useCompanyTalentPool = () => {
  return useQuery({
    queryKey: ["saved-items", "company-candidates"],
    queryFn: () => savedItemsApi.getCompanyCandidates(),
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

export const useToggleCompanyCandidate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savedItemsApi.toggleCompanyCandidate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["saved-items", "company-candidates"] });
      if (data.saved) {
        toast.success("Đã đưa vào kho ứng viên công ty");
      } else {
        toast.info("Đã gỡ khỏi kho ứng viên công ty");
      }
    },
    onError: () => {
      toast.error("Không thể cập nhật kho ứng viên công ty");
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

export const useUpdateCompanyNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, note }: { itemId: string; note: string }) =>
      savedItemsApi.updateCompanyNote(itemId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-items", "company-candidates"] });
      toast.success("Đã cập nhật ghi chú kho công ty");
    },
    onError: () => {
      toast.error("Không thể cập nhật ghi chú kho công ty");
    },
  });
};
