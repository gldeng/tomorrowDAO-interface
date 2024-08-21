import Image from 'next/image';
import './index.css';
import BigNumber from 'bignumber.js';

interface IVoteItemProps {
  index: number;
  canVote: boolean;
  onVote?: (item: IRankingListResItem) => void;
  item: IRankingListResItem;
}

const rankIndex = [0, 1, 2];
export default function VoteItem(props: IVoteItemProps) {
  const { index, onVote, item, canVote } = props;
  const isRankIcon = rankIndex.includes(index);
  return (
    <div className="telegram-vote-item-wrap">
      <div className="telegram-vote-item-content truncate">
        <div className={`rank-index-wrap ${isRankIcon ? 'rank-icon' : 'rank-not-icon'}`}>
          {isRankIcon ? (
            <Image
              src={`/images/tg/rank-icon-${index}.png`}
              className="vote-item-icon"
              alt="rank-icon"
              width={24}
              height={45}
            />
          ) : (
            <div className="rank-text">
              <span className="title">{index + 1}</span>
              <span className="text">RANK</span>
            </div>
          )}
        </div>
        <div className="vote-game truncate">
          <img src={item.icon} alt="rank-icon" width={44} height={44} className="vote-item-icon" />
          <div className="vote-game-content truncate">
            <h3 className="title">{item.title}</h3>
            <p
              className="desc sub-title-text truncate"
              dangerouslySetInnerHTML={{ __html: item.description }}
            ></p>
          </div>
        </div>
      </div>
      {canVote ? (
        <div
          className="vote-button"
          onClick={() => {
            onVote?.(item);
          }}
        >
          Vote
        </div>
      ) : (
        <h3 className="vote-amount font-14-18">{BigNumber(item.voteAmount).toFormat()}</h3>
      )}
    </div>
  );
}
