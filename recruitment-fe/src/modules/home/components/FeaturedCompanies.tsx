// src/modules/home/components/FeaturedCompanies.tsx
import { Building2 } from "lucide-react";

export const FeaturedCompanies = () => {
  const companies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "FPT Software", logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/FPT_Software_logo.png" },
    { name: "Viettel", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Logo_Viettel.svg" },
    { name: "VNG", logo: "https://upload.wikimedia.org/wikipedia/commons/2/23/VNG_Logo.svg" },
    { name: "Momo", logo: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" },
    { name: "Shopee", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg" },
  ];

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tight mb-4 border-l-8 border-[#00b14f] pl-6">
              Đối tác <span className="text-[#00b14f]">Chiến lược</span>
            </h2>
            <p className="text-slate-500 font-medium">Hợp tác cùng những tập đoàn hàng đầu để mang lại cơ hội tốt nhất cho bạn.</p>
          </div>
          <button className="text-[#00b14f] font-black uppercase tracking-widest text-sm hover:underline flex items-center gap-2">
            Xem tất cả công ty <Building2 size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {companies.map((company, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all flex items-center justify-center grayscale hover:grayscale-0 group border border-slate-100 h-28">
              <img 
                src={company.logo} 
                alt={company.name} 
                className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};