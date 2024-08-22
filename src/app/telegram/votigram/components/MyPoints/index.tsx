import { CheckCircleOutlined } from '@aelf-design/icons';
import { useWebLogin } from 'aelf-web-login';
import Empty from '../Empty';
import { fetchVoteHistory } from 'api/request';
import { useInfiniteScroll, useRequest } from 'ahooks';
import { curChain } from 'config';
import { useEffect, useMemo } from 'react';
import Refresh from '../Refresh';
import './index.css';
import BigNumber from 'bignumber.js';
import Loading from '../Loading';

const MaxResultCount = 5;
interface IFetchResult {
  list: IVoteHistoryItem[];
  hasData: boolean;
  totalPoints: number;
}
export default function MyPoints() {
  const { wallet } = useWebLogin();
  const fetchVoteList: (data?: IFetchResult) => Promise<IFetchResult> = async (data) => {
    const preList = data?.list ?? [];
    const res = await fetchVoteHistory({
      address: wallet.address,
      chainId: curChain,
      skipCount: preList.length,
      maxResultCount: MaxResultCount,
      source: 'Telegram',
    });
    const currentList = res?.data?.items ?? [];
    const len = currentList.length + preList.length;
    return {
      list: currentList,
      totalPoints: res?.data?.totalPoints ?? 0,
      hasData: len < res.data?.totalCount,
    };
  };
  const {
    data: voteListData,
    loadingMore: voteListLoadingMore,
    loadMore: voteListLoadMore,
    loading: voteListLoading,
    reload: voteListReload,
  } = useInfiniteScroll(fetchVoteList, { manual: true });
  useEffect(() => {
    if (wallet.address) {
      voteListReload();
    }
  }, [wallet.address]);
  const totlePoints = useMemo(() => {
    return BigNumber(voteListData?.totalPoints ?? 0).toFormat();
  }, [voteListData?.totalPoints]);
  return (
    <div className="my-point-wrap">
      <div className="header">
        <h3 className="font-18-22-weight">My Points</h3>
        <p className="font-14-18">
          Total earned: <span className="amount">{totlePoints}</span>
        </p>
      </div>
      {voteListLoading ? (
        <div className="votigram-loading-wrap">
          <Loading />
        </div>
      ) : (
        <>
          {voteListData?.list?.length && (
            <ul className="point-list">
              {voteListData?.list.map((item, i) => {
                return (
                  <li className="point-list-item" key={i}>
                    <div className="wrap1 truncate">
                      <CheckCircleOutlined />
                      <div className="body truncate">
                        <h3 className="font-17-22 truncate">Voted for: {item.voteFor}</h3>
                        <p className="font-15-20 truncate">{item.proposalTitle}</p>
                      </div>
                    </div>
                    <p className="amount font-18-22-weight">
                      {BigNumber(item?.points ?? 0).toFormat()}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {voteListData?.hasData && (
        <div className="show-more-button-wrap">
          <div className="show-more-button-wrap-button" onClick={voteListLoadMore}>
            <Refresh isLoading={voteListLoadingMore} />
            <span className="font-17-22 font-[590]">Show more</span>
          </div>
        </div>
      )}

      {voteListData?.list?.length === 0 && (
        <Empty
          style={{
            // eslint-disable-next-line no-inline-styles/no-inline-styles
            height: 514,
          }}
          imageUrl="/images/tg/empty-points.png"
          title="No Points Yet"
          description="You haven’t voted yet. Start voting to earn points and unlock rewards!"
        />
      )}
    </div>
  );
}
