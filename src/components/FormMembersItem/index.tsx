import { Form, Switch, Radio, FormInstance } from 'antd';
import { Input, Typography, Tooltip, Button } from 'aelf-design';
import { AddCircleOutlined, DeleteOutlined, MinusCircleOutlined } from '@aelf-design/icons';
import { ReactComponent as QuestionIcon } from 'assets/imgs/question-icon.svg';
import './index.css';

interface IFormMembersProps {
  name: string | string[];
  initialValue: string[];
  form: FormInstance;
}
function FormMembersItem(props: IFormMembersProps) {
  const { name, initialValue, form } = props;
  const fields = Form.useWatch(name, form);
  return (
    <>
      <div>
        <Tooltip
          title={
            <div>
              There is no limit on the number of addresses on your multisig. Addresses can create
              proposals, create and approve transactions, and suggest changes to the DAO settings
              after creation.
            </div>
          }
        >
          <span className="flex items-center form-item-title gap-[8px] pb-[8px]  w-[max-content]">
            Multisig Members Address
            <QuestionIcon className="cursor-pointer " width={16} height={16} />
          </span>
        </Tooltip>
      </div>
      <Form.List
        name={name}
        rules={[
          {
            validator: async (_, names) => {
              console.log('names', names);
              if (!names || names.length < 1) {
                return Promise.reject(new Error('At least 1 passengers'));
              }
            },
          },
        ]}
        initialValue={initialValue}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                // label={index === 0 ? 'Passengers' : ''}
                required={false}
                key={field.key}
                className="dynamic-form-item-wrap"
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      message: 'please input address',
                    },
                  ]}
                  noStyle
                >
                  <Input placeholder="passenger name" />
                </Form.Item>
                {fields.length > 1 ? (
                  <div className="text-[24px] cursor-pointer">
                    <MinusCircleOutlined
                      className="dynamic-button-icon"
                      onClick={() => remove(field.name)}
                    />
                  </div>
                ) : null}
              </Form.Item>
            ))}
            <div className="flex justify-between dynamic-form-buttons">
              <Button
                className="dynamic-form-buttons-item"
                type="default"
                onClick={() => add()}
                icon={
                  <span className="text-[14px] ">
                    <AddCircleOutlined />
                  </span>
                }
              >
                Add address
              </Button>
              <Button
                type="default"
                onClick={() => {
                  form.setFieldValue(name, [undefined]);
                }}
                className="dynamic-form-buttons-item"
                icon={
                  <span className="text-[14px]">
                    <DeleteOutlined />
                  </span>
                }
              >
                Delete all
              </Button>
              <Form.ErrorList errors={errors} />
            </div>
          </>
        )}
      </Form.List>
      <div className="mt-[32px]">
        <div className="flex justify-between">
          <span className="flex items-center form-item-title pb-[8px] justify-between">
            Total Addresses
          </span>
          <span className="text-[16px] leading-[24px] font-medium text-neutralPrimaryText">
            {fields?.length ?? initialValue.length}
          </span>
        </div>
        <p className="text-[12px] leading-[20px] text-Neutral-Secondary-Text mb-[32px]">
          Your connected wallet was automatically added to the list. You can remove it if you like.
        </p>
      </div>
    </>
  );
}

export default FormMembersItem;
