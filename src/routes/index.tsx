import { BrowserRouter, Routes, Route } from 'react-router';
import { HeaderLayout } from '@/layouts';
import { MapPage } from '@/pages/MapPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeaderLayout />}>
          <Route index element={<MapPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
