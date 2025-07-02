import { BrowserRouter, Routes, Route } from 'react-router';
import { HeaderLayout } from '@/components/layouts';
import { Map } from '@/pages/Map';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeaderLayout />}>
          <Route index element={<Map />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
