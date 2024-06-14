import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Button } from 'aelf-design';
import { DownOutlined } from '@aelf-design/icons';
import './index.css';

interface ILoadMoreButtonProps {
  onClick: () => void;
  loadingMore?: boolean;
}
export default function LoadMoreButton(props: ILoadMoreButtonProps) {
  const { loadingMore } = props;
  return (
    <div className="more-button" onClick={props.onClick}>
      <Button className="">
        {loadingMore ? (
          <Spin indicator={<LoadingOutlined />} />
        ) : (
          <>
            <span className="more-text">Load More</span>
            <DownOutlined />
          </>
        )}
      </Button>
    </div>
  );
}
