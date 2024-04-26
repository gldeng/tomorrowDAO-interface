'use client';

import { Form } from 'antd';
import { memo, useState } from 'react';
import ProposalType from './ProposalType';
import ProposalInfo from './ProposalInfo';
import clsx from 'clsx';

interface IGovernanceModelProps {
  daoId: string;
}
const GovernanceModel = (props: IGovernanceModelProps) => {
  const [form] = Form.useForm();
  const [isNext, setNext] = useState(false);
  const title = Form.useWatch(['proposal_basic_info', 'proposal_title'], form);
  const description = Form.useWatch(['proposal_basic_info', 'proposal_description'], form);
  const { daoId } = props;
  // const [isCheck, setIsCheck] = useState(false);
  return (
    <div className="deploy-proposal-form mt-[24px] mb-[24px]">
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        requiredMark={false}
        scrollToFirstError={true}
        onValuesChange={(changedValues) => {
          if (changedValues?.transaction?.to_address) {
            form.setFieldValue(['transaction', 'contractMethodName'], '');
            form.setFieldValue(['transaction', 'params'], '');
          }
        }}
      >
        <ProposalType
          className={clsx({ hidden: isNext })}
          next={() => {
            setNext(true);
          }}
        />
        <ProposalInfo className={clsx({ hidden: !isNext })} daoId={daoId} />
      </Form>
    </div>
  );
};

export default memo(GovernanceModel);
