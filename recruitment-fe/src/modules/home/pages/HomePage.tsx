// src/modules/home/pages/HomePage.tsx
import { Hero } from "../components/Hero";
import { JobCard } from "@/components/shared/JobCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export const HomePage = () => {
  // Fake data để test UI
  const jobs = Array(9).fill({
    title: "Senior Fullstack Developer (NodeJS/ReactJS)",
    companyName: "SmartCV Technology Group",
    salary: "20 - 45 triệu",
    location: "Hồ Chí Minh",
    companyLogo: "https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logo/f5869a7978d38090548d5386027c9c03.png"
  });

  return (
    <div className="flex flex-col">
      <Hero />
      
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Việc làm tốt nhất</h2>
            <p className="text-slate-500 text-sm">Những cơ hội nghề nghiệp hấp dẫn không thể bỏ lỡ</p>
          </div>
          <Tabs defaultValue="all" className="w-auto">
            <TabsList className="bg-slate-100 rounded-xl p-1">
              <TabsTrigger value="all" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:text-[#00b14f] data-[state=active]:shadow-sm">Tất cả</TabsTrigger>
              <TabsTrigger value="remote" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:text-[#00b14f] data-[state=active]:shadow-sm">Làm từ xa</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Separator className="mb-8 opacity-50" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};