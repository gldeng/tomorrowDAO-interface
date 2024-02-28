import { Input, Typography, ToolTip } from 'aelf-design';
import './index.css';
import { Form, Switch } from 'antd';
import ChainAddress from 'components/Address';
import { ReactComponent as QuestionIcon } from 'assets/imgs/question-icon.svg';
import { useState } from 'react';
import { cx } from 'antd-style';
import { mediaValidatorMap } from '../utils';
import IPFSUpload from 'components/IPFSUpload';

export default function BasicDetails() {
  const [form] = Form.useForm();
  const [showSymbol, setShowSymbol] = useState<boolean>(true);
  return (
    <div className="basic-detail">
      <div className="mb-6">
        <Typography.Title level={6}>Basic Information</Typography.Title>
      </div>
      <div>
        <Form layout="vertical" autoComplete="off">
          <Form.Item
            name="Name"
            rules={[
              {
                required: true,
                message: 'Name is required',
              },
              {
                type: 'string',
                max: 50,
                message: 'The DAO name cannot be more than 50 characters.',
              },
            ]}
            label="Name"
          >
            <Input placeholder="Make it something epic!" />
          </Form.Item>
          <Form.Item
            name="Logo"
            rules={[
              {
                required: true,
                message: 'Logo is required',
              },
            ]}
            label="Logo"
          >
            <IPFSUpload
              maxFileCount={1}
              needCheckImgSize
              accept=".png,.jpg"
              uploadText="Click to upload"
              uploadIconColor="#1A1A1A"
              tips="Only supports .png and .jpg formats with a size of 512*512, and less than 1MB."
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'description is required',
              },
              {
                type: 'string',
                max: 240,
                message: 'The description cannot be more than 240 characters.',
              },
            ]}
            name="Description"
            label="Description"
          >
            <Input.TextArea
              className="Description-textArea"
              showCount
              maxLength={10}
              style={{ height: 116 }}
              placeholder={`What is the mission and vision of this DAO? You will be able to change it later.`}
            />
          </Form.Item>
          <Form.Item className="mb-6" name="Social" label="">
            <div className="mt-8">
              <Typography.Title level={6}>Social Media</Typography.Title>
            </div>
            <div className="Media-info">At least one social media is required.</div>
          </Form.Item>
          <Form.Item
            name="Twitter"
            rules={[
              ...mediaValidatorMap.Twitter.validator,
              {
                type: 'string',
                max: 15,
                message: 'The URL should be shorter than 15 characters.',
              },
            ]}
            label="X (Twitter)"
          >
            <Input placeholder={`Input the DAO's twitter account starts with @`} />
          </Form.Item>
          <Form.Item
            name="Facebook"
            rules={[
              ...mediaValidatorMap.Other.validator,
              {
                type: 'string',
                max: 128,
                message: 'The URL should be shorter than 128 characters.',
              },
            ]}
            label="Facebook"
          >
            <Input placeholder={`Input the DAO's Facebook page address`} />
          </Form.Item>
          <Form.Item
            name="Discord"
            rules={[
              ...mediaValidatorMap.Other.validator,
              {
                type: 'string',
                max: 128,
                message: 'The URL should be shorter than 128 characters.',
              },
            ]}
            label="Discord"
          >
            <Input placeholder={`Input the link to join the DAO's Discord group`} />
          </Form.Item>
          <Form.Item
            name="Telegram"
            rules={[
              ...mediaValidatorMap.Other.validator,
              {
                type: 'string',
                max: 128,
                message: 'The URL should be shorter than 128 characters.',
              },
            ]}
            label="Telegram"
          >
            <Input placeholder={`Input the link to join the DAO's Telegram group`} />
          </Form.Item>
          <Form.Item
            name="Reddit"
            rules={[
              ...mediaValidatorMap.Other.validator,
              {
                type: 'string',
                max: 128,
                message: 'The URL should be shorter than 128 characters.',
              },
            ]}
            label="Reddit"
          >
            <Input placeholder={`Input the link to join the DAO's Reddit community`} />
          </Form.Item>
          <div className="mb-6 pt-8">
            <Typography.Title level={6}>TMRW DAO Metadata Admin</Typography.Title>
          </div>
          <div className="mb-8">
            <ChainAddress
              size="large"
              address="pykr77ft9UUKJZLVq15wCH8PinBSjVRQ12sD1Ayq92mKFsJ1i"
              info="The admin can only upgrade settings on the TMRW DAO platform - not the smart contracts."
            />
          </div>
          <div className={cx('symbol-radio', !showSymbol && '!mb-8')}>
            <Switch
              checked={showSymbol}
              onChange={(checked) => {
                setShowSymbol(checked);
              }}
            />
            <span className="token-title">Governance token</span>
            <ToolTip placement="top" title="What is the governance token?">
              <QuestionIcon className="cursor-pointer" width={16} height={16} />
            </ToolTip>
          </div>
          {showSymbol && (
            <Form.Item name="Symbol" label="">
              <Input placeholder="Input the token symbol" />
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
}
