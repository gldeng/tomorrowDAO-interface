import Percent from './Percent';
import BigNumber from 'bignumber.js';
import { useEffect, useRef } from 'react';

import './index.css';
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
  const domRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTimeout(() => {
      const dom = domRef.current;
      if (dom) {
        console.log(dom.clientWidth);
        dom.clientWidth;
      }
    }, 200);
  }, []);
  return (
    <div className="telegram-vote-item">
      <div className="telegram-vote-item-wrap" ref={domRef}>
        <div className="telegram-vote-item-content truncate">
          <div className={`rank-index-wrap ${isRankIcon ? 'rank-icon' : 'rank-not-icon'}`}>
            {isRankIcon ? (
              <img
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
            <img
              src={item.icon}
              alt="rank-icon"
              width={44}
              height={44}
              className="vote-item-icon"
            />
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
      {!canVote && <Percent percent={item.votePercent} />}
    </div>
  );
}
