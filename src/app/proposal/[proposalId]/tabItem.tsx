import { Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import { IVotingResult } from './components/type';

const tableData: IVotingResult[] = [];
for (let i = 0; i < 103; i++) {
  tableData.push({
    chainId: 'AELF',
    transactionId: 'c506dd8cfasf989fasdf167dd85bb',
    voter: 'c506dd8cfasf989fasdf167dd85bb',
    amount: 2232323232,
    voteOption: 'Rejected',
    voteTime: '2022/11/1610:32:11',
  });
}

export { tableData };
