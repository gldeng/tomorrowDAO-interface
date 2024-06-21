import { Typography, FontWeightEnum, Button, HashAddress } from 'aelf-design';
import Image from 'next/image';
import arrowRightIcon from 'assets/imgs/arrow-right.svg';
import Link from 'next/link';
import { RightOutlined } from '@aelf-design/icons';
import { fetchVoteHistory } from 'api/request';
import { useSelector } from 'react-redux';
import { useRequest } from 'ahooks';
import { curChain, explorer } from 'config';
import { EVoteOption } from 'types/vote';
import dayjs from 'dayjs';
import LinkNetworkDao from 'components/LinkNetworkDao';
import { useEffect } from 'react';
import { useWalletService } from 'hooks/useWallet';
import ViewMoreButton from 'components/ViewMoreButton';
import './index.css';
import NoData from '../NoData';

interface IProps {
  daoId: string;
  isNetworkDAO?: boolean;
}
export default function MyRecords(props: IProps) {
  const { daoId, isNetworkDAO } = props;
  const { walletInfo } = useSelector((store: any) => store.userInfo);
  const { isLogin } = useWalletService();
  const {
    data: voteHistoryData,
    run,
    // error: voteHistoryError,
    loading: voteHistoryLoading,
  } = useRequest(
    () => {
      return fetchVoteHistory({
        address: walletInfo.address,
        chainId: curChain,
        skipCount: 0,
        maxResultCount: 10,
        daoId,
      });
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    if (isLogin) {
      run();
    }
  }, [isLogin]);

  // const statusCom = (text: keyof IStatus, size = 500) => {
  //   return (
  //     <span
  //       style={{
  //         color: colorMap[text],
  //         fontWeight: size,
  //       }}
  //     >
  //       {text}
  //     </span>
  //   );
  // };

  return (
    <div className="border border-Neutral-Divider border-solid rounded-lg bg-white mb-4 lg:my-4">
      <div className="px-4 lg:px-8 py-6 ">
        <div className="flex justify-between">
          <h3 className="dao-title mb-[24px]">My Votes</h3>
          {voteHistoryData?.data?.items?.length ? (
            <div className="records-header-morebtn">
              {isNetworkDAO ? (
                <LinkNetworkDao href={`/my-votes`}>
                  <ViewMoreButton />
                </LinkNetworkDao>
              ) : (
                <Link href={`/my-votes?daoId=${daoId}`}>
                  <ViewMoreButton />
                </Link>
              )}
            </div>
          ) : null}
        </div>
        {(voteHistoryData?.data?.items?.length === 0 || voteHistoryLoading) && <NoData />}
        <div className="dao-my-record">
          {voteHistoryData?.data?.items?.map((item, i) => {
            return (
              <div className="dao-my-record-item" key={item.transactionId}>
                <div>
                  <span className="time">
                    {dayjs(item.timeStamp).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </div>
                <div className="dao-my-record-item-content">
                  <div className="dao-my-record-item-title">
                    <Link href={`/proposal/${item.proposalId}`}>
                      <span className="title-text">{item.proposalTitle}</span>
                    </Link>
                  </div>
                  <div>
                    <span className={`vote-${item.myOption}`}>{EVoteOption[item.myOption]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
