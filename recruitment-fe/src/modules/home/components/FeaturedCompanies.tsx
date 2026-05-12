import { useCompanies, type Company } from "@/modules/company/api/company.api";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Building2, Star } from "lucide-react";

export const FeaturedCompanies = () => {
  const { data: companies, isLoading } = useCompanies({ status: 'VERIFIED' });

  if (isLoading) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Nhà tuyển dụng <span className="text-primary">Hàng đầu</span></h2>
            <p className="text-slate-500 font-medium italic">Hợp tác cùng những doanh nghiệp uy tín nhất</p>
          </div>
          <Link to="/companies" className="text-primary font-bold hover:underline">Xem tất cả công ty</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {companies?.data?.slice(0, 6).map((company: Company) => (
            <Link key={company.id} to={`/companies/${company.id}`} className="group">
              <Card className="border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all rounded-2xl overflow-hidden active:scale-[0.95]">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-xl border border-slate-50 flex items-center justify-center p-2 mb-4 bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="text-slate-200" size={32} />
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-primary transition-colors">{company.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase mt-2">
                    <Star size={10} className="text-amber-400 fill-current" /> Top Employer
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
