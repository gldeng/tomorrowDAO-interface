import DAOListItem from 'components/DAOListItem';
import Link from 'next/link';
import { useInfiniteScroll } from 'ahooks';
import { Empty } from 'antd';
import { fetchDaoList } from 'api/request';
import { SkeletonList } from 'components/Skeleton';
import { curChain } from 'config';

import './index.css';
import LoadMoreButton from 'components/LoadMoreButton';
import { useEffect, useState } from 'react';
import { set } from 'js-cookie';

interface IFetchResult {
  list: IDaoItem[];
  hasData: boolean;
}
interface IDAOListProps {
  ssrData: {
    daoList: IDaoItem[];
    daoHasData: boolean;
  };
}
export default function DAOList(props: IDAOListProps) {
  const { ssrData } = props;
  const { daoList, daoHasData } = ssrData;
  const [renderList, setRenderList] = useState<IDaoItem[]>(daoList);
  const [hasData, setHasData] = useState(daoHasData);
  const [loading, setLoading] = useState(false);
  const loadMore = async () => {
    setLoading(true);
    const res = await fetchDaoList({
      skipCount: renderList.length,
      maxResultCount: 6,
      chainId: curChain,
    });
    setRenderList([...renderList, ...res.data.items]);
    setHasData(renderList.length + res.data.items.length < res.data.totalCount);
    setLoading(false);
  };
  useEffect(() => {
    console.log('ssr daoList', ssrData);
  }, []);
  return (
    <div className="dao-list">
      {renderList ? (
        <div className="dao-list-container">
          {renderList?.map((item) => {
            return (
              <Link
                key={item.daoId}
                href={item.isNetworkDAO ? `/network-dao` : `/dao/${item.alias}`}
                prefetch={true}
              >
                <DAOListItem item={item} />
              </Link>
            );
          })}
        </div>
      ) : (
        <Empty description="No results found" className="mb-[30px]" />
      )}
      {hasData && (
        <div className="dao-more">
          <LoadMoreButton onClick={loadMore} loadingMore={loading} />
        </div>
      )}
    </div>
  );
}
