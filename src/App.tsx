import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { WorkspacePage } from './pages/WorkspacePage';

export const App: React.FC = () => {
  return (
    <WorkspaceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WorkspacePage />} />
          <Route path="/app" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WorkspaceProvider>
  );
};

export default App;
