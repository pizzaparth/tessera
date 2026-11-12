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
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<WorkspacePage />} />
          <Route path="/workspace" element={<Navigate to="/app" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WorkspaceProvider>
  );
};

export default App;
