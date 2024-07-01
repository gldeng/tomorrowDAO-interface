import DAOListItem from 'components/DAOListItem';
import Link from 'next/link';
import { useInfiniteScroll } from 'ahooks';
import { Empty } from 'antd';
import { fetchDaoList } from 'api/request';
import { SkeletonList } from 'components/Skeleton';
import { curChain } from 'config';

import './index.css';
import LoadMoreButton from 'components/LoadMoreButton';

interface IFetchResult {
  list: IDaoItem[];
  hasData: boolean;
}
export default function DAOList() {
  const fetchDaoInner: (data?: IFetchResult) => Promise<IFetchResult> = async (data) => {
    const preList = data?.list ?? [];
    const res = await fetchDaoList({
      skipCount: preList.length,
      maxResultCount: 6,
      chainId: curChain,
    });
    const currentList = res.data.items ?? [];
    const len = currentList.length + preList.length;
    return {
      list: res.data.items,
      hasData: len < res.data.totalCount,
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
                href={item.isNetworkDAO ? `/network-dao` : `/dao/${item.alias}`}
              >
                <DAOListItem item={item} />
              </Link>
            );
          })}
        </div>
      ) : (
        <Empty description="No results found" className="mb-[30px]" />
      )}
      {data?.hasData && (
        <div className="dao-more">
          <LoadMoreButton onClick={loadMore} loadingMore={loadingMore} />
        </div>
      )}
    </div>
  );
}
