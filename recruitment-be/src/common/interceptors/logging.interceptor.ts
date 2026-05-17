import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SystemLogService } from '../../modules/system-log/system-log.service';
import {
  AUDIT_METADATA_KEY,
  AuditOptions,
} from '../decorators/audit.decorator';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logService: SystemLogService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, params } = request;

    // Lấy metadata từ decorator @Audit
    const auditOptions = this.reflector.getAllAndOverride<AuditOptions>(
      AUDIT_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      tap((responseData) => {
        // Chỉ log các phương pháp thay đổi dữ liệu và phải có @Audit decorator
        if (method === 'GET' || !auditOptions) return;

        // 1. Xác định targetType từ metadata
        const targetType = auditOptions.entity;

        // 2. Xác định targetId từ params hoặc responseData
        const targetId = params?.id || responseData?.id || null;

        // 3. Xác định userId từ request user hoặc login response
        const userId = user?.userId || responseData?.user?.id || null;

        const actionDescription = auditOptions.action || `${method}:${url}`;

        this.logService
          .createLog({
            userId: userId || null,
            actionType: actionDescription,
            targetType,
            targetId,
            description: `User ${user?.email || responseData?.user?.email || 'Guest'} performed ${actionDescription}`,
          })
          .catch((err) => console.error('Failed to log:', err));
      }),
    );
  }
}
