import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';

export const App: React.FC = () => {
  return (
    <WorkspaceProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Showcase Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Interactive Brain Vault Desktop App */}
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
