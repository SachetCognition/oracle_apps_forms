import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const url = request.url;
    const userId = request.user?.accountNumber || request.user?.username || 'anonymous';

    return next.handle().pipe(
      tap(async (responseData) => {
        try {
          const auditRepo = this.dataSource.getRepository(AuditLog);
          const auditEntry = auditRepo.create({
            tableName: this.extractTableName(url),
            operation: method,
            recordId: this.extractRecordId(url, responseData),
            oldValues: null,
            newValues: request.body || null,
            userId,
          });
          await auditRepo.save(auditEntry);
        } catch {
          // Audit logging should not break the request
        }
      }),
    );
  }

  private extractTableName(url: string): string {
    const parts = url.split('/').filter(Boolean);
    // Get the resource name from the URL (e.g., /api/transactions -> transactions)
    if (parts.length >= 2) {
      return parts[1];
    }
    return parts[0] || 'unknown';
  }

  private extractRecordId(url: string, responseData: unknown): string {
    const parts = url.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    if (/^\d+$/.test(lastPart)) {
      return lastPart;
    }
    if (responseData && typeof responseData === 'object') {
      const data = responseData as Record<string, unknown>;
      return String(data['requestId'] || data['transactionId'] || data['id'] || '');
    }
    return '';
  }
}
