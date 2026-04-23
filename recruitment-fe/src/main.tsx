import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';
import App from './App.tsx';

// 1. Khởi tạo QueryClient - Bộ não quản lý cache dữ liệu
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dữ liệu sẽ được coi là "cũ" (stale) ngay lập tức để luôn ưu tiên cập nhật mới nhất
      staleTime: 0, 
      // Thời gian lưu dữ liệu trong bộ nhớ đệm (5 phút)
      gcTime: 1000 * 60 * 5, 
      // Tự động fetch lại dữ liệu khi người dùng chuyển tab quay lại web (Rất quan trọng cho logic của bạn)
      refetchOnWindowFocus: true, 
      // Tự động lấy data mới khi component được vẽ ra
      refetchOnMount: true,
      // Thử lại 1 lần nếu request lỗi
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 2. Bọc App trong Provider để sử dụng React Query toàn hệ thống */}
    <QueryClientProvider client={queryClient}>
      <App />
      
      {/* 3. Công cụ hỗ trợ Debug dữ liệu (Chỉ xuất hiện khi phát triển) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);