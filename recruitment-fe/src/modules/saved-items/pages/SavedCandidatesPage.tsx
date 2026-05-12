import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Edit3, Mail, Phone, Save, Trash2, User, UsersRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  useCompanyTalentPool,
  useSavedItems,
  useToggleCompanyCandidate,
  useToggleSave,
  useUpdateCompanyNote,
  useUpdateNote,
} from "../hooks/useSavedItems";
import { Pagination } from "@/components/shared/Pagination";

type TabKey = "personal" | "company";

const SavedCandidatesPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: personalItemsData, isLoading: personalLoading } = useSavedItems("CANDIDATE", { page, limit }, activeTab === "personal");
  const { data: companyItemsData, isLoading: companyLoading } = useCompanyTalentPool({ page, limit });
  
  const togglePersonal = useToggleSave();
  const toggleCompany = useToggleCompanyCandidate();
  const updatePersonalNote = useUpdateNote();
  const updateCompanyNote = useUpdateCompanyNote();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const itemsData = activeTab === "personal" ? personalItemsData : companyItemsData;
  const items = itemsData?.data || [];
  const isLoading = activeTab === "personal" ? personalLoading : companyLoading;

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSaveNote = (itemId: string) => {
    if (activeTab === "personal") {
      updatePersonalNote.mutate({ itemId, note: noteText });
    } else {
      updateCompanyNote.mutate({ itemId, note: noteText });
    }
    setEditingNoteId(null);
  };

  const handleRemove = (candidateId: string) => {
    if (activeTab === "personal") {
      togglePersonal.mutate({ targetId: candidateId, targetType: "CANDIDATE" });
    } else {
      toggleCompany.mutate(candidateId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight border-l-4 border-primary pl-4">
            Kho ứng viên
          </h1>
          <p className="ml-4 mt-1 text-sm font-medium text-slate-500">
            Danh sách cá nhân dành cho từng HR và kho công ty dùng chung cho team tuyển dụng.
          </p>
        </div>
        <Badge variant="outline" className="w-fit font-bold">
          {itemsData?.meta?.total || 0} ứng viên
        </Badge>
      </div>

      <div className="flex w-fit rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
        <Button
          type="button"
          variant={activeTab === "personal" ? "default" : "ghost"}
          className="rounded-xl font-black"
          onClick={() => handleTabChange("personal")}
        >
          <User size={16} className="mr-2" /> Của tôi
        </Button>
        <Button
          type="button"
          variant={activeTab === "company" ? "default" : "ghost"}
          className="rounded-xl font-black"
          onClick={() => handleTabChange("company")}
        >
          <UsersRound size={16} className="mr-2" /> Công ty
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center font-bold text-slate-400">Đang tải danh sách ứng viên...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items?.length === 0 ? (
            <Card className="border-dashed md:col-span-2">
              <CardContent className="p-12 text-center text-slate-500">
                <User className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>
                  {activeTab === "personal"
                    ? "Bạn chưa lưu ứng viên nào."
                    : "Kho ứng viên công ty chưa có ứng viên nào."}
                </p>
              </CardContent>
            </Card>
          ) : (
            items?.map((item: any) => {
              const candidate = item.details;
              if (!candidate) return null;

              return (
                <Card key={item.id} className="group hover:shadow-md transition-all border-slate-200">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-4">
                        <Avatar className="h-16 w-16 rounded-xl border-2 border-white shadow-sm overflow-hidden">
                          <AvatarImage src={candidate.avatarUrl} className="object-cover" />
                          <AvatarFallback className="bg-slate-100 text-slate-400 font-bold">
                            {candidate.fullName?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {candidate.fullName}
                          </h3>
                          <div className="space-y-1 mt-1">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Mail size={12} />
                              {candidate.email}
                            </div>
                            {candidate.phone && (
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Phone size={12} />
                                {candidate.phone}
                              </div>
                            )}
                          </div>
                          {activeTab === "company" && item.user && (
                            <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Thêm bởi {item.user.fullName || item.user.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {activeTab === "personal" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-xl text-[10px] font-black"
                            onClick={() => toggleCompany.mutate(candidate.id)}
                          >
                            Đưa vào kho
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                          onClick={() => handleRemove(candidate.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      {editingNoteId === item.id ? (
                        <div className="space-y-2">
                          <Textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} className="text-xs" />
                          <Button size="sm" onClick={() => handleSaveNote(item.id)}>
                            <Save size={12} className="mr-1" /> Lưu
                          </Button>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg min-h-[40px] flex items-center justify-between">
                          {item.note || "Chưa có ghi chú nào..."}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              setEditingNoteId(item.id);
                              setNoteText(item.note || "");
                            }}
                          >
                            <Edit3 size={12} />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        Đã lưu: {format(new Date(item.createdAt), "dd/MM/yyyy", { locale: vi })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {itemsData && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={itemsData.meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default SavedCandidatesPage;
