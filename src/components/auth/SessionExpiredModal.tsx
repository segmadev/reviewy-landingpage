import FinishLoginModal from '../builder/FinishLoginModal';
import { useAuth } from '../../context/AuthContext';

export default function SessionExpiredModal() {
  const { isSessionExpired } = useAuth();

  return (
    <FinishLoginModal
      isOpen={isSessionExpired}
      onClose={() => undefined}
      onLoginSuccess={() => undefined}
      loginTitle="Your session has expired"
      loginDescription="Sign in again to continue exactly where you left off. Your current work is still here."
      allowSignup={false}
      dismissible={false}
    />
  );
}
