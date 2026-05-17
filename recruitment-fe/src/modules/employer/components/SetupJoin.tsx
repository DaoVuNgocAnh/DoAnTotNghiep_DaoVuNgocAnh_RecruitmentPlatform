import { Hash, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SetupJoinProps {
  taxCodeSearch: string;
  setTaxCodeSearch: (val: string) => void;
  isSearching: boolean;
  handleSearch: () => void;
  foundCompany: any;
  handleJoin: () => void;
  isJoining: boolean;
}

export const SetupJoin = ({
  taxCodeSearch,
  setTaxCodeSearch,
  isSearching,
  handleSearch,
  foundCompany,
  handleJoin,
  isJoining,
}: SetupJoinProps) => {
  return (
    <div className="space-y-8 px-4">
      <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-inner">
        <div className="relative flex-1">
          <Hash className="absolute left-3 top-3.5 text-slate-400" size={18} />
          <Input 
            placeholder="Mã số thuế (10 hoặc 13 số)..." 
            className="pl-10 h-14 rounded-xl border-none bg-transparent focus-visible:ring-0 font-bold text-lg text-slate-700" 
            value={taxCodeSearch}
            onChange={(e) => setTaxCodeSearch(e.target.value)}
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="h-14 px-8 bg-blue-600 hover:bg-blue-700 rounded-xl font-black shadow-lg shadow-blue-200"
        >
          {isSearching ? <Loader2 className="animate-spin" size={24} /> : 'TÌM KIẾM'}
        </Button>
      </div>

      {foundCompany && (
        <div className="p-8 border-2 border-blue-100 rounded-[2rem] bg-blue-50/20 flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-top-4 shadow-sm">
          <div className="w-20 h-20 bg-white rounded-3xl border-2 border-white shadow-xl flex items-center justify-center text-3xl font-black text-blue-600 shrink-0 uppercase">
            {foundCompany.name.charAt(0)}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h4 className="font-black text-slate-900 text-xl tracking-tight uppercase leading-tight">{foundCompany.name}</h4>
            <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest leading-none">MST: {foundCompany.taxCode}</p>
          </div>
          <Button
            onClick={handleJoin}
            disabled={isJoining}
            className="bg-[#00b14f] hover:bg-[#009643] rounded-2xl gap-2 font-black px-8 py-6 shadow-xl shadow-green-100 transition-all active:scale-95 h-auto"
          >
            {isJoining ? <Loader2 className="animate-spin" /> : <Send size={18} />}
            XIN GIA NHẬP
          </Button>
        </div>
      )}
    </div>
  );
};
