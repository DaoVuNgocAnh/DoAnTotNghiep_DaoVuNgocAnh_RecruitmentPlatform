import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useEmployerSetup } from '../hooks/useEmployerSetup';
import { SetupChoice } from '../components/SetupChoice';
import { SetupJoin } from '../components/SetupJoin';
import { SetupCreate } from '../components/SetupCreate';

export const EmployerSetupPage = () => {
  const {
    step,
    setStep,
    taxCodeSearch,
    setTaxCodeSearch,
    foundCompany,
    setFoundCompany,
    isSearching,
    form,
    handleSearch,
    joinMutation,
    createCompanyMutation,
    onCreateSubmit,
    handleJoin,
  } = useEmployerSetup();

  if (step === 'choice') {
    return <SetupChoice onSelectStep={setStep} />;
  }

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center p-6 py-12">
      <Card className="max-w-2xl w-full rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-none animate-in slide-in-from-bottom-4 duration-500 overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-8 border-b border-slate-50 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setStep('choice'); setFoundCompany(null); }}
            className="rounded-full hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              {step === 'create' ? 'Pháp nhân doanh nghiệp' : 'Tìm kiếm đối tác'}
            </CardTitle>
            <CardDescription className="font-medium text-slate-500">
              {step === 'create' ? 'Cung cấp thông tin để xác thực hệ thống' : 'Sử dụng mã số thuế để định danh công ty'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {step === 'join' ? (
            <SetupJoin
              taxCodeSearch={taxCodeSearch}
              setTaxCodeSearch={setTaxCodeSearch}
              isSearching={isSearching}
              handleSearch={handleSearch}
              foundCompany={foundCompany}
              handleJoin={handleJoin}
              isJoining={joinMutation.isPending}
            />
          ) : (
            <SetupCreate
              form={form}
              onSubmit={onCreateSubmit}
              isPending={createCompanyMutation.isPending}
            />
          )}
        </CardContent>
        <CardFooter className="justify-center border-t py-6 bg-slate-50/50">
          <p className="text-[10px] text-slate-400 text-center px-10 leading-relaxed uppercase tracking-tighter font-bold">
            Dữ liệu sẽ được gửi tới Admin hệ thống để đối soát pháp nhân. <br/>Quá trình phê duyệt diễn ra trong 24h làm việc.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
