import { ReactNode } from 'react';
import clsx from 'clsx';
import { Flex } from 'antd';
import { Typography, FontWeightEnum } from 'aelf-design';
import Image from 'next/image';
import icon_close from 'assets/imgs/icon_close.svg';
import './index.css';

const { Title } = Typography;

interface ICommonHeaderProps {
  title: ReactNode;
  onClose: (e: any) => void;
}

export default function CommonHeader({ title, onClose }: ICommonHeaderProps) {
  return (
    <Flex className={clsx('common-header', { ['!mb-6']: !!title })} align="center">
      <Title className="common-header-title" level={6} fontWeight={FontWeightEnum.Medium}>
        {title}
      </Title>
      <Image
        className="common-header-close"
        src={icon_close}
        alt="close"
        width={16}
        height={16}
        onClick={onClose}
      />
    </Flex>
  );
}
