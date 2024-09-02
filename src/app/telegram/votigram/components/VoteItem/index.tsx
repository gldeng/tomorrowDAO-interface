import { RightOutlined } from '@aelf-design/icons';
import Percent from './Percent';
import BigNumber from 'bignumber.js';
import { useEffect, useRef } from 'react';

import './index.css';
interface IVoteItemProps {
  index: number;
  canVote: boolean;
  onVote?: (item: IRankingListResItem) => void;
  onShowMore?: (item: IRankingListResItem) => void;
  item: IRankingListResItem;
}
const increseIconDomCreate = (top: number, right: number) => {
  const div = document.createElement('div');
  div.className = 'increment-icon';
  div.innerText = '+1';
  div.style.top = `${top + 4}px`;
  div.style.right = `${right + 4}px`;
  return div;
};
const rankIndex = [0, 1, 2];
export default function VoteItem(props: IVoteItemProps) {
  const { index, onVote, item, canVote, onShowMore } = props;
  const isRankIcon = rankIndex.includes(index);
  const domRef = useRef<HTMLDivElement>(null);
  const increseDomRef = useRef<HTMLImageElement>(null);

  const handleIncrese = () => {
    if (increseDomRef.current) {
      const rect = increseDomRef.current.getBoundingClientRect();
      const { top, right } = rect;
      const div = increseIconDomCreate(top, window.innerWidth - rect.right);
      document.body.appendChild(div);
      setTimeout(() => {
        document.body.removeChild(div);
      }, 1100);
    }
  };
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
              {/* <p dangerouslySetInnerHTML={{ __html: item.description }}></p> */}
              <p
                className="desc sub-title-text truncate"
                onClick={() => {
                  onShowMore?.(item);
                }}
              >
                Show details
                <RightOutlined />
              </p>
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
          <div className="vote-amount-wrap">
            <h3 className="vote-amount font-14-18">{BigNumber(item.voteAmount).toFormat()}</h3>
            <img
              src="/images/tg/gold-coin.png"
              className="vote-amount-increse"
              alt=""
              ref={increseDomRef}
              onClick={handleIncrese}
            />
          </div>
        )}
      </div>
      {!canVote && <Percent percent={item.votePercent} />}
    </div>
  );
}
