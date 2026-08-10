import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UIProvider }  from './contexts/UIContext';
import ToastContainer  from './components/common/Toast';
import AppRoutes       from './routes/AppRoutes';
import './styles/tokens.css';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UIProvider>
        <AuthProvider>
          <AppRoutes />
          <ToastContainer />
        </AuthProvider>
      </UIProvider>
    </BrowserRouter>
  </StrictMode>
);
