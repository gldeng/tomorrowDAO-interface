import { useInfiniteScroll } from 'ahooks';
import { getDiscoverAppList } from 'api/request';
import { curChain } from 'config';
import { useEffect } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
import useInfiniteScrollUI from 'react-infinite-scroll-hook';
import Loading from '../../components/Loading';
import DiscoverItem from './DiscoverItem';

interface InfiniteListProps {
  category: string;
}
const MaxResultCount = 10;

interface IFetchResult {
  list: IDiscoverAppItem[];
  hasData: boolean;
}
export default function InfiniteList(props: InfiniteListProps) {
  const { category } = props;
  const fetchList: (data?: IFetchResult) => Promise<IFetchResult> = async (data) => {
    const preList = data?.list ?? [];
    const res = await getDiscoverAppList({
      category: category,
      chainId: curChain,
      skipCount: preList.length,
      maxResultCount: MaxResultCount,
    });
    const currentList = res?.data?.data ?? [];
    const len = currentList.length + preList.length;
    return {
      list: currentList,
      hasData: len < res.data?.totalCount,
    };
  };
  const {
    data: listData,
    loadingMore: listLoadingMore,
    loadMore: listLoadMore,
    loading: listLoading,
    reload: listReload,
    error,
  } = useInfiniteScroll(fetchList, { manual: true });
  const [sentryRef] = useInfiniteScrollUI({
    loading: listLoading,
    hasNextPage: Boolean(listData?.hasData),
    onLoadMore: listLoadMore,
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    disabled: !!error,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 400px 0px',
  });
  useEffect(() => {
    listReload();
  }, []);
  return (
    <div>
      {listData?.list.map((appItem, index) => (
        <DiscoverItem item={appItem} key={index} />
      ))}
      <div ref={sentryRef} />

      {(listLoading || listLoadingMore) && (
        <div className={`${listLoading ? 'init-loading-wrap' : ''} flex-center`}>
          <Loading />
        </div>
      )}
    </div>
  );
}
