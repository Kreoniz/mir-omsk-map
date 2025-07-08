import { Toaster } from 'react-hot-toast';
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

      <Toaster
        position="bottom-right"
        gutter={4}
        reverseOrder={true}
        toastOptions={{
          duration: 3000,
          removeDelay: 0,
        }}
      />
    </BrowserRouter>
  );
}
