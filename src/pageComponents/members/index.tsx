'use client';
import React from 'react';
import { HashAddress, Pagination, IPaginationProps } from 'aelf-design';
import { curChain, explorer } from 'config';
import { Button } from 'aelf-design';
import Link from 'next/link';
import useResponsive from 'hooks/useResponsive';
import './index.css';
import { SkeletonLine } from 'components/Skeleton';
import { ButtonCheckLogin } from 'components/ButtonCheckLogin';

interface ITreasuryDetailsProps {
  isLoading: boolean;
  totalCount: number;
  lists: string[];
  pagination: IPaginationProps;
  managerUrl?: string;
  onManageMembers?: () => void;
  manageLoading?: boolean;
}
export default function TreasuryDetails(props: ITreasuryDetailsProps) {
  const { isLoading, managerUrl, totalCount, lists, pagination, onManageMembers, manageLoading } =
    props;
  const { isLG } = useResponsive();
  const mobileProps = isLG
    ? {
        preLen: 8,
        endLen: 9,
      }
    : {};
  return (
    <>
      <div className="page-content-bg-border flex justify-between mb-[24px] lg:flex-row flex-col">
        <h2 className="card-title-lg mb-[4px]">{totalCount} Members</h2>
        {managerUrl ? (
          <Link href={managerUrl} className="lg:mt-0 mt-[24px]">
            <ButtonCheckLogin type="primary" size="medium">
              Manage members
            </ButtonCheckLogin>
          </Link>
        ) : (
          <ButtonCheckLogin
            type="primary"
            size="medium"
            onClick={onManageMembers}
            loading={manageLoading}
          >
            Manage members
          </ButtonCheckLogin>
        )}
      </div>
      <div className="page-content-bg-border px-0 py-0 members-lists">
        <h3 className="table-title-text py-[24px] members-padding">Address</h3>
        <ul>
          {isLoading ? (
            <div className="members-padding">
              <SkeletonLine />
            </div>
          ) : (
            lists.map((item, index) => {
              return (
                <li key={item} className="members-lists-item members-padding">
                  <Link href={`${explorer}/address/${item}`} target="_blank">
                    <HashAddress
                      className="TMRWDAO-members-hash-address "
                      address={item}
                      {...mobileProps}
                      chain={curChain}
                    />
                  </Link>
                </li>
              );
            })
          )}

          <div className="members-padding py-[24px]">
            <Pagination {...pagination}></Pagination>
          </div>
        </ul>
      </div>
    </>
  );
}
