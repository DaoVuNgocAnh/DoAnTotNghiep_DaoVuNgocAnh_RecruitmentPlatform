import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';
import { useEffect } from 'react';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
}

// Tính toán SOCKET_URL linh hoạt:
// Luôn ưu tiên dùng Origin hiện tại của trình duyệt để tránh lỗi CORS và Namespace
const SOCKET_URL = typeof window !== 'undefined' ? window.location.origin : (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/api$/, '');

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (token: string) => {
    // Nếu đã có socket và đang kết nối thì không tạo mới
    if (get().socket?.connected) return;

    // Đảm bảo đóng socket cũ trước khi tạo mới (tránh rò rỉ session sid)
    if (get().socket) {
      get().socket?.disconnect();
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'], // Chỉ dùng websocket để tránh lỗi polling 400 với Ngrok
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
      forceNew: true, // Ép buộc tạo kết nối mới
    });

    socket.on('connect', () => {
      set({ isConnected: true });
      console.log('--- WEBSOCKET CONNECTED ---');
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
      console.log('--- WEBSOCKET DISCONNECTED ---');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket Connection Error:', error);
      set({ isConnected: false });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));

// Hook tiện ích để tự động quản lý vòng đời socket
export const useInitializeSocket = () => {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);

  useEffect(() => {
    if (isAuthenticated && token) {
      connect(token);
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, token, connect, disconnect]);
};
