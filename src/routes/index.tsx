import { BrowserRouter, Routes, Route } from 'react-router';
import { AppLayout } from '@/components/layouts';
import { Map } from '@/pages/Map';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Map />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
