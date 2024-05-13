import { useCallback, useEffect, useState } from 'react';
import { Table, IPaginationProps, Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import { ConfigProvider } from 'antd';
import { ColumnsType } from 'antd/es/table';
import type { TableProps } from 'antd';
import { HCType } from '../../type';

import NoData from '../NoData';
import './index.css';
import { callContract } from 'contract/callContract';
import { electionContractAddr } from 'config';
import { ContractMethodType, SupportedELFChainId } from 'types';

// const getAllTeamDesc = () =>
//   get("/vote/getAllTeamDesc", {
//     isActive: true,
//   });
//   async fetchElectorVote(currentWallet, electionContract) {
//     const { publicKey, address } = currentWallet;
//     if (!publicKey && !address) {
//       return null;
//     }
//     let res;
//     if (publicKey) {
//       res = await fetchElectorVoteWithRecords(electionContract, {
//         value: publicKey,
//       });
//     }
//     if (!res) {
//       res = await fetchElectorVoteWithRecords(electionContract, {
//         value: address,
//       });
//     }
//     return res || {};
// }
// export const fetchCurrentMinerPubkeyList = (contract) => contract.GetCurrentMinerPubkeyList.call();
export default function HighCounCilTab() {
  // const fetchCount = (contract, payload) => contract.GetCandidates.call(payload);
  // const fetchPageableCandidateInformation = (contract, payload) => contract.GetPageableCandidateInformation.call(payload);
  // const fetchCurrentRoundInformation = async () => {
  //   const { consensusContract } = this.props;
  //   const res = await consensusContract.GetCurrentRoundInformation.call();
  //   return res;
  // };
  // const {} = use
  const fetchTotal = async () => {
    const res = await callContract('GetCandidates', '', electionContractAddr, {
      chain: SupportedELFChainId.MAIN_NET,
      type: ContractMethodType.VIEW,
    });
    // const total = res?.value?.length || 0;
    // return total;
    console.log('res-?>>>>>', res);
    return 123;
  };
  const fetchAllCandidateInfo = async () => {
    const total = await fetchTotal();
    // let start = 0;
    // let result = [];
    // while (start <= total) {
    //   // eslint-disable-next-line no-await-in-loop
    //   const res = await fetchPageableCandidateInformation(electionContract, {
    //     start,
    //     length: TableItemCount,
    //   });
    //   result = result.concat(res ? res.value : []);
    //   start += 20;
    // }
    // return result;
  };
  useEffect(() => {
    Promise.all([
      fetchAllCandidateInfo(),
      // fetchCurrentRoundInformation(),
      // getAllTeamDesc(),
      // fetchElectorVote(currentWallet, electionContract),
      // fetchCurrentMinerPubkeyList(consensusContract),
    ])
      .then((resArr) => {
        // process data
        // const processedNodesData = this.processNodesData(resArr);
        // this.setState(
        //   {
        //     nodeList: processedNodesData,
        //   },
        //   () => {
        //     this.setState({
        //       isLoading: false,
        //     });
        //   },
        // );
      })
      .catch((err) => {
        // this.setState({
        //   isLoading: false,
        // });
        // console.error('GetPageableCandidateInformation', err);
      });
  }, []);
  return (
    <div className="high-council">
      <div className="high-council-header">
        <Typography.Title fontWeight={FontWeightEnum.Medium} level={6}>
          High Council Members
        </Typography.Title>
        {/* <Typography.Text fontWeight={FontWeightEnum.Medium}>-num- Members in Total</Typography.Text> */}
      </div>
      <ConfigProvider renderEmpty={() => <NoData></NoData>}>
        <Table
          // sortDirections={['asc', 'desc']}
          // scroll={{ x: 800 }}
          columns={[
            {
              title: 'Node name',
              dataIndex: 'address',
              render: (text) => {
                return /Test/.test(text) ? (
                  <span>{text}</span>
                ) : (
                  <HashAddress address={text} preLen={8} endLen={11} />
                );
              },
            },
            {
              title: 'Obtain Votes',
              dataIndex: 'obtainVotes',
            },
            {
              title: 'role',
              dataIndex: 'role',
            },
            {
              title: 'Produce Blocks',
              dataIndex: 'produceBlocks',
            },
          ]}
          // loading={loading}
          dataSource={[
            {
              address: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
              role: 'BP',
              obtainVotes: 1833,
              produceBlocks: 20173544,
            },
            {
              address: 'FveRXL9PgVhMkoDcPh9jCkjF8WxW2K2aA72xAx4ngPqYnpNVw',
              role: 'BP',
              obtainVotes: 3798,
              produceBlocks: 27010097,
            },
            {
              address: '2nw6SSJEymj72Yzvr6EepTNN5iUFWjukVfxj9g2K8iwdKvF3uf',
              role: 'BP',
              obtainVotes: 2531,
              produceBlocks: 27249136,
            },
            {
              address: 'Test-Node',
              role: 'BP',
              obtainVotes: 3391,
              produceBlocks: 10718542,
            },
            {
              address: 'Test-Node-001',
              role: 'BP',
              obtainVotes: 118621,
              produceBlocks: 28443829,
            },
          ]}
        ></Table>
      </ConfigProvider>
    </div>
  );
}
