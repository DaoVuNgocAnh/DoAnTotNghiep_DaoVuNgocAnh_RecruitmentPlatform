import { Users, Building2, Briefcase, Award } from "lucide-react";

const stats = [
  { label: "Ứng viên", value: "2.5M+", icon: <Users size={24} />, color: "bg-blue-500" },
  { label: "Công ty", value: "120K+", icon: <Building2 size={24} />, color: "bg-emerald-500" },
  { label: "Việc làm", value: "500K+", icon: <Briefcase size={24} />, color: "bg-violet-500" },
  { label: "Giải thưởng", value: "25+", icon: <Award size={24} />, color: "bg-amber-500" },
];

export const StatsSection = () => {
  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-6 group">
              <div className={`w-14 h-14 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg shadow-current/10 transition-transform group-hover:scale-110 duration-300`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
