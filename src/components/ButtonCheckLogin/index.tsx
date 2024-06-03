import { Button, IButtonProps } from 'aelf-design';
import { useWebLogin } from 'aelf-web-login';

export const ButtonCheckLogin: React.FC<IButtonProps> = (props) => {
  const { wallet, login } = useWebLogin();
  return (
    <Button
      {...props}
      onClick={(...args) => {
        if (!wallet.address) {
          login();
          return;
        }
        props.onClick?.(...args);
      }}
    />
  );
};
