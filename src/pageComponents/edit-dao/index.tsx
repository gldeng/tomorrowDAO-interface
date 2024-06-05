import React, { useEffect, useState } from 'react';
import { message, Form } from 'antd';
import { useRequest } from 'ahooks';
import { Input, Typography } from 'aelf-design';
import { SkeletonList } from 'components/Skeleton';
import { fetchDaoInfo } from 'api/request';
import IPFSUpload from 'components/IPFSUpload';
import { emitLoading, eventBus, ResultModal } from 'utils/myEvent';
import { curChain, daoAddress, NetworkDaoHomePathName } from 'config';
import { mediaList } from 'app/(createADao)/create/component/BasicDetails';
import { cx } from 'antd-style';
import { mediaValidatorMap } from 'app/(createADao)/create/component/utils';
import { callContract } from 'contract/callContract';
import ErrorResult from 'components/ErrorResult';
import './index.css';
import { ButtonCheckLogin } from 'components/ButtonCheckLogin';
import { CommonOperationResultModalType } from 'components/CommonOperationResultModal';
import { IContractError } from 'types';
import Link from 'next/link';
import { INIT_RESULT_MODAL_CONFIG } from 'components/ResultModal';
import formValidateScrollFirstError from 'utils/formValidateScrollFirstError';
import breadCrumb from 'utils/breadCrumb';

interface IEditDaoProps {
  daoId: string;
  isNetworkDAO?: boolean;
}

const EditDao: React.FC<IEditDaoProps> = (props) => {
  const { daoId, isNetworkDAO } = props;
  const [mediaError, setMediaError] = useState<boolean>(false);
  const [form] = Form.useForm();
  const {
    data: daoData,
    error: daoError,
    loading: daoLoading,
  } = useRequest(async () => {
    if (!daoId) {
      message.error('daoId is required');
      return null;
    }
    return fetchDaoInfo({ daoId, chainId: curChain });
  });
  const handleSave = async () => {
    const res = await form?.validateFields().catch((err) => {
      formValidateScrollFirstError(form, err);
      return null;
    });
    if (!res) return;
    const socialMedia: Record<string, string> = Object.keys(res.metadata.socialMedia).reduce(
      (acc: Record<string, string>, key: string) => {
        if (res.metadata.socialMedia[key]) {
          acc[key] = res.metadata.socialMedia[key];
        }
        return acc;
      },
      {},
    );
    const params = {
      daoId: daoId,
      metadata: {
        logoUrl: res.metadata.logoUrl[0].url,
        description: res.metadata.description,
        socialMedia,
      },
    };
    console.log('params', params);
    try {
      emitLoading(true, 'The changes is being processed...');
      const res = await callContract('UpdateMetadata', params, daoAddress);
      emitLoading(false);
      console.log('eventBus.emit');
      eventBus.emit(ResultModal, {
        open: true,
        type: CommonOperationResultModalType.Success,
        primaryContent: 'The changes have been submitted successfully.',
        footerConfig: {
          buttonList: [
            {
              onClick: () => {
                eventBus.emit(ResultModal, INIT_RESULT_MODAL_CONFIG);
              },
              children: (
                <Link
                  href={
                    isNetworkDAO
                      ? `${NetworkDaoHomePathName}/${daoId}/proposal-list`
                      : `/dao/${daoId}`
                  }
                >
                  <span className="text-white">View The DAO</span>
                </Link>
              ),
            },
          ],
        },
      });
    } catch (error) {
      const err = error as IContractError;
      emitLoading(false);
      eventBus.emit(ResultModal, {
        open: true,
        type: CommonOperationResultModalType.Error,
        primaryContent: 'Save Changes Error',
        secondaryContent: err?.errorMessage?.message || err?.message,
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
    }
  };
  useEffect(() => {
    breadCrumb.updateSettingPage(daoId);
  }, [daoId]);
  // recover from api response
  useEffect(() => {
    if (!daoData?.data) return;
    const { name, logoUrl, description, socialMedia } = daoData.data?.metadata ?? {};
    form.setFieldsValue({
      metadata: {
        name,
        logoUrl: [
          {
            uid: '3',
            name: 'logo.png',
            status: 'done',
            url: logoUrl,
          },
        ],
        description,
        socialMedia: {
          Twitter: socialMedia.Twitter,
          Facebook: socialMedia.Facebook,
          Telegram: socialMedia.Telegram,
          Discord: socialMedia.Discord,
          Reddit: socialMedia.Reddit,
        },
      },
    });
  }, [form, daoData]);

  return (
    <div className="dao-edit">
      {daoError && <ErrorResult />}
      {daoLoading ? (
        <SkeletonList />
      ) : (
        <>
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
              <Input placeholder="Enter a name for the DAO" disabled />
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
              label={<span id="baseInfo_metadata_logoUrl">Logo</span>}
            >
              <IPFSUpload
                maxFileCount={1}
                needCheckImgSize
                accept=".png,.jpg"
                uploadText="Click to Upload"
                uploadIconColor="#1A1A1A"
                tips="Formats supported: PNG and JPG. Ratio: 1:1 , less than 1 MB."
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
          </Form>
          <ButtonCheckLogin onClick={handleSave} type="primary">
            Save changes
          </ButtonCheckLogin>
        </>
      )}
    </div>
  );
};

export default EditDao;
