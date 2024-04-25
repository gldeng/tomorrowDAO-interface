import { ReactNode, useContext, useState } from 'react';
import { Flex, Checkbox, CheckboxProps } from 'antd';
import { FontWeightEnum, Typography, HashAddress } from 'aelf-design';
import Image from 'next/image';
import CommonModalSwitchDrawer from 'components/CommonModalSwitchDrawer';
import CommonDaoLogo, { CommonDaoLogoSizeEnum } from 'components/CommonDaoLogo';
import { colorfulSocialMediaIconMap } from 'assets/imgs/socialMediaIcon';
import './index.css';
import { StepsContext, StepEnum } from '../../type';

const { Text, Title } = Typography;

function SocialMediaItem({ name, url }: { name: string; url: string }) {
  return (
    <Flex className="social-media-item" gap={8} align="center">
      <Image src={(colorfulSocialMediaIconMap as any)[name]} alt="media" width={16} height={16} />
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
  const { stepForm } = useContext(StepsContext);
  const [state, setState] = useState([false, false, false, false]);
  const disabled = state.findIndex((item) => item === false) > -1;

  const metaData = stepForm[StepEnum.step0].submitedRes;

  const socialMediaList = Object.keys(metaData?.metadata?.socialMedia ?? {}).map((key) => {
    return {
      name: key,
      url: metaData?.metadata.socialMedia[key],
    };
  });

  return (
    <CommonModalSwitchDrawer
      commonClassName="create-preview-modal"
      title="Confirm"
      modalWidth={800}
      footerConfig={{
        buttonList: [{ children: 'Confirm', onClick: onConfirm, disabled: disabled }],
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
          <Text>{metaData?.metadata.description}</Text>
          <Flex gap={12} wrap="wrap">
            {socialMediaList.map(({ name, url }, index) => (
              <SocialMediaItem key={index} name={name as string} url={url ?? ''} />
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
            <Text>{metaData?.governanceToken}</Text>
          </Flex>
        </Flex>
        <div className="divider" />
        <CheckboxItem
          label="Fixed governance mechanism"
          checked={state[0]}
          onChange={(e) => setState([e.target.checked, state[1], state[2], state[3]])}
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
          checked={state[1]}
          onChange={(e) => setState([state[0], e.target.checked, state[2], state[3]])}
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
          checked={state[2]}
          onChange={(e) => setState([state[0], state[1], e.target.checked, state[3]])}
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
          checked={state[3]}
          onChange={(e) => setState([state[0], state[1], state[2], e.target.checked])}
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
