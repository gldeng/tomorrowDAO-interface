import { DownOutlined, QuestionCircleOutlined } from '@aelf-design/icons';
import { HashAddress } from 'aelf-design';
import { useWebLogin } from 'aelf-web-login';

interface IReferListProps {
  onViewMore?: () => void;
  isShowMore?: boolean;
  list: IInviterInfo[];
  me?: IInviterInfo;
}
export default function ReferList(props: IReferListProps) {
  const { onViewMore, isShowMore, list, me } = props;
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
        <li className="left">{me?.rank}</li>
        <li className="main">
          <HashAddress address={wallet.address} hasCopy={false} preLen={8} endLen={8} />
          <div className="me-tag flex-center">Me</div>
        </li>
        <li className="right">{me?.inviteAndVoteCount}</li>
      </ul>
      <div>
        {list?.map((item, index) => (
          <ul className="invite-item" key={item.inviter}>
            <li className="left">
              {[0, 1, 2].includes(index) ? (
                <img
                  src={`/images/tg/rank-icon-${index}.png`}
                  className="vote-item-icon"
                  alt="rank-icon"
                  width={10}
                  height={20}
                />
              ) : (
                item.rank
              )}
            </li>
            <li className="main">
              <HashAddress address={item.inviter} hasCopy={false} preLen={8} endLen={8} />
            </li>
            <li className="right">{item.inviteAndVoteCount}</li>
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
