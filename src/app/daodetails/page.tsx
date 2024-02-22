'use client';

import { Descriptions } from 'antd';
import { useState } from 'react';
import { Select, Space } from 'antd';
import {
  HashAddress,
  Tabs,
  Typography,
  FontWeightEnum,
  Button,
  Search,
  Pagination,
  IPaginationProps,
} from 'aelf-design';
import useResponsive from 'hooks/useResponsive';

import ProposalsItem from './components/ProposalsItem';
import HighCounCilTab from './components/HighCouncilTab';
import DaoInfo from './components/DaoInfo';
import ExecutdProposals from './components/ExecutdProposals';
import MyRecords from './components/MyRecords';
import './page.css';

import { mokeData as data, list } from './moke';

interface ITableParams {
  pagination: IPaginationProps;
}

export default function DeoDetails() {
  const { isSM } = useResponsive();

  const [tabKey, setTabKey] = useState('proposals');
  // const [tabKey, setTabKey] = useState('highCouncil');

  const tabItems = [
    {
      key: 'proposals',
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
          <div className="flex justify-between">
            <Space wrap>
              <Select
                defaultValue="ALL"
                className="tab-all-proposals-select"
                options={[
                  { value: 'ALL', label: 'ALL' },
                  { value: 'Governance', label: 'Governance' },
                  { value: 'Advisory', label: 'Advisory' },
                ]}
              />
              <Select
                defaultValue="ALL"
                className="tab-all-proposals-select"
                options={[
                  { value: 'lucy', label: 'ALL' },
                  { value: 'Parliament', label: 'Parliament' },
                  { value: 'Association ', label: 'Association ' },
                  { value: 'Referendum ', label: 'Referendum ' },
                  { value: 'Customer ', label: 'Customer ' },
                ]}
              />
              <Select
                defaultValue="ALL"
                className="tab-all-proposals-select"
                options={[
                  { value: 'ALL', label: 'ALL' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Approved', label: 'Approved' },
                  { value: 'Rejected', label: 'Rejected' },
                  { value: 'Abstained', label: 'Abstained' },
                ]}
              />
            </Space>
            <Search className="w-[400px]" placeholder="Proposals Title / Description / ID" />
          </div>
        </div>
      ),
    },
    {
      key: 'highCouncil',
      label: 'High Council',
      children: <HighCounCilTab />,
    },
  ];

  const myInfoItems = [
    {
      key: '0',
      label: '',
      children: <HashAddress preLen={8} endLen={11} address={data.creator}></HashAddress>,
    },
    {
      key: '1',
      label: 'ELF Balance',
      children: <div className="w-full text-right">-</div>,
    },
    {
      key: '2',
      label: 'Staked ELF',
      children: <div className="w-full text-right">-</div>,
    },
    {
      key: '3',
      label: 'Voted',
      children: <div className="w-full text-right">-</div>,
    },
  ];

  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 103,
    },
  });

  const pageChange = (page: number) => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        current: page,
      },
    });
  };

  const pageSizeChange = (page: number, pageSize: number) => {
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        current: page,
        pageSize: pageSize,
      },
    });
  };

  const handleTabChange = (key: string) => {
    setTabKey(key);
  };

  return (
    <div className="dao-detail">
      <DaoInfo data={data} />
      <div className="dao-detail-content">
        <div className="dao-detail-content-left">
          <div className="dao-detail-content-left-tab">
            <Tabs defaultActiveKey={tabKey} items={tabItems} onChange={handleTabChange} />
          </div>
          {tabKey === 'proposals' && (
            <div>
              {list.items &&
                list.items.map((item) => <ProposalsItem key={item.proposalId} data={item} />)}
              <Pagination
                {...tableParams.pagination}
                pageChange={pageChange}
                pageSizeChange={pageSizeChange}
              />
            </div>
          )}
        </div>
        <div className="dao-detail-content-right">
          <div className="dao-detail-content-right-info">
            <Descriptions colon={false} title="My Info" items={myInfoItems} column={1} />
          </div>
          <ExecutdProposals />
          <MyRecords />
        </div>
      </div>
    </div>
  );
}
