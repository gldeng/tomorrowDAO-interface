'use client';

import { Button, Input, Tooltip } from 'aelf-design';
import { Form, Radio, Select, InputNumber, FormInstance } from 'antd';
import { ResponsiveSelect } from 'components/ResponsiveSelect';
import { memo, useEffect } from 'react';
import InputSlideBind from '../InputSlideBind';
import {
  maximalAbstentionThresholdMap,
  maximalRejectionThresholdMap,
  minimalApproveThresholdMap,
  minimalRequiredThresholdMap,
  percentageRule,
} from '../utils';

const governanceMechanismList = [
  {
    governanceSchemeId: 'governanceSchemeId1',
    name: 'Referendum',
  },
  {
    governanceSchemeId: 'governanceSchemeId2',
    name: 'Association',
  },
  {
    governanceSchemeId: 'governanceSchemeId3',
    name: 'Parliament',
  },
  {
    governanceSchemeId: 'governanceSchemeId4',
    name: 'Customed',
  },
];

const { Option } = Select;
interface GovernanceSchemeFormProps {
  form: FormInstance;
  keyPrefix: string;
}
const defaultId = governanceMechanismList[0].governanceSchemeId;
const GovernanceSchemeForm: React.FC<GovernanceSchemeFormProps> = (props) => {
  const { form, keyPrefix } = props;
  const governance_scheme_id =
    Form.useWatch([keyPrefix, 'governance_scheme_id'], form) ?? defaultId;
  const governanceName = (governanceMechanismList.find(
    (item) => item.governanceSchemeId === governance_scheme_id,
  )?.name ?? '') as keyof typeof minimalApproveThresholdMap;
  const governanceNameAlias = governanceName as keyof typeof minimalRequiredThresholdMap;

  useEffect(() => {
    form.setFieldValue([keyPrefix, 'governance_scheme_threshold'], {
      minimal_vote_threshold: undefined,
      minimal_required_threshold: undefined,
      minimal_approve_threshold: minimalApproveThresholdMap[governanceName]?.default,
      maximal_rejection_threshold: maximalRejectionThresholdMap[governanceName]?.default,
      maximal_abstention_threshold: maximalAbstentionThresholdMap[governanceName]?.default,
    });
  }, [governanceName]);

  return (
    <>
      <Form.Item
        name={[keyPrefix, 'governance_scheme_id']}
        label={<span className="form-item-label">Select a governance model</span>}
        rules={[{ required: true, message: 'Please select governance model' }]}
        initialValue={defaultId}
      >
        <ResponsiveSelect
          popupClassName="governance-model-select"
          drawerProps={{
            title: 'Governance Model',
          }}
          options={governanceMechanismList.map((item) => {
            return {
              label: item.name,
              value: item.governanceSchemeId,
            };
          })}
        >
          {governanceMechanismList.map((item) => {
            return (
              <Option key={item.governanceSchemeId} value={item.governanceSchemeId}>
                {item.name}
              </Option>
            );
          })}
        </ResponsiveSelect>
      </Form.Item>
      {/* address number or  proportion*/}
      {governance_scheme_id === defaultId ? (
        // number
        <Form.Item
          dependencies={[keyPrefix, 'governance_scheme_id']}
          name={[keyPrefix, 'governance_scheme_threshold', 'minimal_required_threshold']}
          label={
            <Tooltip title="The minimum number of addresses required to participate in the voting of proposals.">
              <span className="form-item-label">Minimum number of addresses</span>
            </Tooltip>
          }
          rules={[
            {
              required: true,
              type: 'integer',
              min: 1,
              max: 99999999999,
              message:
                'Please input a integer number not smaller than 1 and not larger than 100,000,000,000',
            },
          ]}
        >
          <InputNumber placeholder="The number should ≥ 1" controls={false} />
        </Form.Item>
      ) : (
        // proportion
        <Form.Item
          dependencies={[keyPrefix, 'governance_scheme_id']}
          name={[keyPrefix, 'governance_scheme_threshold', 'minimal_required_threshold']}
          label={
            <Tooltip
              title={
                governanceNameAlias === defaultId
                  ? 'The minimum number of addresses required to participate in the voting of proposals.'
                  : 'The minimum proportion of participating addresses to total organization addresses required to finalize a proposal.'
              }
            >
              <span className="form-item-label">Minimum number of addresses</span>
            </Tooltip>
          }
          rules={[percentageRule, ...minimalRequiredThresholdMap[governanceNameAlias].validator]}
        >
          <InputSlideBind
            type="approve"
            placeholder={minimalApproveThresholdMap[governanceName]?.placeholder}
          />
        </Form.Item>
      )}

      <Form.Item
        name={[keyPrefix, 'governance_scheme_threshold', 'minimal_vote_threshold']}
        label={
          <Tooltip title="The minimum number of votes required to finalize a proposal. Only applicable to proposals with 1 token 1 vote proposals.">
            <span className="form-item-label">Minimum votes to finalize a proposal</span>
          </Tooltip>
        }
        dependencies={[
          ['governance_scheme_threshold', 'minimal_required_threshold'],
          [keyPrefix, 'governance_scheme_id'],
        ]}
        rules={[
          {
            required: true,
            type: 'integer',
            message: 'Please input a integer number',
          },
          {
            validator(rule, value) {
              if (value < 1) {
                return Promise.reject('Please input a number not smaller than 1.');
              }
              return Promise.resolve();
            },
          },
          {
            validator(rule, value) {
              if (value >= Number.MAX_SAFE_INTEGER) {
                return Promise.reject(
                  `Please input a number not larger than ${Number.MAX_SAFE_INTEGER}`,
                );
              }
              return Promise.resolve();
            },
          },
          {
            validator(rule, value) {
              if (
                value <
                form.getFieldValue(['governance_scheme_threshold', 'minimal_required_threshold'])
              ) {
                return Promise.reject(
                  'Each address should cast at least one vote, so the total number of votes should be greater than or equal to the number of addresses voting.',
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber
          placeholder="Refer to the governance token circulation to give a reasonable value"
          controls={false}
        />
      </Form.Item>

      {/* approve rejection abstention */}
      <Form.Item
        dependencies={[keyPrefix, 'governance_scheme_id']}
        name={[keyPrefix, 'governance_scheme_threshold', 'minimal_approve_threshold']}
        label={<span className="form-item-label">Minimum percentage of approve votes</span>}
        initialValue={minimalApproveThresholdMap[governanceName]?.default}
        rules={[percentageRule, ...minimalApproveThresholdMap[governanceName].validator]}
      >
        <InputSlideBind
          type="approve"
          placeholder={minimalApproveThresholdMap[governanceName]?.placeholder}
        />
      </Form.Item>
      <Form.Item
        dependencies={[keyPrefix, 'governance_scheme_id']}
        name={[keyPrefix, 'governance_scheme_threshold', 'maximal_rejection_threshold']}
        label={<span className="form-item-label">Maximum percentage of reject votes</span>}
        initialValue={maximalRejectionThresholdMap[governanceName]?.default}
        rules={[percentageRule, ...maximalRejectionThresholdMap[governanceName].validator]}
      >
        <InputSlideBind
          type="rejection"
          placeholder={maximalRejectionThresholdMap[governanceName]?.placeholder}
        />
      </Form.Item>
      <Form.Item
        dependencies={[keyPrefix, 'governance_scheme_id']}
        name={[keyPrefix, 'governance_scheme_threshold', 'maximal_abstention_threshold']}
        label={<span className="form-item-label">Maximum percentage of abstain votes</span>}
        initialValue={maximalAbstentionThresholdMap[governanceName]?.default}
        rules={[percentageRule, ...maximalAbstentionThresholdMap[governanceName].validator]}
      >
        <InputSlideBind
          type="abstention"
          placeholder={maximalAbstentionThresholdMap[governanceName]?.placeholder}
        />
      </Form.Item>
    </>
  );
};

export default memo(GovernanceSchemeForm);
