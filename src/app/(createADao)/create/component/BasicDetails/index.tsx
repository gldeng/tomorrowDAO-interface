import { Input, Typography, Tooltip } from 'aelf-design';
import './index.css';
import { Form, Switch } from 'antd';
import ChainAddress from 'components/Address';
import { ReactComponent as QuestionIcon } from 'assets/imgs/question-icon.svg';
import { useState } from 'react';
import { cx } from 'antd-style';
import { mediaValidatorMap, useRegisterForm } from '../utils';
import IPFSUpload from 'components/IPFSUpload';
import { StepEnum } from '../../type';
import { useSelector } from 'react-redux';
import { dispatch } from 'redux/store';
import { fetchTokenInfo } from 'api/request';
import { setToken } from 'redux/reducer/daoCreate';

const mediaList = [
  ['metadata', 'socialMedia', 'Twitter'],
  ['metadata', 'socialMedia', 'Facebook'],
  ['metadata', 'socialMedia', 'Telegram'],
  ['metadata', 'socialMedia', 'Discord'],
  ['metadata', 'socialMedia', 'Reddit'],
];

export default function BasicDetails() {
  const [form] = Form.useForm();
  const [showSymbol, setShowSymbol] = useState<boolean>(true);
  const [mediaError, setMediaError] = useState<boolean>(false);
  const { walletInfo } = useSelector((store: any) => store.userInfo);
  const elfInfo = useSelector((store: any) => store.elfInfo.elfInfo);
  useRegisterForm(form, StepEnum.step0);
  return (
    <div className="basic-detail">
      <div className="mb-6">
        <Typography.Title level={6}>Basic Information</Typography.Title>
      </div>
      <div>
        <Form
          layout="vertical"
          name="baseInfo"
          scrollToFirstError={true}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            name={['metadata', 'name']}
            validateFirst
            rules={[
              {
                required: true,
                message: 'The name is required',
              },
              {
                type: 'string',
                max: 50,
                message: 'The name should contain no more than 50 characters.',
              },
            ]}
            label="Name"
          >
            <Input placeholder="Enter a name for the DAO" />
          </Form.Item>
          <Form.Item
            name={['metadata', 'logoUrl']}
            valuePropName="fileList"
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
              uploadText="Click to Upload"
              uploadIconColor="#1A1A1A"
              tips="Formats supported: PNG and JPG. 512 x 512 px standard, less than 1 MB."
            />
          </Form.Item>
          <Form.Item
            validateFirst
            rules={[
              {
                required: true,
                message: 'description is required',
              },
              {
                type: 'string',
                max: 240,
                message: 'The description should contain no more than 240 characters.',
              },
            ]}
            name={['metadata', 'description']}
            label="Description"
          >
            <Input.TextArea
              className="Description-textArea"
              showCount
              maxLength={240}
              // eslint-disable-next-line no-inline-styles/no-inline-styles
              style={{ height: 116 }}
              placeholder={`Enter the mission and vision of the DAO (240 characters max). This can be modified after DAO is created.`}
            />
          </Form.Item>
          <Form.Item
            className="mb-6"
            name={['metadata', 'socialMedia', 'title']}
            dependencies={mediaList}
            rules={[
              ({ getFieldValue }) => ({
                validator() {
                  const metadata = mediaList.map((item) => getFieldValue(item));
                  const values = Object.values(metadata);
                  const checked = values.some((item) => item);
                  if (checked) {
                    setMediaError(false);
                    return Promise.resolve();
                  }
                  setMediaError(true);
                  return Promise.reject(new Error(''));
                },
              }),
            ]}
            label=""
          >
            <div className="mt-8" id="baseInfo_metadata_socialMedia_title">
              <Typography.Title level={6}>Social Media</Typography.Title>
            </div>
            <div className={cx('Media-info', mediaError && '!text-Reject-Reject')}>
              At least one social media is required.
            </div>
          </Form.Item>
          <Form.Item
            name={['metadata', 'socialMedia', 'Twitter']}
            validateFirst
            rules={[
              ...mediaValidatorMap.Twitter.validator,
              {
                type: 'string',
                max: 16,
                message: 'The X (Twitter) user name should be shorter than 15 characters.',
              },
            ]}
            label="X (Twitter)"
          >
            <Input placeholder={`Enter the DAO's X handle, starting with @`} />
          </Form.Item>
          <Form.Item
            name={['metadata', 'socialMedia', 'Facebook']}
            validateFirst
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
            <Input placeholder={`Enter the DAO's Facebook link`} />
          </Form.Item>
          <Form.Item
            name={['metadata', 'socialMedia', 'Discord']}
            validateFirst
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
            <Input placeholder={`Enter the DAO's Discord community link`} />
          </Form.Item>
          <Form.Item
            name={['metadata', 'socialMedia', 'Telegram']}
            validateFirst
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
            <Input placeholder={`Enter the DAO's Telegram community link`} />
          </Form.Item>
          <Form.Item
            name={['metadata', 'socialMedia', 'Reddit']}
            validateFirst
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
            <Input placeholder={`Enter the DAO's subreddit link`} />
          </Form.Item>
          <div className="mb-6 pt-8">
            <Typography.Title level={6}>DAO&apos;s Metadata Admin</Typography.Title>
          </div>
          <div className="mb-8">
            <ChainAddress
              size="large"
              address={walletInfo.address}
              chain={elfInfo.curChain}
              info="The DAO's metadata admin can modify certain info about the DAO, such as its description, logo, social media, documents, etc."
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
            <Tooltip
              placement="top"
              title={
                <div>
                  <div>
                    Using a governance token is essential for enabling the High Council and
                    facilitating additional voting mechanisms.
                  </div>
                  <div>
                    1. If the High Council is to be enabled, its members are elected from top-ranked
                    addresses who stake governance tokens and receive votes.
                  </div>
                  <div>
                    2. If a governance token is not used, only one type of proposal voting mechanism
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    is supported: "1 address = 1 vote". With the governance token enabled, DAOs can
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    support an additional mechanism: "1 token = 1 vote". You can choose the voting
                    mechanism when you create proposals.
                  </div>
                </div>
              }
            >
              <QuestionIcon className="cursor-pointer" width={16} height={16} />
            </Tooltip>
          </div>
          {showSymbol && (
            <Form.Item
              validateFirst
              rules={[
                {
                  required: true,
                  message: 'governance_token is required',
                },
                {
                  validator: (_, value) => {
                    const reqParams = {
                      symbol: value ?? '',
                      chainId: elfInfo.curChain,
                    };
                    return new Promise<void>((resolve, reject) => {
                      fetchTokenInfo(reqParams)
                        .then((res) => {
                          dispatch(setToken(res.data));
                          if (!res.data.name) {
                            reject(new Error('The token is not issued yet.'));
                          }
                          if (res.data.isNFT) {
                            reject(
                              new Error(
                                `${value} is an NFT and cannot be used as governance token.`,
                              ),
                            );
                          }
                          resolve();
                        })
                        .catch(() => {
                          reject(new Error('api error，Re-enter the token'));
                        });
                    });
                  },
                },
              ]}
              validateTrigger="onBlur"
              name="governanceToken"
              label=""
            >
              <Input
                placeholder="Enter a token symbol"
                onBlur={() => {
                  const token = form.getFieldValue('governanceToken');
                  form.setFieldValue('governanceToken', token?.toUpperCase());
                }}
              />
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
}
