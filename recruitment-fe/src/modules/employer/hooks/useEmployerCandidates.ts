import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { applicationApi, useEmployerApplications } from "../../application/api/application.api";

export const useEmployerCandidates = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: apps, isLoading } = useEmployerApplications({ page, limit });
  const queryClient = useQueryClient();
  
  const [selectedApp, setSelectedApp] = useState<{ id: string; name: string } | null>(null);
  const [historyDialog, setHistoryDialog] = useState<{ title: string; histories: any[] } | null>(null);
  
  const [statusUpdate, setStatusUpdate] = useState<{ id: string; status: string; name: string } | null>(null);
  const [employerNote, setEmployerNote] = useState("");

  const groupedCandidates = useMemo(() => {
    if (!apps?.data) return [];

    const groups = apps.data.reduce((acc: any, app: any) => {
      const candidateId = app.candidate.id;
      if (!acc[candidateId]) {
        acc[candidateId] = {
          candidate: app.candidate,
          appliedJobs: [],
        };
      }

      acc[candidateId].appliedJobs.push({
        applicationId: app.id,
        jobTitle: app.job.title,
        status: app.status,
        resume: app.resume,
        candidateNote: app.candidateNote,
        employerActionBy: app.employerActionBy,
        employerActionDate: app.employerActionDate,
        histories: app.histories || [],
      });

      return acc;
    }, {});

    return Object.values(groups);
  }, [apps]);

  const handleUpdateStatus = async () => {
    if (!statusUpdate) return;
    
    const toastId = toast.loading("Đang cập nhật trạng thái...");
    try {
      await applicationApi.updateStatus(statusUpdate.id, { 
        status: statusUpdate.status, 
        employerNote 
      });
      toast.success("Cập nhật trạng thái thành công", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["employer-applications"] });
      setStatusUpdate(null);
      setEmployerNote("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Thao tác thất bại", { id: toastId });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-600 ring-yellow-500/20";
      case "REVIEWING":
        return "bg-purple-50 text-purple-600 ring-purple-500/20";
      case "INTERVIEW":
        return "bg-blue-50 text-blue-600 ring-blue-500/20";
      case "ACCEPTED":
        return "bg-green-50 text-green-600 ring-green-500/20";
      case "REJECTED":
        return "bg-red-50 text-red-500 ring-red-500/20";
      default:
        return "bg-slate-50 text-slate-500";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Mới nộp",
      REVIEWING: "Đang xem",
      INTERVIEW: "Phỏng vấn",
      ACCEPTED: "Đã nhận",
      REJECTED: "Từ chối",
      WITHDRAWN: "Đã rút",
    };
    return labels[status] || status;
  };

  return {
    page,
    setPage,
    apps,
    isLoading,
    groupedCandidates,
    selectedApp,
    setSelectedApp,
    historyDialog,
    setHistoryDialog,
    statusUpdate,
    setStatusUpdate,
    employerNote,
    setEmployerNote,
    handleUpdateStatus,
    getStatusColor,
    getStatusLabel,
  };
};
