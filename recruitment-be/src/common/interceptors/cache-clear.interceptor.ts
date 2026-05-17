import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_CLEAR_METADATA_KEY } from '../decorators/cache-clear.decorator';

@Injectable()
export class CacheClearInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const patterns = this.reflector.getAllAndOverride<string[]>(
      CACHE_CLEAR_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      tap((responseData) => {
        if (!patterns || patterns.length === 0) return;

        // Chạy async xóa cache mà không block response
        void (async () => {
          try {
            const request = context.switchToHttp().getRequest();
            const { params } = request;

            for (const pattern of patterns) {
              // Xử lý placeholder động như {id}
              let key = pattern;
              if (pattern.includes('{id}')) {
                const id = params?.id || responseData?.id;
                if (id) {
                  key = pattern.replace('{id}', id);
                }
              }

              if (key.endsWith('*')) {
                // Với cache-manager v5+, store được thay thế bằng mảng stores
                const store: any = (this.cacheManager as any).stores?.[0];
                if (store && typeof store.keys === 'function') {
                  const keys = await store.keys(key);
                  if (keys && keys.length > 0) {
                    await store.mdel(...keys);
                  }
                }
              } else {
                await this.cacheManager.del(key);
              }
            }
          } catch (error) {
            // Log lỗi nếu cần, nhưng không để crash request
            console.error('Error clearing cache in interceptor:', error);
          }
        })();
      }),
    );
  }
}
