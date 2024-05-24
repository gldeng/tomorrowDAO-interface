import DAOListItem from 'components/DAOListItem';
import Link from 'next/link';
import { useInfiniteScroll } from 'ahooks';
import DownIcon from 'assets/imgs/down.svg';
import { LoadingOutlined } from '@ant-design/icons';
import { Empty, Spin } from 'antd';
import { fetchDaoList } from 'api/request';
import { SkeletonList } from 'components/Skeleton';
import { curChain } from 'config';

import './index.css';

export default function DAOList() {
  const fetchDaoInner = async (data: { list: IDaoItem[] } | undefined) => {
    const res = await fetchDaoList({
      skipCount: data?.list?.length ?? 0,
      maxResultCount: 6,
      chainId: curChain,
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
      ) : data?.list ? (
        <div className="dao-list-container">
          {data?.list?.map((item) => {
            return (
              <Link
                key={item.daoId}
                href={
                  item.isNetworkDAO
                    ? `/network-dao/${item.daoId}/proposal-list`
                    : `/dao/${item.daoId}`
                }
              >
                <DAOListItem item={item} />
              </Link>
            );
          })}
        </div>
      ) : (
        <Empty description="No results found" className="mb-[30px]" />
      )}
      <div className="dao-more">
        <div className="more-button" onClick={loadMore}>
          {loadingMore ? (
            <Spin indicator={<LoadingOutlined />} />
          ) : (
            <>
              <span className="more-text">Load More</span>
              <img className="down-icon" src={DownIcon} alt="down" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
