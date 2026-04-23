import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Biến Module này thành toàn cục
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Xuất Service này ra để các module khác sử dụng
})
export class PrismaModule {}