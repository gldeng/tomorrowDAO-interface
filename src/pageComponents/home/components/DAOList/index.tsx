import DAOListItem from 'components/DAOListItem';
import Link from 'next/link';
import { useInfiniteScroll } from 'ahooks';
import DownIcon from 'assets/imgs/down.svg';
import { LoadingOutlined } from '@ant-design/icons';
import { Empty, Spin } from 'antd';
import { store } from 'redux/store';
import './index.css';
import { fetchDaoList } from 'api/request';
import { SkeletonList } from 'components/Skeleton';

export default function DAOList() {
  const info = store.getState().elfInfo.elfInfo;
  const fetchDaoInner = async (data: { list: IDaoItem[] } | undefined) => {
    const res = await fetchDaoList({
      skipCount: data?.list?.length ?? 0,
      maxResultCount: 6,
      chainId: info.curChain,
    });
    return {
      list: res.data.items,
    };
  };
  const { data, loading, loadMore, loadingMore } = useInfiniteScroll(fetchDaoInner);
  return (
    <div className="dao-list">
      {loading ? (
        <SkeletonList />
      ) : (
        <div className="dao-list-container">
          {data?.list ? (
            data?.list?.map((item) => {
              return (
                <Link key={item.daoId} href={`/dao/${item.daoId}`}>
                  <DAOListItem item={item} />
                </Link>
              );
            })
          ) : (
            <Empty />
          )}
        </div>
      )}

      <div className="dao-more">
        <div className="more-button" onClick={loadMore}>
          {loadingMore ? (
            <Spin indicator={<LoadingOutlined spin rev={undefined} />} />
          ) : (
            <>
              <span className="more-text">View More</span>
              <img className="down-icon" src={DownIcon} alt="down" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
