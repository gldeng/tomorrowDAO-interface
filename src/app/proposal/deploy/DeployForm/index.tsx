'use client';

import { Button, Radio } from 'aelf-design';
import { Form, Switch, Select } from 'antd';
import { memo, useState } from 'react';
import { ResponsiveSelect } from 'components/ResponsiveSelect';
import { proposalTypeList } from '../util';
import ProposalType from './ProposalType';
import ProposalInfo from './ProposalInfo';
import clsx from 'clsx';

const defaultId = proposalTypeList[0].value;
const { Option } = Select;
const GovernanceModel = () => {
  const [form] = Form.useForm();
  const [isNext, setNext] = useState(false);
  const governanceModelType = Form.useWatch('governanceModelType', form);
  const [isCheck, setIsCheck] = useState(false);
  const onHighCouncilSwitch = (checked: boolean) => {
    setIsCheck(checked);
  };
  return (
    <div className="deploy-proposal-form">
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        requiredMark={false}
        scrollToFirstError={true}
      >
        <ProposalInfo
        //   className={clsx({ hidden: !isNext })}
        />
        <ProposalType
          //   className={clsx({ hidden: isNext })}
          next={() => {
            setNext(true);
          }}
        />
        {/* {isNext ? (
        ) : (
          
        )} */}
      </Form>
      <Button
        type="primary"
        className="w-[156px] mt-[100px]"
        onClick={() => {
          console.log('form.getFieldsValue()', form.getFieldsValue());
        }}
      >
        Deploy
      </Button>
    </div>
  );
};

export default memo(GovernanceModel);
