import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SystemLogService } from '../../modules/system-log/system-log.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: SystemLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body, params } = request;

    return next.handle().pipe(
      tap((responseData) => {
        if (method === 'GET') return;

        // 1. Xác định targetType từ URL
        let targetType = '';
        if (url.includes('/jobs')) targetType = 'JOB';
        else if (url.includes('/companies')) targetType = 'COMPANY';
        else if (url.includes('/users')) targetType = 'USER';
        else if (url.includes('/auth')) targetType = 'AUTH';
        else if (url.includes('/applications')) targetType = 'APPLICATION';
        else if (url.includes('/resumes')) targetType = 'RESUME';
        else if (url.includes('/interviews')) targetType = 'INTERVIEW';
        else if (url.includes('/notifications')) targetType = 'NOTIFICATION';
        else if (url.includes('/saved-items')) targetType = 'SAVED_ITEM';
        else if (url.includes('/job-categories')) targetType = 'JOB_CATEGORY';

        // 2. Xác định targetId từ params hoặc responseData
        const targetId = params?.id || responseData?.id || null;

        // 3. Xác định userId từ request user hoặc login response
        const userId = user?.userId || responseData?.user?.id || null;

        this.logService
          .createLog({
            userId: userId || null,
            actionType: `${method}:${url}`,
            targetType,
            targetId,
            description: `User ${user?.email || responseData?.user?.email || 'Guest'} performed ${method} on ${url}`,
          })
          .catch((err) => console.error('Failed to log:', err));
      }),
    );
  }
}
