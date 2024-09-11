import { DownOutlined, QuestionCircleOutlined } from '@aelf-design/icons';
import { HashAddress } from 'aelf-design';
import { useWebLogin } from 'aelf-web-login';

interface IReferListProps {
  onViewMore?: () => void;
  isShowMore?: boolean;
  list: IInviterInfo[];
  meRank: number;
  meInviteeCount: number;
}
export default function ReferList(props: IReferListProps) {
  const { onViewMore, isShowMore, list, meRank, meInviteeCount } = props;
  const { wallet } = useWebLogin();
  return (
    <div className="leaderboard-wrap">
      <ul className="header">
        <li className="left">Rank</li>
        <li className="main">Wallet Address</li>
        <li className="right">
          Invited <QuestionCircleOutlined />
        </li>
      </ul>
      <ul className="top-wrap">
        <li className="left">{meRank}</li>
        <li className="main">
          <HashAddress address={wallet.address} hasCopy={false} preLen={8} endLen={8} />
          <div className="me-tag flex-center">Me</div>
        </li>
        <li className="right">{meInviteeCount}</li>
      </ul>
      <div>
        {list?.map((item) => (
          <ul className="invite-item" key={item.inviter}>
            <li className="left">{item.rank}</li>
            <li className="main">
              <HashAddress address={item.inviter} hasCopy={false} preLen={8} endLen={8} />
            </li>
            <li className="right">{item.inviteeCount}</li>
          </ul>
        ))}
      </div>
      {isShowMore && (
        <div className="view-more" onClick={onViewMore}>
          <span className="view-more-text">View More</span>
          <DownOutlined />
        </div>
      )}
    </div>
  );
}
