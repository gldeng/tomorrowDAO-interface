import { ResultModal, eventBus } from './myEvent';
import { GetBalanceByContract, GetTokenInfo } from 'contract/callContract';
import { curChain } from 'config';
import { divDecimals } from './calculate';
import { CommonOperationResultModalType } from 'components/CommonOperationResultModal';
import { INIT_RESULT_MODAL_CONFIG } from 'components/ResultModal';

export const checkCreateProposal = async (daoData: IDaoInfoRes, address: string) => {
  // const daoData = await fetchDaoInfo({ chainId: curChain, alias: aliasName });
  const [balanceInfo, tokenInfo] = await Promise.all([
    GetBalanceByContract(
      {
        symbol: daoData?.data.governanceToken || 'ELF',
        owner: address,
      },
      { chain: curChain },
    ),
    GetTokenInfo(
      {
        symbol: daoData?.data.governanceToken || 'ELF',
      },
      { chain: curChain },
    ),
  ]);
  const proposalThreshold = daoData?.data?.governanceSchemeThreshold?.proposalThreshold;
  const decimals = tokenInfo?.decimals;
  if (
    proposalThreshold &&
    balanceInfo.balance < proposalThreshold &&
    daoData?.data?.governanceToken
  ) {
    const requiredToken = divDecimals(proposalThreshold, decimals).toString();
    eventBus.emit(ResultModal, {
      open: true,
      type: CommonOperationResultModalType.Warning,
      primaryContent: 'Insufficient Governance Tokens',
      secondaryContent: (
        <div>
          {/* <div>Minimum Token Proposal Requirement: {requiredToken}</div> */}
          <div>
            Your Governance Token:{' '}
            {divDecimals(balanceInfo.balance, tokenInfo?.decimals || '8').toNumber()}
          </div>
          <div>
            Can&apos;t create a proposal, you need hold at least {requiredToken}{' '}
            {daoData?.data.governanceToken}. Transfer tokens to your wallet.
          </div>
        </div>
      ),
      footerConfig: {
        buttonList: [
          {
            children: <span>OK</span>,
            onClick: () => {
              eventBus.emit(ResultModal, INIT_RESULT_MODAL_CONFIG);
            },
          },
        ],
      },
    });
    return false;
  }
  return true;
};
