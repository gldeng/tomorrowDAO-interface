import { Button } from 'aelf-design';
import { memo, useState } from 'react';
import { message } from 'antd';
import { useCommitment } from 'provider/CommitmentProvider';
import { EyeOutlined, EyeInvisibleOutlined, CopyOutlined } from '@ant-design/icons';

const getOmittedStr = (str: string, preLen?: number, endLen?: number) => {
  if (!str || typeof str !== 'string') {
    return str;
  }
  if (typeof preLen !== 'number' || typeof endLen !== 'number') {
    return str;
  }
  if (str.length <= preLen + endLen) {
    return str;
  }
  if (preLen === 0 || endLen === 0) {
    return str;
  }

  return `${str.slice(0, preLen)}...${str.slice(-endLen)}`;
};

interface ICommitmentInfoProps {
  proposalId: string;
}

const CommitmentInfo = (props: ICommitmentInfoProps) => {
  const { commitmentHex, preimage, regenerateCommitment } = useCommitment();

  const [showPreimage, setShowPreimage] = useState(false);

  const handleCopyPreimage = () => {
    navigator.clipboard.writeText(preimage ?? '');
    message.success('Copied to clipboard');
  };

  const maskedPreimage = preimage ? '•'.repeat(preimage.length) : '';

  return (
    <div className="flex justify-between flex-col lg:flex-row">
      <div
        className={`my-info-wrap flex flex-col border border-Neutral-Divider border-solid rounded-lg bg-white lg:px-8 px-[16px] py-6`}
      >
        <div className="card-title mb-[24px]">Commitment</div>

        <div className="flex items-center gap-4">
          <span className="card-sm-text-bold">
            Hash: {getOmittedStr(commitmentHex ?? '', 10, 0)}
          </span>

          <Button
            type="primary"
            size="medium"
            millisecondOfDebounce={1000}
            className="whitespace-nowrap"
            onClick={() => regenerateCommitment()}
          >
            Re-generate
          </Button>
        </div>

        {/* Add preimage display section */}
        <div className="mt-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="card-sm-text-bold">Secret Note:</span>
            <button
              onClick={() => setShowPreimage(!showPreimage)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {showPreimage ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </button>
            <button onClick={handleCopyPreimage} className="p-1 hover:bg-gray-100 rounded">
              <CopyOutlined />
            </button>
          </div>
          <span className="font-mono">{showPreimage ? preimage : maskedPreimage}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(CommitmentInfo);
