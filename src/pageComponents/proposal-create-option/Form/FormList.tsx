import { Form, FormInstance } from 'antd';
import { Input, Tooltip, Button } from 'aelf-design';
import { AddCircleOutlined, DeleteOutlined, MinusCircleOutlined } from '@aelf-design/icons';
import { ReactComponent as QuestionIcon } from 'assets/imgs/question-icon.svg';
import './index.css';
import { curChain } from 'config';

interface ValidatorRule {
  validator: (rule: any, value: any) => Promise<void>;
}
interface IFormMembersProps {
  name: string | string[];
  initialValue: string[];
  form: FormInstance;
  hiddenExtraWhenEmpty?: boolean;
  titleNode?: React.ReactNode;
  emptyNode?: React.ReactNode;
  footNode?: React.ReactNode;
  rules?: ValidatorRule[];
  disableInput?: boolean;
}
function FormList(props: IFormMembersProps) {
  const {
    name,
    initialValue,
    form,
    hiddenExtraWhenEmpty = false,
    titleNode,
    emptyNode,
    footNode,
    rules,
    disableInput = false,
  } = props;
  const fields = Form.useWatch(name, form);

  const showNullWhenEmpty = hiddenExtraWhenEmpty && !fields?.length;
  console.log('initialValue', initialValue, name);
  return (
    <div className="dynamic-form-list">
      <Form.List name={name} rules={[...(rules ?? [])]} initialValue={initialValue}>
        {(fields, { add, remove }, { errors }) => {
          console.log('fields', fields, emptyNode && !fields?.length);
          return (
            <>
              {fields.map((field, index) => (
                <Form.Item required={false} key={field.key} className="dynamic-form-item-wrap">
                  <Form.Item name={[field.name, 'first']} validateFirst noStyle>
                    <Input placeholder={`Enter ELF_..._${curChain}`} disabled={disableInput} />
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

              <div className="dynamic-form-buttons text-neutralTitle">
                {showNullWhenEmpty ? null : footNode ? (
                  footNode
                ) : (
                  <>
                    <Button
                      className="dynamic-form-buttons-item"
                      type="default"
                      size="medium"
                      onClick={() => add()}
                      icon={<AddCircleOutlined className="text-[16px] " />}
                    >
                      <span className="card-sm-text-bold ">Add address</span>
                    </Button>
                    <Button
                      type="default"
                      size="medium"
                      onClick={() => {
                        form.setFieldValue(name, []);
                      }}
                      className="dynamic-form-buttons-item"
                      icon={<DeleteOutlined className="text-[16px]" />}
                    >
                      <span className="card-sm-text-bold ">Delete all</span>
                    </Button>
                  </>
                )}
              </div>
              {!!errors.length && (
                <div className="error-text">
                  <Form.ErrorList errors={errors} />
                </div>
              )}
            </>
          );
        }}
      </Form.List>
    </div>
  );
}

export default FormList;
