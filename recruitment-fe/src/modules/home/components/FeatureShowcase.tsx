import { ShieldCheck, Zap, Target, Award } from "lucide-react";

export const FeatureShowcase = () => {
  const features = [
    {
      title: "Hệ sinh thái SmartCV",
      description: "Chúng tôi định nghĩa lại cách bạn trình bày bản thân. Không chỉ là một tệp PDF, SmartCV là một thực thể số hóa thông minh, tích hợp các chứng chỉ xác thực và kỹ năng được kiểm chứng.",
      icon: <Award className="w-8 h-8 text-primary" />,
      tag: "Signature Builder",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Thuật toán AI Matching v2.0",
      description: "Công nghệ lõi của chúng tôi phân tích hàng triệu điểm dữ liệu để kết nối ứng viên với công việc lý tưởng theo thời gian thực. Độ chính xác lên đến 95% dựa trên hành vi và năng lực.",
      icon: <Target className="w-8 h-8 text-emerald-500" />,
      tag: "Advanced Intelligence",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Quy trình Phỏng vấn Tự động",
      description: "Rút ngắn 70% thời gian tuyển dụng với hệ thống lên lịch và phỏng vấn trực tuyến tích hợp. Trải nghiệm ứng tuyển liền mạch, chuyên nghiệp và minh bạch.",
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      tag: "Efficiency First",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-40 bg-slate-50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[150px] -mr-48 -mt-48"></div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mb-32">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              System Signature
           </div>
           <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-[0.9]">
             Công nghệ dẫn lối <br />
             <span className="text-primary underline decoration-slate-200 underline-offset-8">Sự nghiệp</span>
           </h2>
           <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
             SmartCV không chỉ là một nền tảng, chúng tôi là đối tác công nghệ chiến lược giúp bạn bứt phá trong kỷ nguyên số.
           </p>
        </div>

        <div className="space-y-48">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-20 lg:gap-32`}
            >
              <div className="flex-1 space-y-10">
                 <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center shadow-inner border border-slate-100">
                       {feature.icon}
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">{feature.tag}</span>
                 </div>
                 
                 <h3 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                   {feature.title}
                 </h3>
                 
                 <p className="text-slate-500 text-xl md:text-2xl leading-relaxed font-medium">
                   {feature.description}
                 </p>
                 
                 <div className="flex items-center gap-8 pt-6">
                    {["Bảo mật", "Tin cậy", "Miễn phí"].map((label) => (
                       <div key={label} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                          {label}
                       </div>
                    ))}
                 </div>
              </div>
              
              <div className="flex-1 relative group">
                 <div className="absolute inset-0 bg-primary/10 rounded-[4rem] rotate-3 -z-10 scale-105 group-hover:rotate-0 transition-transform duration-700"></div>
                 <div className="rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white relative z-10">
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="w-full h-[500px] object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60 group-hover:opacity-20 transition-opacity"></div>
                 </div>
                 
                 {/* Floating Element */}
                 <div className={`absolute ${index % 2 === 1 ? '-left-12' : '-right-12'} bottom-12 w-32 h-32 bg-white rounded-3xl shadow-2xl z-20 flex items-center justify-center animate-bounce md:flex`}>
                    <ShieldCheck className="text-primary" size={48} />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
