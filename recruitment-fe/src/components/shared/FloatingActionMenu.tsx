import { useState, type ElementType } from 'react';
import {
  Headphones,
  Heart,
  Menu,
  MessageCircle,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FeedbackDialog } from '@/components/shared/support/FeedbackDialog';
import { SupportChatWidget } from '@/components/shared/support/SupportChatWidget';
import { cn } from '@/lib/utils';
import { useSavedItems } from '@/modules/saved-items/hooks/useSavedItems';
import { useAuthStore } from '@/store/useAuthStore';
import { useUser } from '@/modules/user/hooks/useUser';

type FloatingAction = {
  label: string;
  icon: ElementType;
  badge?: number;
  compact?: boolean;
  onClick: () => void;
};

export const FloatingActionMenu = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { data: user } = useUser();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const isCandidate = user?.role === 'CANDIDATE';
  const shouldShow = !user || isCandidate;
  const { data: savedJobs } = useSavedItems(
    'JOB',
    isAuthenticated && isCandidate,
  );

  if (isAuthenticated && !user) return null;
  if (!shouldShow) return null;

  const requireLogin = (path: string, message: string) => {
    if (!isAuthenticated) {
      toast.error(message);
      navigate('/login');
      return;
    }
    navigate(path);
  };

  const actions: FloatingAction[] = [
    {
      label: 'Đã lưu',
      icon: Heart,
      badge: savedJobs?.length || 0,
      compact: true,
      onClick: () =>
        requireLogin('/saved-jobs', 'Vui lòng đăng nhập để xem việc đã lưu'),
    },
    {
      label: isAuthenticated ? 'CV' : 'Tham gia',
      icon: UserPlus,
      compact: true,
      onClick: () => navigate(isAuthenticated ? '/resumes' : '/register'),
    },
    {
      label: 'Ứng tuyển',
      icon: ShieldCheck,
      compact: true,
      onClick: () =>
        requireLogin(
          '/my-applications',
          'Vui lòng đăng nhập để theo dõi đơn ứng tuyển',
        ),
    },
    {
      label: 'Góp ý',
      icon: MessageCircle,
      onClick: () => setFeedbackOpen(true),
    },
  ];

  const supportAction: FloatingAction = {
    label: 'Hỗ trợ',
    icon: Headphones,
    onClick: () => undefined,
  };

  return (
    <>
      <div className="fixed bottom-24 right-5 z-40 hidden flex-col items-center gap-3 md:flex">
        {actions.slice(0, 3).map((action) => (
          <FloatingButton key={action.label} action={action} />
        ))}

        <div className="flex flex-col overflow-hidden rounded-full bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-100">
          <FloatingButton action={actions[3]} grouped />
          <SupportPopover action={supportAction} grouped />
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-40 md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="h-14 w-14 rounded-full bg-primary shadow-2xl shadow-primary/30">
              <Menu size={22} />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={12}
            className="w-56 rounded-3xl border-slate-100 p-2 shadow-2xl"
          >
            <div className="space-y-1">
              {actions.map((action) => (
                <MobileAction key={action.label} action={action} />
              ))}
              <SupportMobileAction action={supportAction} />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
};

const FloatingButton = ({
  action,
  grouped,
}: {
  action: FloatingAction;
  grouped?: boolean;
}) => {
  const Icon = action.icon;

  return (
    <button
      type="button"
      onClick={action.onClick}
      aria-label={action.label}
      className={cn(
        'relative flex h-14 w-14 flex-col items-center justify-center bg-white text-primary transition-all hover:-translate-y-0.5 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        action.compact ? 'rounded-full shadow-xl shadow-slate-900/10' : 'gap-1',
        grouped && 'rounded-none shadow-none',
      )}
    >
      <Icon size={24} className={action.label === 'Đã lưu' ? 'fill-current' : ''} />
      {!action.compact && (
        <span className="text-[11px] font-black leading-none">{action.label}</span>
      )}
      {typeof action.badge === 'number' && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black text-white ring-2 ring-white">
          {action.badge}
        </span>
      )}
    </button>
  );
};

const SupportPopover = ({
  action,
  grouped,
}: {
  action: FloatingAction;
  grouped?: boolean;
}) => {
  const Icon = action.icon;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={action.label}
          className={cn(
            'flex h-16 w-14 flex-col items-center justify-center gap-1 bg-white text-primary transition-all hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
            grouped && 'border-t border-slate-100',
          )}
        >
          <Icon size={23} />
          <span className="text-[11px] font-black leading-none">{action.label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="left"
        sideOffset={12}
        className="w-[380px] rounded-3xl border-slate-100 p-0 shadow-2xl"
      >
        <SupportChatWidget />
      </PopoverContent>
    </Popover>
  );
};

const MobileAction = ({ action }: { action: FloatingAction }) => {
  const Icon = action.icon;

  return (
    <button
      type="button"
      onClick={action.onClick}
      className="relative flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50"
    >
      <Icon size={19} className="text-primary" />
      <span>{action.label}</span>
      {typeof action.badge === 'number' && (
        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-white">
          {action.badge}
        </span>
      )}
    </button>
  );
};

const SupportMobileAction = ({ action }: { action: FloatingAction }) => {
  const Icon = action.icon;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          <Icon size={19} className="text-primary" />
          <span>{action.label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[calc(100vw-2rem)] max-w-sm rounded-3xl border-slate-100 p-0 shadow-2xl"
      >
        <SupportChatWidget />
      </PopoverContent>
    </Popover>
  );
};
