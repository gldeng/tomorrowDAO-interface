import React, { ChangeEvent } from 'react';
import { Slider, SliderSingleProps } from 'antd';
import { Input } from 'aelf-design';
import cls from 'clsx';
import './index.css';

interface InputSlideBindProps {
  value?: number;
  onChange?: (value: number | null) => void;
  type: 'abstention' | 'rejection' | 'approve';
  placeholder?: string;
}
// const marks: SliderSingleProps['marks'] = {
//   0: '0',
//   100: '100%',
// };
const InputSlideBind = (props: InputSlideBindProps) => {
  const { value, onChange, type, placeholder } = props;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    if (Number.isNaN(num)) {
      num = 0;
    }
    onChange?.(num);
  };

  const handleProgressChange = (value: number) => {
    onChange?.(value);
  };

  return (
    <div className="input-slide-bind">
      <div className="input">
        <Input value={value} onChange={handleInputChange} placeholder={placeholder} />
      </div>
      <div className={cls('slide', type)}>
        <div
          className={cls(
            'point',
            { active: typeof value === 'number' && value >= 0 },
            { disable: !value },
          )}
        ></div>
        <Slider className="slide-wrap" value={value} onChange={handleProgressChange} />
        <div className={cls('point', { active: value && value === 100 })}></div>
      </div>
    </div>
  );
};

export default InputSlideBind;
