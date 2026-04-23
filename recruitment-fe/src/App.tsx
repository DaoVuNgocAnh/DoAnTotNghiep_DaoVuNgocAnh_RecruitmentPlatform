// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes'; 
import { Toaster } from "@/components/ui/sonner";
import './index.css';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton/>
    </>
  );
}
export default App;