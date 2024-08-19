import Image from 'next/image';
import { Button, Progress } from 'antd';
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
      title="🌈  Vote your favorite game"
      description="Cast your vote for your favourite Telegram Game!"
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
