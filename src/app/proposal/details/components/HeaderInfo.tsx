import BoxWrapper from './BoxWrapper';
import DetailTag from 'components/DetailTag';
import { Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import { colorfulSocialMediaIconMap } from 'assets/imgs/socialMediaIcon';
import ProposalDetailFile from 'assets/imgs/proposal-detail-file.svg';
import Image from 'next/image';
import { memo } from 'react';

const HeaderInfo = () => {
  return (
    <BoxWrapper>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <DetailTag
            customStyle={{
              text: 'Active',
              height: 20,
              color: '#F8B042',
              bgColor: '#FEF7EC',
            }}
          />
          <Typography.Text size="small" className="text-Neutral-Secondary-Text">
            Will expire on Nov 13, 2023.
          </Typography.Text>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2 py-1.5 px-4 rounded-md bg-Neutral-Default-BG">
            <Image className="mr-1" width={14} height={14} src={ProposalDetailFile} alt=""></Image>
            <Typography.Text
              size="small"
              className="text-Primary-Text"
              fontWeight={FontWeightEnum.Medium}
            >
              Preview File
            </Typography.Text>
          </div>
          <div className="w-8 h-8 cursor-pointer bg-Neutral-Default-BG rounded-md flex justify-center items-center">
            <Image src={colorfulSocialMediaIconMap.x} alt="x" width={11} height={10} />
          </div>
        </div>
      </div>
      <div className="pt-4 pb-3">
        <Typography.Title level={5} fontWeight={FontWeightEnum.Medium}>
          An upgrade of smart contract ELF_ABC...CBA_AELF on MainChain AELF
        </Typography.Title>
      </div>
      <div className="flex gap-2 pb-6">
        <DetailTag
          customStyle={{
            text: 'Parliament',
            height: 20,
            color: '#919191',
            bgColor: '#FAFAFA',
          }}
        />
        <DetailTag
          customStyle={{
            text: 'Update Contract',
            height: 20,
            color: '#919191',
            bgColor: '#FAFAFA',
          }}
        />
      </div>
      <div className="border-0 border-t border-solid border-Neutral-Divider flex pt-6 gap-16">
        <div className="flex items-center gap-4">
          <Typography.Text className="text-Neutral-Secondary-Text">Poster:</Typography.Text>
          <HashAddress preLen={8} endLen={9} address={'ELF_2PedfasdfadsfasW28l_tDVW'}></HashAddress>
        </div>
        <div className="flex items-center gap-4">
          <Typography.Text className="text-Neutral-Secondary-Text">Proposal ID:</Typography.Text>
          <HashAddress preLen={8} endLen={9} address={'2PedfasdfadsfasW28l'}></HashAddress>
        </div>
        <div className="flex items-center gap-4">
          <Typography.Text className="text-Neutral-Secondary-Text">Poster on:</Typography.Text>
          <Typography.Text>Nov 13, 2023</Typography.Text>
        </div>
      </div>
    </BoxWrapper>
  );
};

export default memo(HeaderInfo);
