// src/modules/home/components/Hero.tsx
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Hero = () => {
  return (
    <div className="bg-[#001529] pb-20 pt-10 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-6">
          Tìm việc làm nhanh 24h, việc làm mới nhất toàn quốc.
        </h1>
        <p className="text-slate-400 mb-10">
          Tiếp cận <span className="text-[#00b14f] font-bold">40,000+</span> tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam
        </p>

        {/* Thanh tìm kiếm sử dụng UI Component của bạn */}
        <div className="max-w-5xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <Input 
              placeholder="Tên công việc, vị trí bạn muốn ứng tuyển..." 
              className="pl-10 h-12 border-none focus-visible:ring-0 text-slate-700" 
            />
          </div>
          
          <div className="w-full md:w-48 border-l border-slate-100 flex items-center px-2">
            <MapPin className="text-slate-400 mr-2" size={20} />
            <Select>
              <SelectTrigger className="border-none focus:ring-0 shadow-none h-12">
                <SelectValue placeholder="Địa điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                <SelectItem value="hn">Hà Nội</SelectItem>
                <SelectItem value="dn">Đà Nẵng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="h-12 px-10 bg-[#00b14f] hover:bg-[#009643] text-white font-bold rounded-xl">
            TÌM KIẾM
          </Button>
        </div>
      </div>
    </div>
  );
};