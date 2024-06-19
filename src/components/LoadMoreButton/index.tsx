import { DownOutlined } from '@aelf-design/icons';
import loadingSrc from '../../assets/imgs/loading.svg';

import './index.css';

interface ILoadMoreButtonProps {
  onClick: () => void;
  loadingMore?: boolean;
}
export default function LoadMoreButton(props: ILoadMoreButtonProps) {
  const { loadingMore } = props;
  return (
    <div className="more-button" onClick={props.onClick}>
      {loadingMore ? (
        <img src={loadingSrc} className="loading" alt="" />
      ) : (
        <>
          <span className="more-text">Load More</span>
          <DownOutlined />
        </>
      )}
    </div>
  );
}
