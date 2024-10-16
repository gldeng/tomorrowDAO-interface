import { Form, message as antdMessage, message } from 'antd';
import { Input, Tooltip, Button } from 'aelf-design';
import FormList from './FormList';

export default function Page() {
  const [form] = Form.useForm();
  return (
    <div className="deploy-proposal-form mt-[24px] mb-[24px]">
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        requiredMark={false}
        scrollToFirstError={true}
        name="dynamic_form_item"
        onChange={() => {
          console.log('change', form.getFieldsValue());
        }}
        onValuesChange={(changedValues) => {
          console.log('changedValues', changedValues, form);
        }}
      >
        <Form.Item
          name={['proposalBasicInfo', 'proposalTitle']}
          label={<span className="form-item-label">Title</span>}
          validateFirst
          rules={[
            {
              required: true,
              message: 'The proposal title is required',
            },
            {
              min: 0,
              max: 300,
              message: 'The proposal title supports a maximum of 300 characters',
            },
          ]}
        >
          <Input type="text" placeholder="Enter the title of the proposal (300 characters max)" />
        </Form.Item>
        <FormList
          name={'options'}
          form={form}
          initialValue={[
            {
              first: '1111',
            },
          ]}
        />
      </Form>

      <div className="flex justify-end mt-[100px]">
        <Button
          type="primary"
          className="w-[156px]"
          // disabled={!title || !description}
          onClick={() => {
            // onSubmit();
          }}
          loading={false}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
