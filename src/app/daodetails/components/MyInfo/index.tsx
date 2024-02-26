import { Descriptions, Divider, Form, List, DescriptionsProps } from 'antd';

import { HashAddress, Typography, FontWeightEnum, Button, Modal, Input } from 'aelf-design';
import { useState } from 'react';
import Image from 'next/image';

import ElfIcon from 'assets/imgs/elf-icon.svg';
import SuccessGreenIcon from 'assets/imgs/success-green.svg';
import CommonModal from 'components/CommonModal';

import Info from '../Info';

type InfoTypes = {
  info: {
    creator: string;
    data: Array<{
      label: string;
      value: string;
    }>;
  };
  height?: number;
  isLogin: boolean;
  children?: any;
};

export default function MyInfo(props: InfoTypes) {
  const { info, isLogin = true, height } = props;
  const [form] = Form.useForm();
  const myInfoItems = [
    {
      key: '0',
      label: '',
      children: info && (
        <HashAddress
          preLen={8}
          endLen={11}
          address={info.creator}
          className="address"
        ></HashAddress>
      ),
    },
    {
      key: '1',
      label: 'ELF Balance',
      children: <div className="w-full text-right">-</div>,
    },
    {
      key: '2',
      label: 'Staked ELF',
      children: <div className="w-full text-right">-</div>,
    },
    {
      key: '3',
      label: 'Voted',
      children: <div className="w-full text-right">-</div>,
    },
  ];

  const listData = Array.from({ length: 3 }, (index: number) => {
    return {
      name: 'fasf',
      value: 11 + index,
    };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnstakeAmModalOpen, setIsUnstakeAmIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClaim = () => {
    setIsUnstakeAmIsModalOpen(true);
  };

  return (
    <div
      className="border-0 lg:border border-Neutral-Divider border-solid rounded-lg bg-white px-4 pt-2 pb-6 lg:px-8  lg:py-6"
      style={{
        height: height || 'auto',
      }}
    >
      <Typography.Title fontWeight={FontWeightEnum.Medium} level={6} className="pb-6">
        My Info
      </Typography.Title>
      {isLogin ? (
        <div>
          {info && (
            <HashAddress
              preLen={8}
              endLen={11}
              address={info.creator}
              className="address"
            ></HashAddress>
          )}

          <List
            dataSource={info.data}
            className="py-2"
            renderItem={(item) => (
              <div className="border-0 flex justify-between items-center m-2">
                <Typography.Text className="text-Neutral-Secondary-Text">
                  {item.label}
                </Typography.Text>
                <Typography.Title> {item.value}</Typography.Title>
              </div>
            )}
          />
          {/* cliam */}
          <Divider className="mt-0 mb-4" />
          <div className="flex justify-between items-start">
            <div>
              <div className="text-Neutral-Secondary-Text text-sm mb-1">Available to unstake</div>
              <div className="text-Primary-Text font-medium">999 ELF</div>
            </div>
            <Button type="primary" onClick={showModal}>
              Claim
            </Button>
          </div>
          {/* Claim Modal  */}
          <Modal
            open={isModalOpen}
            title={<div className="text-center">Claim ELF on MainChain AELF</div>}
            // onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
          >
            <p className="text-center color-text-Primary-Text font-medium">
              An upgrade of smart contract ELF_DBCC...C3BW_AELF on MainChain AELF on MainChain AELF
            </p>
            <div className="text-center color-text-Primary-Text font-medium">
              <span className="text-[32px] mr-1">999</span>
              <span>ELF</span>
            </div>
            <div className="text-center text-Neutral-Secondary-Text">Available to unstake</div>
            <Form form={form} layout="vertical" variant="filled">
              <Form.Item
                label="Required Mark"
                name="requiredMarkValue"
                tooltip="Currently, only one-time withdrawal of all unlocked ELF is supported."
              >
                <Input
                  placeholder="input placeholder"
                  suffix={
                    <div className="flex items-center">
                      <Divider type="vertical" />
                      <Image width={24} height={24} src={ElfIcon} alt="" />
                      <span className="text-Neutral-Secondary-Text ml-1">ELF</span>
                    </div>
                  }
                />
              </Form.Item>
              <div>
                <Button className="mx-auto" type="primary" onClick={handleClaim}>
                  Claim
                </Button>
              </div>
            </Form>
          </Modal>
          {/* Unstake Amount  */}
          <Modal
            open={isUnstakeAmModalOpen}
            title={<div className="text-center">Unstake Amount</div>}
            onCancel={() => {
              setIsUnstakeAmIsModalOpen(false);
            }}
            footer={null}
          >
            <p>Currently, only one-time withdrawal of all unlocked ELF is supported.</p>
            <Button
              className="mx-auto"
              type="primary"
              onClick={() => {
                setIsUnstakeAmIsModalOpen(false);
              }}
            >
              OK
            </Button>
          </Modal>

          <CommonModal
            open={isUnstakeAmModalOpen}
            onCancel={() => {
              setIsUnstakeAmIsModalOpen(false);
            }}
          >
            <Image className="mx-auto block" width={56} height={56} src={SuccessGreenIcon} alt="" />
            <div className="text-center text-Primary-Text font-medium">
              <span className="text-[32px] mr-1">999</span>
              <span>ELF</span>
            </div>
            <p className="text-center text-Neutral-Secondary-Text font-medium">
              Congratulations, transaction submitted successfully!
            </p>
            <List
              size="small"
              dataSource={listData}
              className="bg-Neutral-Hover-BG py-2"
              renderItem={(item) => (
                <List.Item className="border-0">
                  <Typography.Text> {item.name}</Typography.Text>
                  <Typography.Text> {item.value}</Typography.Text>
                </List.Item>
              )}
            />
            <Button
              className="mx-auto mt-6 w-[206px]"
              type="primary"
              onClick={() => {
                setIsUnstakeAmIsModalOpen(false);
              }}
            >
              I Know
            </Button>
            <Button
              type="link"
              className="mx-auto text-colorPrimary"
              size="small"
              onClick={() => {
                setIsUnstakeAmIsModalOpen(false);
              }}
            >
              View Transaction Details
            </Button>
          </CommonModal>

          <CommonModal
            open={isUnstakeAmModalOpen}
            onCancel={() => {
              setIsUnstakeAmIsModalOpen(false);
            }}
          >
            <Info></Info>
            <Button
              className="mx-auto mt-6 w-[206px]"
              type="primary"
              onClick={() => {
                setIsUnstakeAmIsModalOpen(false);
              }}
            >
              Back
            </Button>
          </CommonModal>
        </div>
      ) : (
        <div>
          <Button className="w-full mb-4" type="primary">
            Login
          </Button>
          <div className="text-center text-Neutral-Secondary-Text">
            Connect wallet to view your votes.
          </div>
        </div>
      )}
      <div>{props.children}</div>
    </div>
  );
}
