import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.userId;

      client.data.userId = userId;

      // Gia nhập room riêng của user để nhận thông báo (hỗ trợ nhiều tab/nhiều instance)
      await client.join(`user:${userId}`);

      console.log(`User ${userId} connected and joined room user:${userId}`);
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      console.log(`User ${userId} disconnected from socket ${client.id}`);
    }
  }

  sendNotificationToUser(userId: string, notification: any) {
    // Gửi đến toàn bộ các socket đang ở trong room của user đó
    this.server.to(`user:${userId}`).emit('newNotification', notification);
  }
}
