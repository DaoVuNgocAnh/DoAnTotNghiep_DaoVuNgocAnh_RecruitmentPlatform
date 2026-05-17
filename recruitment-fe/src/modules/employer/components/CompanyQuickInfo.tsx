import { Building2, Globe, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanyQuickInfoProps {
  company: any;
}

export const CompanyQuickInfo = ({ company }: CompanyQuickInfoProps) => {
  return (
    <div className="space-y-6">
      <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/50 px-8 py-5 border-b border-slate-100">
          <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-800">Thông tin nhanh</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <Globe size={18} className="text-[#00b14f]" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Website</p>
                <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="text-sm font-black text-slate-700 hover:text-[#00b14f] truncate block">
                  {company.websiteUrl?.replace(/^https?:\/\//, '') || "N/A"}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <Building2 size={18} className="text-[#00b14f]" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Mã số thuế</p>
                <p className="text-sm font-black text-slate-700">{company.taxCode}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-[#00b14f]" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Trụ sở</p>
                <p className="text-sm font-black text-slate-700">{company.location || "N/A"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-[#001529] rounded-[2rem] p-8 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00b14f]/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-[#00b14f] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-900/20">
            <Users size={24} />
          </div>
          <h4 className="text-xl font-black uppercase mb-2">Tuyển dụng hiệu quả</h4>
          <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">Xây dựng thương hiệu nhà tuyển dụng mạnh mẽ để thu hút nhân tài hàng đầu.</p>
          <Button variant="outline" className="w-full rounded-xl border-slate-700 text-white hover:bg-slate-800 font-black uppercase text-[10px] tracking-widest h-11 transition-all">
            Xem trang công khai
          </Button>
        </div>
      </div>
    </div>
  );
};
