import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ProductPage } from './pages/ProductPage';
import { PricingPage } from './pages/PricingPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { CustomersPage } from './pages/CustomersPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <WorkspaceProvider>
      <BrowserRouter>
        <Routes>
          {/* Solid White SaaS Landing & Static Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Interactive Brain Vault Demo Interface (Launched via 'Try Demo' Magnetic Button) */}
          <Route path="/demo" element={<WorkspacePage />} />
          <Route path="/app" element={<WorkspacePage />} />
          <Route path="/vault" element={<WorkspacePage />} />

          {/* Catch-all redirect to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WorkspaceProvider>
  );
};

export default App;
