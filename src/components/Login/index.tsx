import { Button } from 'aelf-design';
import useResponsive from 'hooks/useResponsive';
import { useWalletService } from 'hooks/useWallet';
export default function Login() {
  const { isLG } = useResponsive();
  const { login } = useWalletService();
  return (
    <Button size={isLG ? 'medium' : 'large'} type="primary" onClick={login}>
      Log In
    </Button>
  );
}
