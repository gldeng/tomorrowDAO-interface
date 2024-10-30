import { Button } from 'aelf-design';
import { memo, useEffect, useState } from 'react';
import { message } from 'antd';
import { useCommitment } from 'provider/CommitmentProvider';
import { EyeOutlined, EyeInvisibleOutlined, CopyOutlined } from '@ant-design/icons';
import { fetchVoterCommitment } from 'api/request';
import { useRequest } from 'ahooks';
import { useWebLogin } from 'aelf-web-login';
import { callContract } from 'contract/callContract';
import { voteAddress } from 'config';

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
  const [onChainCommitmentChecked, setOnChainCommitmentChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopyPreimage = () => {
    navigator.clipboard.writeText(preimage ?? '');
    message.success('Copied to clipboard');
  };

  const maskedPreimage = preimage ? '•'.repeat(preimage.length) : '';

  const { wallet } = useWebLogin();

  const {
    data: commitmentsData,
    loading: commitmentsDataLoading,
    run: loadCommitmentsData,
  } = useRequest(
    () => {
      return fetchVoterCommitment({
        proposalId: props.proposalId,
        voter: wallet?.address,
      });
    },
    {
      manual: true,
      ready: !!wallet?.address && !onChainCommitmentChecked,
      onSuccess: (data) => {
        setOnChainCommitmentChecked(true);
        if (data?.data.commitment != null && data.data.commitment !== '') {
          setSubmitted(true);
        }
      },
    },
  );

  const commitmentRecord: { commitmentHex: string; preimage: string } = (() => {
    const hasCommitmentData =
      commitmentsData?.data?.commitment != null && commitmentsData.data.commitment != '';
    const onChainCommitment = '0x' + commitmentsData?.data?.commitment ?? '';
    if (hasCommitmentData && onChainCommitment == commitmentHex) {
      return { commitmentHex: onChainCommitment, preimage: preimage ?? '' };
    } else {
      return { commitmentHex: commitmentHex ?? '', preimage: preimage ?? '' };
    }
  })();

  useEffect(() => {
    if (wallet?.address && !onChainCommitmentChecked) {
      loadCommitmentsData();
    }
  }, [wallet?.address, onChainCommitmentChecked]);

  useEffect(() => {
    // If not checked, do nothing
    // if checked and submitted, do nothing
    // if checked but not submitted, then generate
    const checkedAndNotSubmitted = onChainCommitmentChecked && !submitted;
    if (checkedAndNotSubmitted && commitmentRecord.commitmentHex == '') {
      regenerateCommitment();
    }
  }, [onChainCommitmentChecked, submitted, commitmentRecord]);

  const handleRegisterCommitment = async () => {
    if (submitted) {
      return;
    }
    setSubmitted(true);

    const contractParams = {
      votingItemId: props.proposalId,
      commitment: commitmentHex,
      voteAmount: 1,
    };

    callContract('RegisterCommitment', contractParams, voteAddress)
      .then((res) => {
        if (res.Error != null && res.Error != '') {
          console.error('Error submitting commitment: ', res);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div
      className={`my-info-wrap flex flex-col border border-Neutral-Divider border-solid rounded-lg bg-white lg:px-8 px-[16px] py-6`}
    >
      <div className="card-title mb-[24px]">Commitment</div>

      <div className="flex items-center gap-4">
        <span className="text-Neutral-Secondary-Text card-sm-text">Hash:</span>
        <span className="card-sm-text-bold">
          {getOmittedStr(commitmentRecord.commitmentHex ?? '', 10, 0)}
        </span>

        {submitted ? (
          <span className="text-green-600 font-medium">Submitted</span>
        ) : (
          onChainCommitmentChecked &&
          !submitted && (
            <>
              <Button
                type="primary"
                size="medium"
                millisecondOfDebounce={1000}
                className="whitespace-nowrap"
                onClick={() => regenerateCommitment()}
              >
                Re-generate
              </Button>
              <Button
                type="primary"
                size="medium"
                millisecondOfDebounce={1000}
                className="whitespace-nowrap bg-red-500 hover:bg-red-600"
                onClick={handleRegisterCommitment}
              >
                Register Commitment
              </Button>
            </>
          )
        )}
      </div>

      {/* Add preimage display section */}
      <div className="mt-4 mb-4">
        {commitmentRecord.preimage !== '' ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-Neutral-Secondary-Text card-sm-text">Secret Note:</span>
              <button
                onClick={() => setShowPreimage(!showPreimage)}
                className="hover:text-gray-500 focus:outline-none"
                style={{
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPreimage ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
              <button
                onClick={handleCopyPreimage}
                className="hover:text-gray-500 focus:outline-none"
                style={{
                  border: 'none',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CopyOutlined />
              </button>
            </div>
            <span className="font-mono">{showPreimage ? preimage : maskedPreimage}</span>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-Neutral-Secondary-Text card-sm-text">Secret Note:</span>
            <span className="text-gray-500">Not available on this device</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CommitmentInfo);
