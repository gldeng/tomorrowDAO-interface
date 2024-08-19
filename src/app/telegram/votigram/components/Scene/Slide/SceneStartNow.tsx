import Image from 'next/image';
import { Button } from 'antd';
import Scene from '../index';

interface ISceneStartNowProps {
  onStart?: () => void;
}
function SceneStartNow(props: ISceneStartNowProps) {
  const { onStart } = props;
  return (
    <Scene
      className="scene-start-now"
      title="🤑  Earn rewards"
      description="Earn points by voting and redeem them for Tomorrow Token rewards!"
      imageNode={
        <div className="start-now-image-wrap">
          <Image src={'/images/tg/gift.png'} width={175} height={205} alt={''} />
        </div>
      }
      foot={
        <div className="scene-continue-foot">
          <Button type="primary" onClick={onStart}>
            Start Now
          </Button>
        </div>
      }
    />
  );
}
export default SceneStartNow;
