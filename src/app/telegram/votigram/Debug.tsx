import { useWebLogin } from 'aelf-web-login';
import { VotigramScene } from './const';

interface IDebugProps {
  setScene: (scene: VotigramScene) => void;
}

export default function Debug(props: IDebugProps) {
  const { setScene } = props;
  const { login } = useWebLogin();
  return (
    <div className="fixed z-50 left-0 bottom-0">
      <button
        onClick={() => {
          setScene(VotigramScene.Loading);
        }}
      >
        Loading
      </button>
      <button
        onClick={() => {
          setScene(VotigramScene.Slide);
        }}
      >
        slide
      </button>
      <button
        onClick={() => {
          setScene(VotigramScene.Main);
        }}
      >
        Main
      </button>
      <button
        onClick={() => {
          login();
        }}
      >
        login
      </button>
    </div>
  );
}
