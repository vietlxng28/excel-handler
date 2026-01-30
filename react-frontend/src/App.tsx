import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Excel2Json from './pages/Excel2Json.tsx';
import AddPrefixes2Expression from './pages/AddPrefixes2Expression.tsx';
import { exerciseRoutes } from './pages/Exercise/router';


export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Excel2Json />} />
          <Route path="ap2e" element={<AddPrefixes2Expression />} />
          {exerciseRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
