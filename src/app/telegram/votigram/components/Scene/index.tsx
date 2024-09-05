import './index.css';

interface ISceneProps {
  foot: React.ReactNode;
  imageNode: React.ReactNode;
  middleNode?: React.ReactNode;
  title: string;
  description: string;
  bodyUrl?: string;
  className?: string;
}
function SceneCore(props: ISceneProps) {
  const { foot, title, description, className, imageNode, middleNode } = props;
  return (
    <div className={`${className} telegram-scene`}>
      <div className="scene-body-header">{imageNode}</div>
      <h2 className="scene-title title-text">{title}</h2>
      <p className="scene-description sub-title-text text-center">{description}</p>
      {middleNode}
      <div className="scene-foot">{foot}</div>
    </div>
  );
}
export default SceneCore;
