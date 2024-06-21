import { RightOutlined } from '@aelf-design/icons';
import './index.css';

export default function ViewMoreButton() {
  return (
    <span className="flex items-center view-more-wrap">
      <span className="pr-[8px] text">View More</span>
      <RightOutlined />
    </span>
  );
}
