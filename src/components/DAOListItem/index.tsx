import { Typography } from 'antd';
import './index.css';
const { Paragraph } = Typography;
export default function DAOListItem() {
  return (
    <div className="dao-list-item">
      <div className="dao-list-item-title">
        <div className="dao-logo">{/* <img src={DAODefaultImg} alt="" /> */}</div>
        <div className="dao-title">
          <Typography.Title level={5}>Network DAO</Typography.Title>
        </div>
      </div>
      <div className="dao-list-item-content">
        <Paragraph
          ellipsis={{
            rows: 2,
          }}
          className="content-text"
        >
          Network DAO plays a role of supervision and management, ensuring the network&apos;s stable
          operation and development, and representing the interests of community members.This may
          involve the network&apos;s technical upgrades, security maintenance,and the review and
          voting on new proposals.
        </Paragraph>
      </div>
      <div className="dao-list-item-count">
        <div className="count-item">
          <div className="count-title">Proposals</div>
          <div className="count-amount">0</div>
        </div>
        <div className="count-item">
          <div className="count-title">Holders</div>
          <div className="count-amount">12</div>
        </div>
        <div className="count-item">
          <div className="count-title">Voters</div>
          <div className="count-amount">33</div>
        </div>
      </div>
    </div>
  );
}
