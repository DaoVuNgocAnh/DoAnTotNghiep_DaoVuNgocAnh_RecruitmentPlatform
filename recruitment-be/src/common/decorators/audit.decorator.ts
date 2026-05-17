import { SetMetadata } from '@nestjs/common';

export const AUDIT_METADATA_KEY = 'audit_metadata';

export interface AuditOptions {
  entity: string;
  action?: string;
}

export const Audit = (options: AuditOptions | string) => {
  const auditOptions =
    typeof options === 'string' ? { entity: options } : options;
  return SetMetadata(AUDIT_METADATA_KEY, auditOptions);
};
