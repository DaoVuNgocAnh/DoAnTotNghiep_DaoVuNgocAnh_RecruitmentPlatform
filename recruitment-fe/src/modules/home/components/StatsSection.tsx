import { Users, Building2, Briefcase, Award } from "lucide-react";

const stats = [
  { label: "Ứng viên", value: "2.5M+", icon: <Users size={24} />, color: "bg-blue-500" },
  { label: "Công ty", value: "120K+", icon: <Building2 size={24} />, color: "bg-emerald-500" },
  { label: "Việc làm", value: "500K+", icon: <Briefcase size={24} />, color: "bg-violet-500" },
  { label: "Giải thưởng", value: "25+", icon: <Award size={24} />, color: "bg-amber-500" },
];

export const StatsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="group relative p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex flex-col gap-6 relative z-10">
                <div className={`w-16 h-16 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg shadow-current/20 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{stat.value}</p>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
