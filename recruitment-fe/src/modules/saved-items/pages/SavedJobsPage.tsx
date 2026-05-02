import { useSavedItems as useActualSavedItems } from "../hooks/useSavedItems";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, DollarSign, Briefcase, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useToggleSave } from "../hooks/useSavedItems";
import { Link } from "react-router-dom";

const SavedJobsPage = () => {
  const { data: savedItems, isLoading } = useActualSavedItems("JOB");
  const toggleSave = useToggleSave();

  if (isLoading) {
    return <div className="p-8 text-center">Đang tải danh sách đã lưu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight border-l-4 border-red-500 pl-4">
          Việc làm đã lưu
        </h1>
        <Badge variant="outline" className="font-bold">
          {savedItems?.length || 0} tin tuyển dụng
        </Badge>
      </div>

      <div className="grid gap-4">
        {savedItems?.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center text-slate-500">
              <Briefcase className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>Bạn chưa lưu tin tuyển dụng nào.</p>
              <Link to="/jobs">
                <Button variant="link" className="text-primary font-bold">
                  Khám phá việc làm ngay
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          savedItems?.map((item: any) => {
            const job = item.details;
            if (!job) return null;

            return (
              <Card key={item.id} className="group hover:shadow-md transition-all border-slate-200 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-32 h-32 bg-slate-50 flex items-center justify-center p-4">
                      {job.company?.logoUrl ? (
                        <img src={job.company.logoUrl} alt={job.company.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <Briefcase className="h-10 w-10 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 p-5">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link to={`/jobs/${job.id}`} className="text-lg font-bold text-slate-900 hover:text-primary transition-colors line-clamp-1">
                            {job.title}
                          </Link>
                          <p className="text-sm font-medium text-slate-500 mt-1">{job.company?.name}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                          onClick={() => toggleSave.mutate({ targetId: job.id, targetType: "JOB" })}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-4 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-slate-400" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1 text-green-600 font-bold">
                          <DollarSign size={14} />
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-slate-400" />
                          Đã lưu: {format(new Date(item.createdAt), "dd/MM/yyyy", { locale: vi })}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;
