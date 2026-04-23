import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Kết nối database khi module được khởi tạo
  async onModuleInit() {
    await this.$connect();
  }

  // Ngắt kết nối khi ứng dụng tắt (tránh rò rỉ kết nối)
  async onModuleDestroy() {
    await this.$disconnect();
  }
}