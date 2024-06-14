'use client';
import React, { useEffect } from 'react';
import { Button } from 'aelf-design';
import { useInfiniteScroll } from 'ahooks';
import { fetchMyDaoList } from 'api/request';
import { curChain } from 'config';
import Link from 'next/link';
import { useWebLogin } from 'aelf-web-login';
import LoadMoreButton from 'components/LoadMoreButton';
import { SkeletonDaoItemList } from 'components/Skeleton';
import './index.css';
import { EMyDAOType } from 'types/dao';
import NoData from 'app/dao/[daoId]/components/NoData';

const MaxResultCount = 5;
interface IFetchResult {
  list: IMyDaoListDataItem[];
  hasData: boolean;
}
const MyDaosPage = () => {
  const { wallet, login } = useWebLogin();
  const fetchOwnDao: (data?: IFetchResult) => Promise<IFetchResult> = async (data) => {
    const preList = data?.list ?? [];
    const res = await fetchMyDaoList({
      Type: EMyDAOType.Owned,
      Address: wallet.address,
      ChainId: curChain,
      SkipCount: preList.length,
      MaxResultCount,
    });
    const currentList = res?.data?.[0]?.list ?? [];
    const len = currentList.length + preList.length;
    return {
      list: currentList,
      hasData: len < res.data[0].totalCount,
    };
  };
  const wrapConnectCheck = (cb: () => void) => {
    if (!wallet.address) {
      login();
      return;
    }
    cb();
  };
  const {
    data: ownData,
    loadingMore: ownLoadingMore,
    loadMore: ownLoadMore,
    loading: ownLoading,
    reload: ownReload,
  } = useInfiniteScroll(fetchOwnDao, { manual: true });
  const fetchParticipatedDao: (data?: IFetchResult) => Promise<IFetchResult> = async (data) => {
    const preList = data?.list ?? [];
    try {
      const res = await fetchMyDaoList({
        Type: EMyDAOType.Participated,
        Address: wallet.address,
        ChainId: curChain,
        SkipCount: preList.length,
        MaxResultCount,
      });
      const currentList = res?.data?.[0]?.list ?? [];
      const len = currentList.length + preList.length;
      return {
        list: res.data[0].list,
        hasData: len < res.data[0].totalCount,
      };
    } catch (error) {
      console.log(error);
      return {
        list: [],
        hasData: false,
      };
    }
  };
  const {
    data: participatedData,
    loadingMore: participatedLoadingMore,
    loadMore: participatedLoadMore,
    loading: participatedLoading,
    reload: participatedReload,
  } = useInfiniteScroll(fetchParticipatedDao, { manual: true });
  useEffect(() => {
    if (wallet.address) {
      ownReload();
      participatedReload();
    }
  }, [ownReload, participatedReload, wallet.address]);
  const EmptyNode = (
    <div className="flex flex-col items-center">
      <NoData></NoData>
      <Link href="/explore">
        <Button className="w-[152px] my-[14px]" size="medium">
          Explore
        </Button>
      </Link>
    </div>
  );
  return (
    <div className="my-daos">
      <div className="flex flex-col gap-[2rem]">
        <div className="flex items-center justify-between">
          <p className="text-Primary-Text text-[28px] leading-[36px]">My DAOs</p>
          <Link href="/guide">
            <Button type="primary" size="medium">
              Create a DAO
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-[0.75rem]">
          <p className="list-header">My own DAOs</p>
          <div className="list-body">
            {ownLoading ? (
              <SkeletonDaoItemList />
            ) : (
              <>
                <p className="sub-title">Name</p>
                <ul className="list-body-content">
                  {!ownData?.list.length && EmptyNode}
                  {ownData?.list.map((item) => {
                    return (
                      <Link
                        key={item.daoId}
                        href={
                          item.isNetworkDAO
                            ? `/network-dao/${item.daoId}/proposal-list`
                            : `/dao/${item.daoId}`
                        }
                      >
                        <li className="list-body-content-item" key={item.daoId}>
                          <img src={item.logo} alt="" />
                          <span className="text-Primary-Text">{item.name}</span>
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </>
            )}
            {ownData?.hasData && (
              <div className="loading-more-wrap">
                <LoadMoreButton
                  onClick={() => {
                    wrapConnectCheck(ownLoadMore);
                  }}
                  loadingMore={ownLoadingMore}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[0.75rem]">
          <p className="list-header">participated DAOs</p>
          <div className="list-body">
            {participatedLoading ? (
              <SkeletonDaoItemList />
            ) : (
              <>
                <p className="sub-title">Name</p>
                <ul className="list-body-content">
                  {!participatedData?.list.length && EmptyNode}
                  {participatedData?.list.map((item) => {
                    return (
                      <Link
                        key={item.daoId}
                        href={
                          item.isNetworkDAO
                            ? `/network-dao/${item.daoId}/proposal-list`
                            : `/dao/${item.daoId}`
                        }
                      >
                        <li className="list-body-content-item" key={item.daoId}>
                          <img src={item.logo} alt="" />
                          <span className="text-Primary-Text">{item.name}</span>
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </>
            )}
            {participatedData?.hasData && (
              <div className="loading-more-wrap">
                <LoadMoreButton
                  onClick={() => {
                    wrapConnectCheck(participatedLoadMore);
                  }}
                  loadingMore={participatedLoadingMore}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyDaosPage;
