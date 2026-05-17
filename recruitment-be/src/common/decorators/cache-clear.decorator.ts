import { SetMetadata } from '@nestjs/common';

export const CACHE_CLEAR_METADATA_KEY = 'cache_clear_metadata';

export const CacheClear = (...patterns: string[]) =>
  SetMetadata(CACHE_CLEAR_METADATA_KEY, patterns);
