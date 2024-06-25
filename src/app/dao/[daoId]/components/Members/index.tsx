import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'antd';
import { useWebLogin } from 'aelf-web-login';
import { curChain, explorer } from 'config';
import { fetchDaoMembers } from 'api/request';
import { useRequest } from 'ahooks';
import { SkeletonLine } from 'components/Skeleton';
import { Button, HashAddress } from 'aelf-design';
import { EDaoGovernanceMechanism } from 'app/(createADao)/create/type';
import Link from 'next/link';
import './index.css';

interface IProps {
  daoData: IDaoInfoData;
}
const LoadCount = 5;

const DaoMembers: React.FC<IProps> = (props) => {
  const { daoData } = props;

  const {
    data: daoMembersData,
    // error: transferListError,
    loading: daoMembersDataLoading,
    run,
  } = useRequest(
    () => {
      return fetchDaoMembers({
        SkipCount: 0,
        MaxResultCount: 6,
        ChainId: curChain,
        DAOId: daoData?.id,
      });
    },
    {
      manual: true,
    },
  );
  const { wallet } = useWebLogin();
  useEffect(() => {
    run();
  }, []);
  return (
    <div className={'card'}>
      {daoMembersDataLoading ? (
        <SkeletonLine />
      ) : (
        <div>
          <h3 className="card-title mb-[24px]">Members</h3>
          <div className="flex justify-between items-center lg:flex-row flex-col mb-[24px]">
            <p>
              <h2 className="card-title-lg mb-[4px]">{daoMembersData?.data?.totalCount} Members</h2>
              <span className="dao-members-nor-text text-Neutral-Secondary-Text">
                {daoData?.governanceMechanism === EDaoGovernanceMechanism.Token
                  ? 'Token-based'
                  : 'Wallet-bsed'}
              </span>
            </p>
            <Button type="primary" size="medium" className="dao-members-manage">
              Manage members
            </Button>
          </div>
          <ul className="dao-members-wrap">
            {daoMembersData?.data.data.map((item) => {
              return (
                <Link
                  key={item.address}
                  href={`${explorer}/address/${item.address}`}
                  target="_blank"
                >
                  <li className="dao-members-item">
                    <HashAddress
                      className="dao-members-nor-text"
                      preLen={8}
                      endLen={11}
                      address={item.address}
                      chain={curChain}
                    ></HashAddress>
                  </li>
                </Link>
              );
            })}
          </ul>
          <div className="flex justify-center mt-[20px]">
            {daoMembersData?.data?.totalCount && daoMembersData?.data?.totalCount > 5 && (
              <Link href={`${daoData.id}/members`}>
                <Button size="medium" className="dao-members-manage">
                  <span className="dao-members-nor-text font-medium">Load More</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DaoMembers;
