import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ContactPage from '@/pages/ContactPage';

// Routing (BrowserRouter / Routes) lives here, not in main.tsx.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/contact" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
