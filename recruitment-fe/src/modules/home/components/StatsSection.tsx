// src/modules/home/components/StatsSection.tsx
import { Users, Building, Briefcase, Award } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    { label: "Việc làm", value: "120,000+", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Công ty", value: "45,000+", icon: Building, color: "text-[#00b14f]", bg: "bg-green-50" },
    { label: "Ứng viên", value: "2,500,000+", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Chứng chỉ", value: "15,000+", icon: Award, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="container mx-auto px-4 -mt-16 relative z-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center border border-slate-50 transition-transform hover:translate-y-[-8px] duration-300">
            <div className={`${stat.bg} p-4 rounded-2xl mb-4`}>
              <stat.icon size={32} className={stat.color} />
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">{stat.value}</div>
            <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};