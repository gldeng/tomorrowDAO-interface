'use client';

import { Input, Tooltip } from 'aelf-design';
import { Form, InputNumber } from 'antd';
import { memo, useContext, useMemo } from 'react';
import { useRequest } from 'ahooks';
import InputSlideBind from 'components/InputSlideBind';
import { integerRule, min2maxIntegerRule, validatorCreate, useRegisterForm } from '../utils';
import { StepEnum, StepsContext } from '../../type';
import { useSelector } from 'redux/store';
import { fetchContractInfo } from 'api/request';
import { ElectionContractName } from 'config/index';
import './index.css';

const HighCouncil = () => {
  const [form] = Form.useForm();
  const elfInfo = useSelector((store) => store.elfInfo.elfInfo);
  const daoCreateToken = useSelector((store) => store.daoCreate.token);
  const { stepForm } = useContext(StepsContext);
  console.log('daoCreateToken', daoCreateToken);
  useRegisterForm(form, StepEnum.step2);
  const { data } = useRequest(() => {
    return fetchContractInfo({
      chainId: elfInfo.curChain,
    });
  });
  const electionContractAddress = useMemo(() => {
    const electionContract = data?.data.contractInfoList.find(
      (item) => item?.contractName === ElectionContractName,
    );
    return electionContract?.contractAddress;
  }, [data]);
  const metaData = stepForm[StepEnum.step0].submitedRes;
  const disabled = !metaData?.governanceToken;
  return (
    <div className="high-council-form">
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        requiredMark={false}
        scrollToFirstError={true}
      >
        <div>
          <h2 className="form-title-primary cursor-pointer">High Council</h2>
          <p className="font-normal text-neutralPrimaryText text-[16px] leading-[24px] mb-[48px]">
            High Council is a collection of top-ranked addresses who staked and are voted by
            govemance tokens in a specific smart contract with primary governance responsibilities
            for the DAO. Its members may have certain governance or sensitive permissions.
          </p>
        </div>

        <Form.Item
          label={
            <Tooltip title="After initially staking a certain amount of tokens in the Election contract, you will be able to receive votes from other addresses. Stakers with a higher number of votes will become members of the High Council.">
              <span className="form-item-label">Election contract</span>
            </Tooltip>
          }
        >
          <Input disabled defaultValue={electionContractAddress} />
        </Form.Item>

        <Form.Item
          name={['highCouncilConfig', 'maxHighCouncilMemberCount']}
          label={<span className="form-item-label">High Council Members</span>}
          validateFirst={true}
          rules={[
            {
              required: true,
              type: 'integer',
              min: 1,
              max: 10000,
              message: 'Supports up to 10000 High Council members',
            },
          ]}
        >
          <InputNumber
            disabled={disabled}
            placeholder="At least 7 members required"
            controls={false}
          />
        </Form.Item>
        <Form.Item
          name={['highCouncilConfig', 'maxHighCouncilCandidateCount']}
          label={<span className="form-item-label">High Council Condidate Members</span>}
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate((v) => v < 1, 'Please input a number larger than 1'),
            validatorCreate((v) => v > 10000, 'Supports up to 10000 High Council members'),
          ]}
        >
          <InputNumber disabled={disabled} placeholder="At most 10000 members" controls={false} />
        </Form.Item>
        <Form.Item
          name={['highCouncilConfig', 'lockTokenForElection']}
          label={<span className="form-item-label">Stake threshold</span>}
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate((v) => v < 1, 'Please input a number larger than 1'),
            validatorCreate(
              (v) => v > Number(daoCreateToken?.totalSupply ?? 10000),
              'The amount staked to become a HC member cannot exceed the maximum supply of the token.',
            ),
          ]}
        >
          <InputNumber
            disabled={disabled}
            placeholder="Refer to the governance token circulation to give a reasonable value."
            controls={false}
          />
        </Form.Item>
        <Form.Item
          name={['highCouncilConfig', 'electionPeriod']}
          label={
            <Tooltip title="The number of days for the rotation of High Council members, counted from the day after the DAO is created. If zero is entered, it means there is no rotation for High Council members.">
              <span className="form-item-label">High Council member term length</span>
            </Tooltip>
          }
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate(
              (v) => v > Number.MAX_SAFE_INTEGER,
              `Please input a number not larger than ${Number.MAX_SAFE_INTEGER}`,
            ),
          ]}
        >
          <InputNumber
            disabled={disabled}
            placeholder="Days that High Council members can serve in each round"
            controls={false}
            suffix="Days"
          />
        </Form.Item>
        {/* governanceSchemeThreshold */}
        <Form.Item
          name={['governanceSchemeThreshold', 'minimalRequiredThreshold']}
          label={<span className="form-item-label">Minimum voting proportion</span>}
          initialValue={75}
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate((v) => v < 75, 'Please input a number larger than 75'),
            validatorCreate((v) => v > 100, 'Please input a number smaller than 100'),
          ]}
        >
          <InputSlideBind
            disabled={disabled}
            type="approve"
            placeholder={'Suggest setting it above 50%'}
          />
        </Form.Item>

        <Form.Item
          name={['governanceSchemeThreshold', 'minimalVoteThreshold']}
          label={
            <Tooltip title="The minimum number of votes required to finalize a proposal. Only applicable to proposals with 1 token 1 vote proposals.">
              <span className="form-item-label">Minimum votes</span>
            </Tooltip>
          }
          validateFirst={true}
          rules={min2maxIntegerRule}
        >
          <InputNumber
            disabled={disabled}
            placeholder="Refer to the governance token circulation to give a reasonable value"
            controls={false}
          />
        </Form.Item>
        {/* approve rejection abstention */}

        <Form.Item
          name={['governanceSchemeThreshold', 'minimalApproveThreshold']}
          label={<span className="form-item-label">Minimum percentage of approved votes </span>}
          initialValue={67}
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate((v) => v < 67, 'Please input a number larger than 67'),
            validatorCreate((v) => v > 100, 'Please input a number smaller than 100'),
          ]}
        >
          <InputSlideBind
            disabled={disabled}
            type="approve"
            placeholder={'Suggest setting it above 50%'}
          />
        </Form.Item>
        <Form.Item
          name={['governanceSchemeThreshold', 'maximalRejectionThreshold']}
          label={<span className="form-item-label">Maximum percentage of rejected votes</span>}
          initialValue={20}
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate((v) => v === 0, 'Please input a number larger than 0'),
            validatorCreate((v) => v > 20, 'Please input a number smaller than 20'),
          ]}
        >
          <InputSlideBind
            disabled={disabled}
            type="rejection"
            placeholder={'Suggest setting it below 20%'}
          />
        </Form.Item>
        <Form.Item
          name={['governanceSchemeThreshold', 'maximalAbstentionThreshold']}
          label={<span className="form-item-label">Maximum percentage of abstain votes</span>}
          initialValue={20}
          validateFirst={true}
          rules={[
            integerRule,
            validatorCreate((v) => v === 0, 'Please input a number larger than 0'),
            validatorCreate((v) => v > 20, 'Please input a number smaller than 20'),
          ]}
        >
          <InputSlideBind
            disabled={disabled}
            type="abstention"
            placeholder={'Suggest setting it below 20%'}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default memo(HighCouncil);
