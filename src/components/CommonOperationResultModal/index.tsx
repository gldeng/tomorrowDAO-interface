import { ReactNode } from 'react';
import { Flex } from 'antd';
import { FontWeightEnum, Typography } from 'aelf-design';
import Image from 'antd/lib/image';
import CommonModal, { TCommonModalProps } from 'components/CommonModal';
import successFilledIcon from 'assets/imgs/successFilled.svg';
import errorFilledIcon from 'assets/imgs/errorFilled.svg';
import warningFilledIcon from 'assets/imgs/warningFilled.svg';

const { Text, Title } = Typography;

export enum CommonOperationResultModalType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
}

const ICON_MAP = {
  [CommonOperationResultModalType.Success]: successFilledIcon,
  [CommonOperationResultModalType.Error]: errorFilledIcon,
  [CommonOperationResultModalType.Warning]: warningFilledIcon,
};

type TCommonOperationResultModalProps = Pick<
  TCommonModalProps,
  'footerConfig' | 'open' | 'onCancel'
> & {
  type: CommonOperationResultModalType;
  primaryContent: ReactNode;
  secondaryContent?: ReactNode;
};

export default function CommonOperationResultModal({
  type = CommonOperationResultModalType.Success,
  primaryContent,
  secondaryContent,
  ...modalProps
}: TCommonOperationResultModalProps) {
  return (
    <CommonModal {...modalProps}>
      <Flex vertical align="center" gap={16}>
        <Image src={ICON_MAP[type]} alt="icon" width={64} height={64} />
        <Title className="text-center" level={6} fontWeight={FontWeightEnum.Medium}>
          {primaryContent}
        </Title>
        <Text className="text-center text-[#919191]">{secondaryContent}</Text>
      </Flex>
    </CommonModal>
  );
}
