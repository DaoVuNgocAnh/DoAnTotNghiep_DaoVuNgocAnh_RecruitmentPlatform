import { UserSearch } from "lucide-react";
import { useUser } from "@/modules/user/hooks/useUser";
import { ScheduleInterviewModal } from "../../interview/components/ScheduleInterviewModal";
import { Pagination } from "@/components/shared/Pagination";
import { useEmployerCandidates } from "../hooks/useEmployerCandidates";
import { CandidateTable } from "../components/CandidateTable";
import { UpdateStatusDialog } from "../components/UpdateStatusDialog";
import { HistoryDialog } from "../components/HistoryDialog";

export const EmployerCandidatesPage = () => {
  const { data: user } = useUser();
  const {
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
  } = useEmployerCandidates();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#001529] uppercase tracking-tight border-l-4 border-[#00b14f] pl-4">
            Danh sách ứng tuyển
          </h1>
          <p className="text-slate-500 text-sm font-medium ml-4 italic">
            {user?.isOwner
              ? "Owner đang xem toàn bộ hồ sơ ứng tuyển của công ty."
              : "Bạn đang xem hồ sơ thuộc các job được phân công."}
          </p>
        </div>
        <div className="bg-white px-6 py-2 rounded-2xl border shadow-sm flex items-center gap-3">
          <UserSearch className="text-[#00b14f]" size={20} />
          <span className="text-sm font-black text-slate-700 uppercase tracking-widest">
            {apps?.meta?.total || 0} ứng viên
          </span>
        </div>
      </div>

      <CandidateTable
        isLoading={isLoading}
        groupedCandidates={groupedCandidates}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
        setStatusUpdate={setStatusUpdate}
        setSelectedApp={setSelectedApp}
        setHistoryDialog={setHistoryDialog}
      />

      {apps && (
        <div className="p-4 border-t border-slate-50">
          <Pagination
            currentPage={page}
            totalPages={apps.meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {selectedApp && (
        <ScheduleInterviewModal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          applicationId={selectedApp.id}
          candidateName={selectedApp.name}
        />
      )}

      <UpdateStatusDialog
        statusUpdate={statusUpdate}
        setStatusUpdate={setStatusUpdate}
        employerNote={employerNote}
        setEmployerNote={setEmployerNote}
        handleUpdateStatus={handleUpdateStatus}
      />

      <HistoryDialog
        historyDialog={historyDialog}
        setHistoryDialog={setHistoryDialog}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
      />
    </div>
  );
};
