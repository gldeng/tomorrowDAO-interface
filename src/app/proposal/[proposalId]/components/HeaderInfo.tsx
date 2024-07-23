import BoxWrapper from './BoxWrapper';
import DetailTag from 'components/DetailTag';
import { HashAddress } from 'aelf-design';
import { colorfulSocialMediaIconMap } from 'assets/imgs/socialMediaIcon';
import Image from 'next/image';
import { memo } from 'react';
import dayjs from 'dayjs';
import { sideChainSuffix } from 'config';
import ProposalTag from 'app/dao/[aliasName]/components/ProposalsItem/ProposalTag';
import { ProposalTypeString } from 'types';
import useIsNetworkDao from 'hooks/useIsNetworkDao';
import LinkNetworkDao from 'components/LinkNetworkDao';
import Link from 'next/link';
import ProposalStatusDesc from 'app/dao/[aliasName]/components/ProposalsItem/ProposalStatusDesc';
import useResponsive from 'hooks/useResponsive';
import { getProposalStatusText } from 'utils/proposal';

// import ProposalDetailFile from 'assets/imgs/proposal-detail-file.svg';
interface IHeaderInfoProps {
  proposalDetailData: IProposalDetailData;
}
const HeaderInfo = (props: IHeaderInfoProps) => {
  const { proposalDetailData } = props;
  const handleShare = () => {
    const twTitle = `${proposalDetailData.proposalTitle} @tmrwdao`;
    const twUrl = window.location.href;
    // eslint-disable-next-line prettier/prettier
    const url = `http://twitter.com/share?text=${twTitle}&url=${twUrl}`;
    window.open(url);
  };
  const { isLG } = useResponsive();
  const { isNetWorkDao } = useIsNetworkDao();
  return (
    <BoxWrapper>
      <div className="flex justify-between items-start">
        <div className="flex gap-2 lg:flex-row flex-col">
          <DetailTag
            customStyle={{
              text: getProposalStatusText(proposalDetailData.proposalStatus),
              height: 20,
              color: '#F8B042',
              bgColor: '#FEF7EC',
            }}
            className="max-content"
          />
          <span className="text-Neutral-Secondary-Text card-xsm-text">
            <ProposalStatusDesc proposalItem={proposalDetailData as unknown as IProposalsItem} />
          </span>
        </div>
        <div className="flex gap-6">
          <div
            className="h-8 cursor-pointer bg-Neutral-Default-BG rounded-md flex justify-center items-center px-[10px]"
            onClick={handleShare}
          >
            <Image src={colorfulSocialMediaIconMap.Twitter} alt="x" width={11} height={10} />
            <span className="pl-[4px] card-xsm-text">{isLG ? 'Share' : 'Share on X'}</span>
          </div>
        </div>
      </div>
      <div className="pt-4 pb-3">
        <span className="card-title-lg">{proposalDetailData.proposalTitle}</span>
      </div>
      <div className="flex gap-2 pb-6">
        <ProposalTag
          proposalType={proposalDetailData.proposalType}
          proposalSource={proposalDetailData.proposalSource}
          governanceMechanism={proposalDetailData.governanceMechanism}
        />
      </div>
      <div className="proposal-detail-key-value border-0 border-t border-solid border-Neutral-Divider flex pt-6 gap-y-4 gap-x-0 lg:gap-x-16 lg:gap-y-0 lg:flex-row flex-col flex-wrap">
        {proposalDetailData.proposalType === ProposalTypeString.Veto && (
          <div className="flex items-center gap-4">
            <span className="text-Neutral-Secondary-Text card-sm-text">Veto Proposal:</span>
            <Link href={`/proposal/${proposalDetailData.vetoProposalId}`}>
              <HashAddress
                preLen={8}
                endLen={9}
                ignorePrefixSuffix={true}
                className="hash-link-color card-sm-text-bold"
                address={proposalDetailData.vetoProposalId ?? '-'}
              ></HashAddress>
            </Link>
          </div>
        )}
        <div className="flex items-center gap-4">
          <span className="text-Neutral-Secondary-Text card-sm-text">Poster:</span>
          <HashAddress
            preLen={8}
            endLen={9}
            address={proposalDetailData.proposer}
            className="card-sm-text-bold"
            chain={sideChainSuffix}
          ></HashAddress>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-Neutral-Secondary-Text card-sm-text">Proposal ID:</span>
          <HashAddress
            preLen={8}
            endLen={9}
            ignorePrefixSuffix={true}
            address={proposalDetailData.proposalId ?? '-'}
            className="card-sm-text-bold"
          ></HashAddress>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-Neutral-Secondary-Text card-sm-text">Published:</span>
          <span className="card-sm-text">
            {proposalDetailData.deployTime
              ? dayjs(proposalDetailData.deployTime).format('YYYY-MM-DD HH:mm:ss')
              : '-'}
          </span>
        </div>
      </div>
    </BoxWrapper>
  );
};

export default memo(HeaderInfo);
