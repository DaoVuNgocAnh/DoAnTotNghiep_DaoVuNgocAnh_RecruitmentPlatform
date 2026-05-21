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
// Nếu đang truy cập qua Domain/IP nào thì dùng chính Domain/IP đó để kết nối socket
const getSocketUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || '';
  if (envUrl.includes(window.location.hostname)) {
    return window.location.origin; // Dùng origin hiện tại (loại bỏ /api)
  }
  return envUrl.replace(/\/api$/, '') || window.location.origin;
};

const SOCKET_URL = getSocketUrl();

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: (token: string) => {
    if (get().socket?.connected) return;

    const socket = io(SOCKET_URL, {
      auth: { token }, // Gửi raw token
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
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
