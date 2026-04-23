import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Github, Mail, PhoneCall } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#001529] text-slate-400 pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Col 1: About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-tighter">
                Smart<span className="text-[#00b14f]">CV</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              SmartCV là nền tảng quản lý tuyển dụng thông minh, giúp kết nối hàng triệu ứng viên tài năng với các doanh nghiệp hàng đầu.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#00b14f] hover:text-white transition-all"><Facebook size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#00b14f] hover:text-white transition-all"><Linkedin size={16} /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#00b14f] hover:text-white transition-all"><Github size={16} /></a>
            </div>
          </div>

          {/* Col 2: For Candidates */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Cho Ứng Viên</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/jobs" className="hover:text-[#00b14f] transition-colors">Tìm kiếm việc làm</Link></li>
              <li><Link to="/register" className="hover:text-[#00b14f] transition-colors">Tạo CV chuyên nghiệp</Link></li>
              <li><Link to="#" className="hover:text-[#00b14f] transition-colors">Cẩm nang nghề nghiệp</Link></li>
            </ul>
          </div>

          {/* Col 3: For Employers */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Cho Nhà Tuyển Dụng</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/register?role=EMPLOYER" className="hover:text-[#00b14f] transition-colors">Đăng tin tuyển dụng</Link></li>
              <li><Link to="#" className="hover:text-[#00b14f] transition-colors">Tìm kiếm hồ sơ</Link></li>
              <li><Link to="#" className="hover:text-[#00b14f] transition-colors">Giải pháp quản trị HR</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Liên hệ</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <PhoneCall size={18} className="text-[#00b14f] shrink-0" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-[#00b14f] shrink-0" />
                <span>support@smartcv.vn</span>
              </li>
              <li className="text-xs text-slate-500 pt-2">
                Tòa nhà SmartCV, Số 1 Võ Văn Ngân, Thủ Đức, TP.HCM
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-medium">
            © 2026 SmartCV Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link to="#" className="hover:text-white">Điều khoản</Link>
            <Link to="#" className="hover:text-white">Bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};