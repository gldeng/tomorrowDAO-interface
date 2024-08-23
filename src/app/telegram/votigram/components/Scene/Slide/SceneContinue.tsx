import { Button } from 'antd';
import Scene from '../index';
import { ImageLoveNode } from '../ImageLoveNode';

interface ISceneContinueProps {
  onContinue?: () => void;
}
function SceneContinue(props: ISceneContinueProps) {
  const { onContinue } = props;
  return (
    <Scene
      className="scene-continue"
      title="🌈  Vote your favorite app"
      description="Cast your vote for your favourite Telegram app!"
      imageNode={<ImageLoveNode />}
      foot={
        <div className="scene-continue-foot">
          <Button type="primary" onClick={onContinue}>
            Continue
          </Button>
        </div>
      }
    />
  );
}
export default SceneContinue;
