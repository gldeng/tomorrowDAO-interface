import { useContext, useMemo, useState } from 'react';
import { Typography, FontWeightEnum } from 'aelf-design';
import { Form, InputNumber } from 'antd';
import IPFSUpload, { IFUploadProps } from 'components/IPFSUpload';
import './index.css';
import { FilesSubmitedRes, StepEnum, StepsContext } from '../../type';
import { useRegisterForm } from '../utils';

const { Title } = Typography;

const FILE_LIMIT = '20M';
const MAX_FILE_COUNT = 3;
const MAX_FILE_NAME_LENGTH = 128;
export default function ContractsAndFiles() {
  const [form] = Form.useForm();
  useRegisterForm(form, StepEnum.step3);
  const { stepForm } = useContext(StepsContext);

  const fileList = Form.useWatch('files', form) ?? [];

  const isUploadDisabled = useMemo(() => {
    return fileList.length >= MAX_FILE_COUNT;
  }, [fileList.length]);

  const uploadTips = useMemo(() => {
    if (isUploadDisabled) {
      return `You have reached the upload limit of ${MAX_FILE_COUNT} files. Please remove an existing file to upload a new one, or add the telegram group if you need assistance with managing your files.`;
    } else {
      return `Only supports .pdf format less than ${FILE_LIMIT}.`;
    }
  }, [isUploadDisabled]);

  return (
    <div className="contracts-and-files">
      <Title className="primary-text" level={6} fontWeight={FontWeightEnum.Medium}>
        Documentations
      </Title>
      <Title className="secondary-text">
        It is recommended to upload at least a white paper and roadmap.
      </Title>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        requiredMark={false}
        scrollToFirstError={true}
        onValuesChange={(_a, values) => {
          stepForm[StepEnum.step3].submitedRes = values;
        }}
      >
        <Form.Item
          name={'files'}
          validateFirst={true}
          rules={[
            {
              required: true,
              type: 'array',
              min: 1,
              max: 20,
              message:
                'add at least one documentation，If you reach the upload limit of 20 files. Please remove an existing file to upload a new one, or add the telegram group if you need assistance with managing your files.',
            },
          ]}
          valuePropName="fileList"
          initialValue={[]}
        >
          <IPFSUpload
            className="upload"
            isAntd
            accept=".pdf"
            fileLimit={FILE_LIMIT}
            maxCount={MAX_FILE_COUNT}
            fileNameLengthLimit={MAX_FILE_NAME_LENGTH}
            uploadIconColor="#1A1A1A"
            uploadText="Click to upload"
            tips={uploadTips}
            disabled={isUploadDisabled}
          />
        </Form.Item>
      </Form>
    </div>
  );
}
