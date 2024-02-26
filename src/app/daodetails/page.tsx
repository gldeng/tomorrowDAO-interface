'use client';

import { useCallback, useState } from 'react';
import {
  Tabs,
  Typography,
  FontWeightEnum,
  Button,
  Pagination,
  IPaginationProps,
} from 'aelf-design';
import { Form } from 'antd';
import useResponsive from 'hooks/useResponsive';
import ProposalsItem from './components/ProposalsItem';
import HighCounCilTab from './components/HighCouncilTab';
import DaoInfo from './components/DaoInfo';
import ExecutdProposals from './components/ExecutdProposals';
import MyRecords from './components/MyRecords';
import MyInfo from './components/MyInfo';
import Filter from './components/filter';
import './page.css';

import { mokeData as data, list } from './moke';

interface ITableParams {
  pagination: IPaginationProps;
  governanceMechanism: string;
  proposalType: string;
  proposalStatus: string;
  content: string;
}

interface IHCParams {
  pagination: IPaginationProps;
  sorting: string;
  type: string; // Member/Candidate
  daoId: string;
  chainId: string; // AELF tDVV
}

export default function DeoDetails() {
  const { isSM } = useResponsive();

  // filter form
  const [form] = Form.useForm();

  const [tabKey, setTabKey] = useState('proposals');
  // const [tabKey, setTabKey] = useState('highCouncil');

  // proposal filter params
  const [tableParams, setTableParams] = useState<ITableParams>({
    governanceMechanism: '',
    proposalType: '',
    proposalStatus: '',
    content: '',
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
  });

  const [hcParams, setHcParams] = useState<IHCParams>({
    sorting: '',
    type: '',
    daoId: '',
    chainId: '', // AELF tDVV
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
  });

  const handleSearch = useCallback(
    (initParams: any) => {
      const values = form.getFieldsValue();
      console.log(values);
      // params
      const params = {
        ...initParams,
        ...values,
        skipCount: tableParams.pagination.current,
        maxResultCount: tableParams.pagination.pageSize,
      };
      console.log(params);
    },
    [form, tableParams.pagination],
  );

  const pageChange = useCallback(
    (page: number) => {
      const pagination = {
        ...tableParams.pagination,
        current: page,
      };
      setTableParams((state) => {
        return {
          ...state,
          pagination,
        };
      });
      handleSearch({ ...pagination });
    },
    [handleSearch, tableParams],
  );

  const pageSizeChange = useCallback(
    (page: number, pageSize: number) => {
      const pagination = {
        ...tableParams.pagination,
        current: page,
        pageSize,
      };
      setTableParams((state) => {
        return {
          ...state,
          pagination,
        };
      });
      handleSearch({ ...pagination });
    },
    [handleSearch, tableParams],
  );

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
            <Filter form={form} onSearch={handleSearch} />
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

  const handleTabChange = (key: string) => {
    setTabKey(key);
  };

  const handleChangeHCparams = useCallback((type: string) => {
    setHcParams((state) => {
      return {
        ...state,
        type,
      };
    });
  }, []);

  return (
    <div className="dao-detail">
      <DaoInfo data={data} onChangeHCParams={handleChangeHCparams} />
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
          <MyInfo info={data} isLogin={true} />
          <ExecutdProposals />
          <MyRecords />
        </div>
      </div>
    </div>
  );
}
