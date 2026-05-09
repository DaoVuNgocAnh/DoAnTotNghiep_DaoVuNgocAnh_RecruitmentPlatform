import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Github, PhoneCall, MapPin, Send } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-20 pb-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Col 1: About */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl font-black text-white tracking-tighter">
                Smart<span className="text-primary">CV</span>
              </span>
            </Link>
            <p className="text-sm leading-loose font-medium">
              Nền tảng kết nối nhân tài hàng đầu Việt Nam. Chúng tôi cung cấp các giải pháp tuyển dụng hiện đại, minh bạch và hiệu quả cho cả ứng viên và doanh nghiệp.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Linkedin, Github].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-primary/20"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Candidates */}
          <div>
            <h4 className="text-white font-black mb-8 uppercase text-[11px] tracking-[0.2em]">Dành cho Ứng Viên</h4>
            <ul className="space-y-4 text-[13px] font-bold">
              <li><Link to="/jobs" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span> Tìm kiếm việc làm</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span> Tạo hồ sơ chuyên nghiệp</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span> Cẩm nang nghề nghiệp</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span> Mẫu CV hiện đại</Link></li>
            </ul>
          </div>

          {/* Col 3: Employers */}
          <div>
            <h4 className="text-white font-black mb-8 uppercase text-[11px] tracking-[0.2em]">Dành cho Nhà tuyển dụng</h4>
            <ul className="space-y-4 text-[13px] font-bold">
              <li><Link to="/register?role=EMPLOYER" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span> Đăng tin miễn phí</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span> Tìm kiếm ứng viên</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span> Giải pháp quản trị HR</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span> Báo cáo thị trường</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-6">
            <h4 className="text-white font-black uppercase text-[11px] tracking-[0.2em]">Bản tin nghề nghiệp</h4>
            <p className="text-[12px] font-medium italic">Đăng ký để nhận những cơ hội việc làm tốt nhất hàng tuần.</p>
            <div className="relative group">
              <input 
                placeholder="Email của bạn..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-primary/20 focus:bg-white/10 transition-all font-bold"
              />
              <button className="absolute right-2 top-1.5 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <Send size={16} />
              </button>
            </div>
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold">
                <PhoneCall size={14} className="text-primary" /> 1900 123 456
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <MapPin size={14} className="text-primary" /> Thủ Đức, TP. Hồ Chí Minh
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-600">
            © 2026 SmartCV Platform. Kiến tạo tương lai nghề nghiệp.
          </p>
          <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-600">
            <Link to="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link>
            <Link to="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
