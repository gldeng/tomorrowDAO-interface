import { Radio, DatePicker, InputNumber } from 'antd';
import type { RadioChangeEvent, InputNumberProps } from 'antd';
import { useState } from 'react';
import { ActiveEndTimeEnum } from '../../type';
import dayjs from 'dayjs';
import { AddOutlined, MinusOutlined } from '@aelf-design/icons';
import './index.css';

interface IActiveEndTimeProps {
  value?: number[] | number;
  onChange?: (value: number[] | number) => void;
}
export const defaultActiveEndTimeDuration = [0, 0, 1];

interface IInputNumberWithIncreaseProps extends InputNumberProps {
  onAdd?: () => void;
  onMinus?: () => void;
}
const InputNumberWithIncrease = (props: IInputNumberWithIncreaseProps) => {
  return (
    <InputNumber
      {...props}
      addonBefore={
        <div onClick={props.onMinus} className="active-time-end-addon">
          <MinusOutlined />
        </div>
      }
      addonAfter={
        <div onClick={props.onAdd} className="active-time-end-addon">
          <AddOutlined />
        </div>
      }
      controls={false}
    />
  );
};
export default function ActiveEndTime(props: IActiveEndTimeProps) {
  const { value: propsValue, onChange } = props;
  const [value, setValue] = useState<ActiveEndTimeEnum>(ActiveEndTimeEnum.duration);
  const handleChange = (e: RadioChangeEvent) => {
    const { onChange } = props;
    const { value } = e.target;
    if (value === ActiveEndTimeEnum.duration) {
      onChange?.(defaultActiveEndTimeDuration);
    }
    if (value === ActiveEndTimeEnum.custom) {
      onChange?.(dayjs().add(1, 'day').valueOf());
    }
    setValue(value);
  };

  const updateDuration = (index: number, value: number | string | null) => {
    if (typeof value === 'string') {
      value = Number(value);
    }
    value = value ?? 0;
    if (!Array.isArray(propsValue)) {
      return;
    }
    const newDuration = [...propsValue];
    newDuration[index] = value;
    onChange?.(newDuration);
  };
  const addDuration = (index: number) => {
    if (!Array.isArray(propsValue)) {
      return;
    }
    const newDuration = [...propsValue];
    newDuration[index] = newDuration[index] + 1;
    onChange?.(newDuration);
  };
  const minusDuration = (index: number) => {
    if (!Array.isArray(propsValue)) {
      return;
    }
    const newDuration = [...propsValue];
    newDuration[index] = Math.max(0, newDuration[index] - 1);
    onChange?.(newDuration);
  };
  return (
    <div className="active-time-end-wrap">
      <div>
        <Radio.Group onChange={handleChange} value={value}>
          <Radio value={ActiveEndTimeEnum.duration}>
            <span className="card-sm-text-bold">Duration</span>
          </Radio>
          <Radio value={ActiveEndTimeEnum.custom}>
            <span className="card-sm-text-bold">Specific date & time</span>
          </Radio>
        </Radio.Group>
      </div>
      <div className="active-start-time-date-picker">
        {value === ActiveEndTimeEnum.custom && typeof propsValue === 'number' && (
          <DatePicker
            showTime
            defaultValue={dayjs().add(1, 'day')}
            onChange={(value) => {
              const { onChange } = props;
              onChange?.(value?.valueOf());
            }}
          />
        )}
        {value === ActiveEndTimeEnum.duration && Array.isArray(propsValue) && (
          <div className="active-time-end-input">
            <div>
              <p className="card-sm-text-bold">Minutes</p>
              <InputNumberWithIncrease
                min={0}
                defaultValue={defaultActiveEndTimeDuration[0]}
                onChange={(value: number | string | null) => {
                  updateDuration(0, value);
                }}
                value={propsValue[0]}
                onAdd={() => {
                  addDuration(0);
                }}
                onMinus={() => {
                  minusDuration(0);
                }}
              />
            </div>
            <div>
              <p className="card-sm-text-bold">Hours</p>
              <InputNumberWithIncrease
                min={0}
                defaultValue={defaultActiveEndTimeDuration[1]}
                onChange={(value: number | string | null) => {
                  updateDuration(1, value);
                }}
                value={propsValue[1]}
                onAdd={() => {
                  addDuration(1);
                }}
                onMinus={() => {
                  minusDuration(1);
                }}
              />
            </div>
            <div>
              <p className="card-sm-text-bold">Days</p>
              <InputNumberWithIncrease
                min={0}
                defaultValue={defaultActiveEndTimeDuration[2]}
                onChange={(value: number | string | null) => {
                  updateDuration(2, value);
                }}
                value={propsValue[2]}
                onAdd={() => {
                  addDuration(2);
                }}
                onMinus={() => {
                  minusDuration(2);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
