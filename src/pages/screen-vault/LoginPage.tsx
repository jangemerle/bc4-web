import { ScreenVaultFrame } from '../../layouts/ScreenVaultFrame';
import Login from '../Login';

export default function LoginPage() {
  return (
    <ScreenVaultFrame
      title="Login"
      description="A clean, focused login form with email and password fields, remember-me option, and password recovery link."
      standaloneId="login"
    >
      <Login />
    </ScreenVaultFrame>
  );
}
