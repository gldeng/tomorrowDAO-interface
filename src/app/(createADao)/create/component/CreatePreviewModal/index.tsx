import { ReactNode } from 'react';
import { Flex, Checkbox, CheckboxProps } from 'antd';
import { FontWeightEnum, Typography, HashAddress } from 'aelf-design';
import Image from 'next/image';
import CommonModalSwitchDrawer from 'components/CommonModalSwitchDrawer';
import CommonDaoLogo, { CommonDaoLogoSizeEnum } from 'components/CommonDaoLogo';
import { colorfulSocialMediaIconMap } from 'assets/imgs/socialMediaIcon';
import './index.css';

const { Text, Title } = Typography;

const socialMediaList = [
  {
    name: 'telegram',
    url: 'https://t.me/aelfblockchain',
  },
  {
    name: 'medium',
    url: 'https://medium.com/aelfblockchain',
  },
  {
    name: 'facebook',
    url: 'https://www.facebook.com/aelfofficial',
  },
  {
    name: 'reddit',
    url: 'https://www.reddit.com/r/aelfofficial/',
  },
  {
    name: 'discord',
    url: 'https://discord.gg/3gV2rPf',
  },
  {
    name: 'station',
    url: 'https://www.google.com',
  },
  {
    name: 'x',
    url: 'https://www.google.com',
  },
] as const;

function SocialMediaItem({
  name,
  url,
}: {
  name: keyof typeof colorfulSocialMediaIconMap;
  url: string;
}) {
  return (
    <Flex className="social-media-item" gap={8} align="center">
      <Image src={colorfulSocialMediaIconMap[name]} alt="media" width={16} height={16} />
      <Text>{url}</Text>
    </Flex>
  );
}

function CheckboxItem({
  label,
  descriptionList,
  checked,
  onChange,
}: {
  label?: string;
  descriptionList?: {
    content: ReactNode;
    children?: ReactNode[];
  }[];
  checked?: boolean;
  onChange?: CheckboxProps['onChange'];
}) {
  return (
    <Flex vertical gap={16}>
      <Checkbox checked={checked} onChange={onChange}>
        <Title fontWeight={FontWeightEnum.Medium}>{label}</Title>
      </Checkbox>
      {descriptionList?.map(({ content, children }, index) => (
        <Flex key={index} className="ml-6" gap={8}>
          <div className="dot" />
          {children?.length ? (
            <Flex vertical gap={4}>
              <Text fontWeight={FontWeightEnum.Medium}>{content}</Text>
              {children.map((item, idx) => (
                <Text key={idx}>{item}</Text>
              ))}
            </Flex>
          ) : (
            <Text>{content}</Text>
          )}
        </Flex>
      ))}
    </Flex>
  );
}

function AddressItem({
  label,
  address,
  isBoldLabel = false,
}: {
  label: string;
  address: string;
  isBoldLabel?: boolean;
}) {
  return (
    <Flex gap={isBoldLabel ? 4 : 0} align="center" wrap="wrap">
      {isBoldLabel ? (
        <Title className="mr-1" fontWeight={FontWeightEnum.Medium}>
          {label}:
        </Title>
      ) : (
        <Text className="mr-2">{label}:</Text>
      )}
      <HashAddress className="address" ignoreEvent address={address} />
    </Flex>
  );
}

export interface ICreatePreviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CreatePreviewModal({ open, onClose, onConfirm }: ICreatePreviewModalProps) {
  return (
    <CommonModalSwitchDrawer
      commonClassName="create-preview-modal"
      title="Confirm"
      modalWidth={800}
      footerConfig={{
        buttonList: [{ children: 'Confirm', onClick: onConfirm }],
      }}
      open={open}
      onClose={onClose}
    >
      <Flex vertical gap={24}>
        <Flex vertical gap={12}>
          <Flex gap={8} align="center">
            <CommonDaoLogo src="" daoName="Network DAO" size={CommonDaoLogoSizeEnum.Small} />
            <Title level={5} fontWeight={FontWeightEnum.Medium}>
              Network DAO
            </Title>
          </Flex>
          <Text>
            AELF is a fully decentralized community governed protocol by the ELF token-holders. ELF
            token-holders collectively discuss, propose, and vote on upgrades to the protocol. ELF
            token-holders (aelf network only) can either vote themselves on new proposals or
            delegate to an address of choice. To learn more, check out the Governance documentation.
          </Text>
          <Flex gap={12} wrap="wrap">
            {socialMediaList.map(({ name, url }, index) => (
              <SocialMediaItem key={index} name={name} url={url} />
            ))}
          </Flex>
        </Flex>
        <Flex vertical gap={16}>
          <AddressItem
            isBoldLabel
            label="Metadata admin"
            address="ELF_2XDRhxzMbaYRCTe3NxRpARKBpjfQpyWdBkKscQpc3Tph3m6dqHG_AELF"
          />
          <Flex gap={8} align="center">
            <Title fontWeight={FontWeightEnum.Medium}>Governance token:</Title>
            <Text>ELF</Text>
          </Flex>
        </Flex>
        <div className="divider" />
        <CheckboxItem
          label="Fixed governance mechanism"
          descriptionList={[
            {
              content: 'Parliament',
            },
            {
              content:
                'Each proposal requires the participation of at least 100 members to be effective /Each proposal requires the participation of at least 75% of the members to be effective.',
            },
            {
              content: 'Each proposal must receive more than 65% of approved votes to be approved.',
            },
          ]}
        />
        <CheckboxItem
          label="High Council"
          descriptionList={[
            {
              content:
                '17 members at least, 10,000 candidates at most, with a termrotation every 7 days.',
            },
            {
              content: (
                <AddressItem
                  label="Election Contract"
                  address="ELF_2XDRhxzMbaYRCTe3NxRpARKBpjfQpyWdBkKscQpc3Tph3m6dqHG_AELF"
                />
              ),
            },
          ]}
        />
        <CheckboxItem
          label={`Documents (${3})`}
          descriptionList={[
            {
              content: 'File Name1.pdf',
            },
            {
              content: 'File Name2.pdf',
            },
            {
              content: 'File Name3.pdf',
            },
          ]}
        />
        <CheckboxItem
          label="Governance Contracts (2)"
          descriptionList={[
            {
              content: 'Governance:',
              children: [
                <AddressItem
                  key="Donate"
                  label="Donate"
                  address="ELF_2XDRhxzMbaYRCTe3NxRpARKBpjfQpyWdBkKscQpc3Tph3m6dqHG_AELF"
                />,
                <AddressItem
                  key="Transfer"
                  label="Transfer"
                  address="ELF_2XDRhxzMbaYRCTe3NxRpARKBpjfQpyWdBkKscQpc3Tph3m6dqHG_AELF"
                />,
              ],
            },
            {
              content: 'Treasury:',
              children: [
                <AddressItem
                  key="Donate"
                  label="Donate"
                  address="ELF_2XDRhxzMbaYRCTe3NxRpARKBpjfQpyWdBkKscQpc3Tph3m6dqHG_AELF"
                />,
                <AddressItem
                  key="Transfer"
                  label="Transfer"
                  address="ELF_2XDRhxzMbaYRCTe3NxRpARKBpjfQpyWdBkKscQpc3Tph3m6dqHG_AELF"
                />,
              ],
            },
          ]}
        />
      </Flex>
    </CommonModalSwitchDrawer>
  );
}
