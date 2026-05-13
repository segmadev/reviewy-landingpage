import { RouterProvider } from 'react-router-dom';
import router from './router';
import { AuthProvider } from './context/AuthContext';
import { BuilderProvider } from './context/BuilderContext';

export default function App() {
  return (
    <AuthProvider>
      <BuilderProvider>
        <RouterProvider router={router} />
      </BuilderProvider>
    </AuthProvider>
  );
}
