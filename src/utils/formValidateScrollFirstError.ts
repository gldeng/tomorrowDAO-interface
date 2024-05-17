import { FormInstance } from 'antd';
import { IFormValidateError } from 'types';

export default function formValidateScrollFirstError(
  form: FormInstance,
  error: IFormValidateError,
) {
  console.log('error', error);
  if (error?.errorFields?.length) {
    const firstField = error.errorFields[0].name;
    form.scrollToField(firstField);
  }
}
