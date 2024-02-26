import { Form, Select } from 'antd';
import { Search } from 'aelf-design';

import { proposalTypeList, governanceMechanismList, proposalStatusList } from '../constants';

type PropsType = {
  form: any;
  onSearch: any;
};

export default function Filter(props: PropsType) {
  const { form, onSearch } = props;
  return (
    <div>
      <Form layout="inline" form={form} name="control-hooks">
        <Form.Item name="proposalType">
          <Select
            defaultValue="ALL"
            className="tab-all-proposals-select"
            options={proposalTypeList}
            onChange={onSearch}
            // size="small"
          />
        </Form.Item>
        <Form.Item name="governanceMechanism">
          <Select
            defaultValue="ALL"
            // size="small"
            className="tab-all-proposals-select"
            options={governanceMechanismList}
            onChange={onSearch}
          />
        </Form.Item>
        <Form.Item name="proposalStatus">
          <Select
            defaultValue="ALL"
            className="tab-all-proposals-select"
            options={proposalStatusList}
            onChange={onSearch}
            // size="small"
          />
        </Form.Item>
        <Form.Item name="content">
          <Search
            size="small"
            placeholder="Proposals Title / Description / ID"
            onChange={onSearch}
          />
        </Form.Item>
      </Form>
    </div>
  );
}
