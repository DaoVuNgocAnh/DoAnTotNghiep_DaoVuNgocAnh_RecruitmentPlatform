import { useState } from "react";
import { useSavedItems, useUpdateNote } from "../hooks/useSavedItems";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Trash2, Edit3, Save } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useToggleSave } from "../hooks/useSavedItems";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

const SavedCandidatesPage = () => {
  const { data: savedItems, isLoading } = useSavedItems("CANDIDATE");
  const toggleSave = useToggleSave();
  const updateNote = useUpdateNote();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const handleSaveNote = (itemId: string) => {
    updateNote.mutate({ itemId, note: noteText });
    setEditingNoteId(null);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Đang tải danh sách ứng viên...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight border-l-4 border-primary pl-4">
          Ứng viên đã lưu
        </h1>
        <Badge variant="outline" className="font-bold">
          {savedItems?.length || 0} ứng viên
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {savedItems?.length === 0 ? (
          <Card className="border-dashed md:col-span-2">
            <CardContent className="p-12 text-center text-slate-500">
              <User className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>Bạn chưa lưu ứng viên nào.</p>
            </CardContent>
          </Card>
        ) : (
          savedItems?.map((item: any) => {
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
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                      onClick={() => toggleSave.mutate({ targetId: candidate.id, targetType: "CANDIDATE" })}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    {editingNoteId === item.id ? (
                        <div className="space-y-2">
                            <Textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} className="text-xs" />
                            <Button size="sm" onClick={() => handleSaveNote(item.id)}><Save size={12} className="mr-1"/> Lưu</Button>
                        </div>
                    ) : (
                        <div className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg min-h-[40px] flex items-center justify-between">
                            {item.note || "Chưa có ghi chú nào..."}
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {setEditingNoteId(item.id); setNoteText(item.note || "")}}>
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
    </div>
  );
};

export default SavedCandidatesPage;
