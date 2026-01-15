import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Excel2Json from './pages/Excel2Json.tsx';
import AddPrefixes2Expression from './pages/AddPrefixes2Expression.tsx';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Excel2Json />} />
          <Route path="ap2e" element={<AddPrefixes2Expression />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
