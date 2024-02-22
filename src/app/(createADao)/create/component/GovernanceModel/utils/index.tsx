import { Rule } from 'antd/es/form';

type TValidatorCreate = (
  failCallBack: (v: any) => boolean,
  msg: string,
) => { validator: (rule: any, value: any) => Promise<any> };
const validatorCreate: TValidatorCreate = (failCallBack, msg: string) => {
  return {
    validator(rule, value) {
      if (failCallBack(value)) {
        return Promise.reject(msg);
      }
      return Promise.resolve();
    },
  };
};

export const minimalApproveThresholdMap = {
  Referendum: {
    default: 50,
    placeholder: 'The percentage should ≥ 50%',
    validator: [
      validatorCreate((v) => v < 50, 'The percentage should ≥ 50%'),
      validatorCreate((v) => v >= 100, 'Please input a number smaller than 100'),
    ],
  },
  Association: {
    default: 60,
    placeholder: 'The percentage should ≥ 60%',
    validator: [validatorCreate((v) => v < 60, 'The percentage should ≥ 60%')],
  },
  Parliament: {
    default: 67,
    placeholder: 'The percentage should ≥ 67%',
    validator: [validatorCreate((v) => v < 67, 'The percentage should ≥ 67%')],
  },
  Customed: {
    default: 50,
    placeholder: 'Suggest setting it above 50%',
    validator: [],
  },
};
export const maximalRejectionThresholdMap = {
  Referendum: {
    default: 20,
    placeholder: 'The percentage should ≤ 20%',
    validator: [validatorCreate((v) => v > 20, 'Please input a number not larger than 20%')],
  },
  Association: {
    default: 40,
    placeholder: 'The percentage should ≤ 40%',
    validator: [validatorCreate((v) => v > 40, 'The percentage should ≤ 40%')],
  },
  Parliament: {
    default: 20,
    placeholder: 'The percentage should ≤ 20%',
    validator: [validatorCreate((v) => v > 20, 'The percentage should ≤ 20%')],
  },
  Customed: {
    default: 30,
    placeholder: 'Suggest setting it below 30%',
    validator: [],
  },
};
export const maximalAbstentionThresholdMap = {
  Referendum: {
    default: 20,
    placeholder: 'The percentage should ≤ 20%',
    validator: [validatorCreate((v) => v > 20, 'Please input a number not larger than 20%')],
  },
  Association: {
    default: 40,
    placeholder: 'The percentage should ≤ 40%',
    validator: [validatorCreate((v) => v > 40, 'The percentage should ≤ 40%')],
  },
  Parliament: {
    default: 20,
    placeholder: 'The percentage should ≤ 20%',
    validator: [validatorCreate((v) => v > 20, 'The percentage should ≤ 20%')],
  },
  Customed: {
    default: 30,
    placeholder: 'Suggest setting it below 30%',
    validator: [],
  },
};

export const minimalRequiredThresholdMap = {
  Association: {
    default: 75,
    placeholder: 'The percentage should >= 50%',
    validator: [validatorCreate((v) => v < 50, 'The percentage should >= 50%')],
  },
  Parliament: {
    default: 75,
    placeholder: 'The percentage should >= 75%',
    validator: [validatorCreate((v) => v < 75, 'The percentage should >= 75%')],
  },
  Customed: {
    default: 50,
    placeholder: 'Suggest setting is 50%',
    validator: [],
  },
};
export const percentageRule: Rule = {
  required: true,
  type: 'integer',
  min: 0,
  max: 100,
  message: 'Please input a integer number not smaller than 0 and not larger than 100',
};
