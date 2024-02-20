import { Button } from 'aelf-design';
import useResponsive from 'hooks/useResponsive';
export default function Login() {
  const { isLG } = useResponsive();
  return (
    <Button size={isLG ? 'medium' : 'large'} type="primary">
      Log In
    </Button>
  );
}
