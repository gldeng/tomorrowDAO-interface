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

export const percentageRule: Rule = {
  required: true,
  type: 'integer',
  min: 1,
  max: 100,
  message: 'Please input a integer number larger than 0 and smaller than 100',
};
type TPercentageRuleCreate = (min: number, max: number, msg: string) => Rule;

export const createPercentageRule: TPercentageRuleCreate = (min, max, msg) => {
  return {
    required: true,
    type: 'integer',
    min: min,
    max: max,
    message: msg,
  };
};

export const min2maxIntegerRule: Rule[] = [
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
        return Promise.reject(`Please input a number not larger than ${Number.MAX_SAFE_INTEGER}`);
      }
      return Promise.resolve();
    },
  },
];
