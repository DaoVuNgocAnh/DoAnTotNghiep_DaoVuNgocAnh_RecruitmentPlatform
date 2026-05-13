import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  MapPin,
  Building2,
  ArrowUpRight,
  Flame,
  ShieldCheck,
  Clock,
  Briefcase,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Job } from '@/modules/job/api/job.api';
import { SaveButton } from '@/modules/saved-items/components/SaveButton';
import { cn, formatSalary } from '@/lib/utils';
import { JOB_TYPES } from '@/constants/job.constants';

interface JobCardProps {
  job: Job;
  variant?: 'grid' | 'list';
  isTrending?: boolean;
}

export const JobCard = ({
  job,
  variant = 'grid',
  isTrending,
}: JobCardProps) => {
  const isList = variant === 'list';
  const isPremium = job.company?.isPremium;
  const jobTypeLabel = JOB_TYPES.find(t => t.value === job.jobType)?.label || job.jobType;

  return (
    <div
      className={cn(
        'relative group',
        (job.isFeatured || isTrending) && 'animate-in fade-in duration-700',
        !isList && 'h-full'
      )}
    >
      <Link to={`/jobs/${job.id}`} className={cn('block', !isList && 'h-full')}>
        <Card
          style={{ backgroundColor: '#ffffff' }}
          className={cn(
            'bg-white transition-all duration-500 border-transparent shadow-sm hover:shadow-2xl hover:shadow-primary/10 cursor-pointer active:scale-[0.98] border-l-4',
            isList
              ? 'flex flex-row p-4 gap-6 items-center rounded-3xl'
              : 'flex flex-col p-6 rounded-[2rem] h-full',
            isPremium
              ? 'border-l-amber-500 bg-gradient-to-r from-amber-50/20 to-transparent'
              : isTrending
                ? 'border-l-rose-500'
                : 'hover:border-l-primary'
          )}
        >
          {/* Logo Section */}
          <div
            className={cn(
              'rounded-2xl border border-slate-100 flex-shrink-0 flex items-center justify-center bg-white shadow-sm transition-all group-hover:border-primary/20',
              isList ? 'w-20 h-20 p-2.5' : 'w-20 h-20 p-4 mb-6'
            )}
          >
            {job.company.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="text-slate-300" size={32} />
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col flex-1 pr-12">
                {isPremium && (
                  <div className="flex items-center gap-1 text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1.5">
                    <ShieldCheck size={10} className="fill-amber-600/10" /> Đối
                    tác uy tín
                  </div>
                )}
                <h3
                  className={cn(
                    'font-black text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-2 tracking-tight capitalize',
                    isList ? 'text-base' : 'text-base mb-2 min-h-[3rem]'
                  )}
                >
                  {job.title}
                </h3>
              </div>
            </div>

            {variant === 'grid' && (
              <p className="text-xs font-black text-slate-400 mt-1 truncate uppercase tracking-widest">
                {job.company.name}
              </p>
            )}

            <div className="mt-auto">
              <div className={cn(
                "flex flex-wrap gap-x-6 gap-y-2 items-center",
                isList ? "mt-2" : "mt-6"
              )}>
                <div className="flex items-center gap-1.5 text-primary font-black text-sm uppercase tracking-tighter">
                  <DollarSign size={14} className="shrink-0" />{' '}
                  {formatSalary(
                    job.salaryMin,
                    job.salaryMax,
                    job.isSalaryNegotiable
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[11px] uppercase tracking-wide">
                  <MapPin size={14} className="shrink-0 text-blue-500" />{' '}
                  {job.location}
                </div>
                {isList && (
                  <>
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <Briefcase size={12} className="shrink-0 text-orange-400" />{' '}
                      {jobTypeLabel}
                    </div>
                    {job.expiredDate && (
                      <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <Clock size={12} className="shrink-0 text-rose-400" />{' '}
                        Hạn: {new Date(job.expiredDate).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Badges */}
              <div className={cn("flex items-center gap-2", isList ? "mt-3" : "mt-6")}>
                {!isList && (
                  <>
                    <Badge
                      variant="secondary"
                      className="bg-slate-100 text-slate-400 border-none text-[9px] font-black px-2.5 py-1 uppercase tracking-wider rounded-lg"
                    >
                      {jobTypeLabel}
                    </Badge>
                    {job.expiredDate && (
                       <Badge
                        variant="secondary"
                        className="bg-rose-50 text-rose-400 border-none text-[9px] font-black px-2.5 py-1 uppercase tracking-wider rounded-lg"
                      >
                        Hạn: {new Date(job.expiredDate).toLocaleDateString('vi-VN')}
                      </Badge>
                    )}
                  </>
                )}
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-500 border-none text-[9px] font-black px-2.5 py-1 uppercase tracking-wider rounded-lg"
                >
                  {job.category.name}
                </Badge>
                {isTrending && (
                  <Badge className="bg-rose-500 text-white hover:bg-rose-600 border-none text-[9px] font-black px-3 py-1 uppercase tracking-[0.1em] flex items-center gap-1.5 rounded-lg shadow-lg shadow-rose-200">
                    <Flame size={12} className="fill-current" /> Xu hướng
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* List Variant Action */}
          {isList && (
            <div className="flex flex-col items-end gap-3 pl-6 border-l border-slate-100 ml-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shrink-0 shadow-sm">
                <ArrowUpRight size={24} />
              </div>
            </div>
          )}
        </Card>
      </Link>

      {/* Save Button */}
      <div
        className={cn(
          'absolute z-10',
          isList ? 'top-6 right-20' : 'top-8 right-8'
        )}
      >
        <SaveButton
          targetId={job.id}
          targetType="JOB"
          className="bg-white/80 backdrop-blur-md border-slate-100 shadow-sm hover:border-rose-200 hover:text-rose-500 rounded-xl w-10 h-10"
        />
      </div>
    </div>
  );
};
