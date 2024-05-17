'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, Typography, FontWeightEnum, Button, Pagination } from 'aelf-design';
import { Form, message, Empty } from 'antd';
import { useSelector } from 'react-redux';
import { SkeletonList } from 'components/Skeleton';
import useResponsive from 'hooks/useResponsive';
import ProposalsItem from './components/ProposalsItem';
import HighCounCilTable from './components/HighCouncilTable';
import DaoInfo from './components/DaoInfo';
import ExecutdProposals from './components/ExecutdProposals';
import MyRecords from './components/MyRecords';
import MyInfo from './components/MyInfo';
import Filter from './components/Filter';
import { useRequest, usePrevious } from 'ahooks';
import { IProposalTableParams, TabKey } from './type';
import LinkReplaceLastPathName from 'components/LinkReplaceLastPathName';
import { fetchDaoInfo, fetchProposalList } from 'api/request';
import { curChain } from 'config';
import './page.css';
import { ALL, NetWorkDaoCreateProposal } from './constants';
import Link from 'next/link';

interface IProps {
  daoId: string;
  isNetworkDAO?: boolean;
}
export default function DeoDetails(props: IProps) {
  const { daoId, isNetworkDAO } = props;
  const { isLG } = useResponsive();

  const [form] = Form.useForm();
  // todo
  const [tabKey, setTabKey] = useState(TabKey.PROPOSALS);

  const {
    data: daoData,
    error: daoError,
    loading: daoLoading,
  } = useRequest(async () => {
    if (!daoId) {
      message.error('daoId is required');
      return null;
    }
    return fetchDaoInfo({ daoId, chainId: curChain });
  });
  const { walletInfo } = useSelector((store: any) => store.userInfo);
  // const [daoDetail, setDaoDetail] = useState<IDaoDetail>(data);
  // const [proposalList, setProposalList] = useState<IProposalsItem[]>(list);

  const [tableParams, setTableParams] = useState<IProposalTableParams>({
    content: '',
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
  });
  const previousTableParams = usePrevious(tableParams);
  const fetchProposalListWithParams = async (preData: IProposalListRes | null) => {
    const { proposalType, proposalStatus } = tableParams;
    const params: IProposalListReq = {
      daoId: daoId,
      chainId: curChain,
      skipCount:
        ((tableParams.pagination.current ?? 1) - 1) * (tableParams.pagination.pageSize ?? 20),
      maxResultCount: tableParams.pagination.pageSize,
      isNetworkDAO,
    };
    // skip ALL
    if (proposalType !== ALL && proposalType) {
      params.proposalType = proposalType;
    }
    // skip ALL
    if (proposalStatus !== ALL && proposalStatus) {
      params.proposalStatus = proposalStatus;
    }
    // search content
    if (tableParams.content) {
      params.content = tableParams.content;
    }
    // when pagesize change pagination.current will be 1
    if (tableParams.pagination.current !== 1 && preData?.data) {
      const prePageNo = previousTableParams?.pagination.current;
      const currentPageNo = tableParams.pagination.current;
      if (
        typeof prePageNo === 'number' &&
        typeof currentPageNo === 'number' &&
        prePageNo > currentPageNo
      ) {
        params.pageInfo = {
          ...(preData.data.previousPageInfo ?? {}),
        };
      } else {
        params.pageInfo = {
          ...(preData.data.nextPageInfo ?? {}),
        };
      }
    }
    const listRes = await fetchProposalList(params);
    return listRes;
  };
  const {
    data: proposalData,
    error: proposalError,
    loading: proposalLoading,
    run,
  } = useRequest(fetchProposalListWithParams, {
    manual: true,
  });
  const previousProposalDataRef = useRef<IProposalListRes | undefined>();
  previousProposalDataRef.current = proposalData;

  const rightContent = useMemo(() => {
    return <MyInfo daoId={daoId} />;
  }, [daoId]);

  const tabItems = useMemo(() => {
    const CreateButton = (
      <Button size="medium" type="primary">
        Create a Proposal
      </Button>
    );
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
              {isNetworkDAO ? (
                <LinkReplaceLastPathName href={`/proposal-deploy`}>
                  {CreateButton}
                </LinkReplaceLastPathName>
              ) : (
                <Link href={`/proposal/deploy/${daoId}`}>{CreateButton}</Link>
              )}
            </div>
            <Filter form={form} tableParams={tableParams} onChangeTableParams={setTableParams} />
          </div>
        ),
      },
    ];
    if (daoData?.data.isNetworkDAO) {
      items.push({
        key: TabKey.HC,
        label: 'High Council',
        children: <HighCounCilTable />,
      });
    }
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
  }, [isNetworkDAO, daoId, form, tableParams, daoData?.data.isNetworkDAO, isLG, rightContent]);

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

  const handleChangeHCparams = useCallback(() => {
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

  useEffect(() => {
    run(previousProposalDataRef.current ?? null);
  }, [tableParams, run]);

  return (
    <div className="dao-detail">
      <div>
        <DaoInfo
          data={daoData?.data}
          isLoading={daoLoading}
          isError={daoError}
          onChangeHCParams={handleChangeHCparams}
        />

        <div className="dao-detail-content">
          <div className={`dao-detail-content-left`}>
            <div className="dao-detail-content-left-tab">{tabCom}</div>
            {tabKey === TabKey.PROPOSALS && (
              <div>
                {proposalLoading ? (
                  <SkeletonList />
                ) : proposalError ? (
                  <div>proposal error, refresh pleaase</div>
                ) : proposalData?.data?.items?.length ? (
                  proposalData?.data?.items?.map((item) => {
                    // tmrw
                    if (item.proposalSource === NetWorkDaoCreateProposal) {
                      if (isNetworkDAO) {
                        return (
                          <LinkReplaceLastPathName
                            key={item.proposalId}
                            href={`/proposal-detail-tmrw/${item.proposalId}`}
                          >
                            <ProposalsItem data={item} />
                          </LinkReplaceLastPathName>
                        );
                      }
                      return (
                        <Link key={item.proposalId} href={`/proposal/${item.proposalId}`}>
                          <ProposalsItem data={item} />
                        </Link>
                      );
                    }
                    return (
                      <LinkReplaceLastPathName
                        key={item.proposalId}
                        href={`/proposal-detail?proposalId=${item.proposalId}`}
                      >
                        <ProposalsItem data={item} />
                      </LinkReplaceLastPathName>
                    );
                  })
                ) : (
                  <Empty />
                )}
                <Pagination
                  {...tableParams.pagination}
                  total={proposalData?.data?.totalCount ?? 0}
                  pageChange={pageChange}
                  pageSizeChange={pageSizeChange}
                />
              </div>
            )}
            {/* < 1024 */}
            {isLG && tabKey === TabKey.MYINFO && (
              <>
                <ExecutdProposals />
                {walletInfo.address && <MyRecords daoId={daoId} isNetworkDAO={isNetworkDAO} />}
              </>
            )}
          </div>

          {!isLG && (
            <div className="dao-detail-content-right">
              {rightContent}
              <ExecutdProposals />
              {walletInfo.address && <MyRecords daoId={daoId} isNetworkDAO={isNetworkDAO} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
