import { FormInstance } from 'antd';
import { useContext, useEffect } from 'react';
import { StepEnum, StepsContext } from '../../type';

export const useRegisterForm = (form: FormInstance, stepEnum: StepEnum) => {
  const { stepForm, onLoad } = useContext(StepsContext);
  useEffect(() => {
    onLoad?.(form);
    if (stepForm[stepEnum].submitedRes) {
      form.setFieldsValue(stepForm[stepEnum].submitedRes);
    }
  }, [form]);
};
