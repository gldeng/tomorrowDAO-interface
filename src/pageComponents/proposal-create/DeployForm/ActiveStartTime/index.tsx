import { Radio, DatePicker } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useState } from 'react';
import { ActiveStartTimeEnum } from '../../type';
import dayjs from 'dayjs';
import './index.css';

interface IActiveStartTimeProps {
  value?: string | number;
  onChange?: (value: string | number | undefined) => void;
}

export default function ActiveStartTime(props: IActiveStartTimeProps) {
  const { value: propsValue } = props;
  const [value, setValue] = useState<ActiveStartTimeEnum>(ActiveStartTimeEnum.now);
  const handleChange = (e: RadioChangeEvent) => {
    const { onChange } = props;
    const { value } = e.target;
    if (value === ActiveStartTimeEnum.now) {
      onChange?.(value);
    }
    if (value === ActiveStartTimeEnum.custom) {
      onChange?.(dayjs().valueOf());
    }
    setValue(value);
  };
  return (
    <div>
      <div>
        <Radio.Group onChange={handleChange} value={value}>
          <Radio value={ActiveStartTimeEnum.now}>Now</Radio>
          <Radio value={ActiveStartTimeEnum.custom}>Specific date & time</Radio>
        </Radio.Group>
      </div>
      <div className="active-start-time-date-picker">
        {value === ActiveStartTimeEnum.custom && (
          <DatePicker
            defaultValue={dayjs()}
            showTime
            value={propsValue ? dayjs(propsValue) : undefined}
            onChange={(value) => {
              const { onChange } = props;
              onChange?.(value?.valueOf());
            }}
          />
        )}
      </div>
    </div>
  );
}
