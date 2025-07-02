import { BrowserRouter, Routes, Route } from 'react-router';
import { HeaderLayout, MapLayout } from '@/layouts';
import { Map } from '@/pages/Map';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeaderLayout />}>
          <Route path="/" element={<MapLayout />}>
            <Route index element={<Map />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
