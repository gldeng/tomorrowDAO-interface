import { CheckCircleOutlined } from '@aelf-design/icons';
import './index.css';
import Empty from '../Empty';
import { fetchRankingVoteLists } from 'api/request';
import { useRequest } from 'ahooks';
import { curChain } from 'config';

export default function MyPoints() {
  const {
    data: voteList,
    error: voteListError,
    loading: voteListLoading,
  } = useRequest(async () => {
    return fetchRankingVoteLists({ chainId: curChain, skipCount: 0, maxResultCount: 1000 });
  });
  return (
    <div className="my-point-wrap">
      <div className="header">
        <h3 className="font-18-22-weight">My Points</h3>
        <p className="font-14-18">
          Total earned: <span className="amount">1,000,000</span>
        </p>
      </div>
      <ul className="point-list">
        <li className="point-list-item">
          <div className="wrap1 truncate">
            <CheckCircleOutlined />
            <div className="body truncate">
              <h3 className="font-17-22 truncate">Voted for: Catizen</h3>
              <p className="font-15-20 truncate">Event Name</p>
            </div>
          </div>
          <p className="amount font-18-22-weight">10,000</p>
        </li>
      </ul>
      <Empty
        style={{
          // eslint-disable-next-line no-inline-styles/no-inline-styles
          height: 514,
        }}
        imageUrl="/images/tg/empty-points.png"
        title="No Points Yet"
        description="You haven’t voted yet. Start voting to earn points and unlock rewards!"
      />
    </div>
  );
}
