import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes'; 
import { Toaster } from "@/components/ui/sonner";
import { useInitializeSocket } from '@/store/useSocketStore';
import './index.css';

function App() {
  useInitializeSocket();

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton/>
    </>
  );
}
export default App;