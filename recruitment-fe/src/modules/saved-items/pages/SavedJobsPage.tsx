import { useState } from "react";
import { useSavedItems as useActualSavedItems } from "../hooks/useSavedItems";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, DollarSign, Trash2, ArrowRight, Building2, HeartOff, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useToggleSave } from "../hooks/useSavedItems";
import { Link } from "react-router-dom";
import { Pagination } from "@/components/shared/Pagination";
import { formatSalary } from "@/lib/utils";

const SavedJobsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: savedItemsData, isLoading } = useActualSavedItems("JOB", { page, limit });
  const savedItems = savedItemsData?.data || [];
  const toggleSave = useToggleSave();

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Việc làm đã lưu</h1>
          <p className="text-slate-500 font-medium italic mt-1">Danh sách các cơ hội nghề nghiệp bạn đang quan tâm.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Đang lưu trữ</p>
           <p className="text-xl font-black text-rose-500 text-center">{savedItemsData?.meta?.total || 0} Tin</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-20 gap-4">
           <Loader2 className="animate-spin text-primary" size={48} />
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tải danh sách...</p>
        </div>
      ) : savedItems?.length === 0 ? (
        <Card className="border-dashed border-2 py-32 text-center rounded-[3rem] bg-white shadow-inner">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartOff className="text-slate-200" size={40} />
          </div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-lg">Danh sách trống</p>
          <p className="text-slate-400 font-medium mt-2 italic">Hãy nhấn vào biểu tượng trái tim tại các tin tuyển dụng để lưu lại.</p>
          <Link to="/jobs">
            <Button className="mt-8 rounded-full bg-primary hover:bg-primary/90 font-black px-8 uppercase tracking-widest text-xs h-12 shadow-lg shadow-primary/20">Khám phá ngay</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {savedItems?.map((item: any) => {
            const job = item.details;
            if (!job) return null;

            return (
              <Card key={item.id} className="rounded-3xl border-transparent shadow-sm hover:shadow-xl hover:shadow-rose-500/5 transition-all bg-white overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-stretch">
                    <div className="w-full md:w-40 bg-slate-50 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100">
                      <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        {job.company?.logoUrl ? (
                          <img src={job.company.logoUrl} alt="logo" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <Building2 className="text-slate-200" size={32} />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <Link to={`/jobs/${job.id}`} className="text-xl font-black text-slate-900 hover:text-primary transition-colors line-clamp-1 block uppercase tracking-tight leading-none mb-2">
                            {job.title}
                          </Link>
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">{job.company?.name}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full h-10 w-10 shrink-0 transition-colors"
                          onClick={() => toggleSave.mutate({ targetId: job.id, targetType: "JOB" })}
                        >
                          <Trash2 size={20} />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6">
                        <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-tighter">
                          <DollarSign size={16} /> {formatSalary(job.salaryMin, job.salaryMax, job.isSalaryNegotiable)}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                          <MapPin size={14} className="text-blue-400" /> {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-medium text-[10px] uppercase tracking-widest">
                          <Calendar size={14} className="text-slate-300" /> Đã lưu: {format(new Date(item.createdAt), "dd/MM/yyyy", { locale: vi })}
                        </div>
                      </div>
                    </div>

                    <div className="md:w-32 bg-slate-50/30 flex items-center justify-center p-4 border-t md:border-t-0 md:border-l border-slate-100">
                       <Link to={`/jobs/${job.id}`}>
                          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-white shadow-sm text-slate-300 group-hover:text-primary group-hover:shadow-md transition-all">
                             <ArrowRight size={24} />
                          </Button>
                       </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {savedItemsData && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={savedItemsData.meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
