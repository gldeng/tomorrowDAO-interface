'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Tabs, Typography, FontWeightEnum, Button, Pagination } from 'aelf-design';
import { Form } from 'antd';
import useResponsive from 'hooks/useResponsive';
import ProposalsItem from './components/ProposalsItem';
import HighCounCilTab from './components/HighCouncilTab';
import DaoInfo from './components/DaoInfo';
import ExecutdProposals from './components/ExecutdProposals';
import MyRecords from './components/MyRecords';
import MyInfo from './components/MyInfo';
import Filter from './components/filter';
import { useSearchParams } from 'next/navigation';
// import { useSearchParams } from 'next/router';
import {
  HCType,
  IProposalTableParams,
  TabKey,
  ProposalType,
  ProposalStatus,
  IDaoDetail,
  IProposalsItem,
} from './type';

import './page.css';

import { mokeData as data, list } from './moke';

export default function DeoDetails() {
  const { isLG, isSM } = useResponsive();
  const params = useSearchParams();
  const id = params.get('id');

  const [form] = Form.useForm();
  const [tabKey, setTabKey] = useState(TabKey.PROPOSALS);
  const [hcType, setHcType] = useState(HCType.MEMBER);

  const [daoDetail, setDaoDetail] = useState<IDaoDetail>(data);
  const [proposalList, setProposalList] = useState<IProposalsItem[]>(list);

  const [tableParams, setTableParams] = useState<IProposalTableParams>({
    proposalType: ProposalType.ALL,
    proposalStatus: ProposalStatus.ALL,
    content: '',
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
  });

  const fetchData = useCallback(() => {
    const { proposalType, proposalStatus } = tableParams;
    // params
    const params = {
      proposalType,
      proposalStatus,
      daoId: data.daoId,
      chainId: data.chainId,
      skipCount: tableParams.pagination.current,
      maxResultCount: tableParams.pagination.pageSize,
    };
    console.log('search', params);
    setProposalList(list);
  }, [tableParams]);

  const rightContent = useMemo(() => {
    return (
      <>
        <MyInfo isLogin={true}></MyInfo>
      </>
    );
  }, []);

  const tabItems = useMemo(() => {
    const items = [
      {
        key: TabKey.PROPOSALS,
        label: 'All Proposals',
        children: (
          <div className="tab-all-proposals">
            <div className="tab-all-proposals-header">
              <Typography.Title fontWeight={FontWeightEnum.Medium} level={6}>
                Proposals
              </Typography.Title>
              <Button size="medium" type="primary">
                Deploy
              </Button>
            </div>
            <Filter form={form} tableParams={tableParams} onChangeTableParams={setTableParams} />
          </div>
        ),
      },
      {
        key: TabKey.HC,
        label: 'High Council',
        children: <HighCounCilTab hcType={hcType} onChangeHcType={setHcType} />,
      },
    ];
    if (!isLG) {
      return items;
    } else {
      return [
        ...items,
        {
          key: TabKey.MYINFO,
          label: 'My Info',
          children: rightContent,
        },
      ];
    }
  }, [form, tableParams, hcType, isLG, rightContent]);

  const pageChange = useCallback((page: number) => {
    setTableParams((state) => {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          current: page,
        },
      };
    });
  }, []);

  const pageSizeChange = useCallback((page: number, pageSize: number) => {
    setTableParams((state) => {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          current: page,
          pageSize,
        },
      };
    });
  }, []);

  const handleTabChange = (key: string) => {
    setTabKey(key as TabKey);
  };

  const handleChangeHCparams = useCallback((type: HCType) => {
    setHcType(type);
    console.log('click type', type);
    setTabKey(TabKey.HC);
  }, []);

  const tabCom = useMemo(() => {
    return (
      <Tabs
        size={isLG ? 'small' : 'middle'}
        activeKey={tabKey}
        items={tabItems}
        onChange={handleTabChange}
      />
    );
  }, [isLG, tabItems, tabKey]);

  const getDaoDetail = async () => {
    await new Promise((resolve) => {
      resolve('aaa');
    });
    setDaoDetail(data);
  };

  useEffect(() => {
    getDaoDetail();
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="dao-detail">
      <div className="max-w-[1360px] mx-auto ">
        <DaoInfo data={daoDetail} onChangeHCParams={handleChangeHCparams} />
        <div className="dao-detail-content">
          <div className={` ${isSM ? 'w-full' : 'dao-detail-content-left'}`}>
            <div className="dao-detail-content-left-tab">{tabCom}</div>
            {tabKey === TabKey.PROPOSALS && (
              <div>
                {proposalList.map((item) => (
                  <ProposalsItem key={item.proposalId} data={item} />
                ))}
                <Pagination
                  {...tableParams.pagination}
                  pageChange={pageChange}
                  pageSizeChange={pageSizeChange}
                />
              </div>
            )}
            {isLG && tabKey === TabKey.MYINFO && (
              <>
                <ExecutdProposals />
                <MyRecords />
              </>
            )}
          </div>

          {!isLG && (
            <div className="dao-detail-content-right">
              {rightContent}
              <ExecutdProposals />
              <MyRecords />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
