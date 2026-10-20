import { RouterProvider } from 'react-router-dom';
import router from './router';
import { AuthProvider } from './context/AuthContext';
import { BuilderProvider } from './context/BuilderContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/Toast/ToastContainer';
import { useAutoSave } from './hooks/useAutoSave';
import SessionExpiredModal from './components/auth/SessionExpiredModal';

function BuilderPersistence() {
  useAutoSave();
  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BuilderProvider>
          <BuilderPersistence />
          <RouterProvider router={router} />
          <SessionExpiredModal />
          <ToastContainer />
        </BuilderProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
