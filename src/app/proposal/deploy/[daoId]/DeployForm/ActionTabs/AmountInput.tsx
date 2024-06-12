import React, { useMemo } from 'react';
import { InputNumber, Select, Form, SelectProps } from 'antd';
import { divDecimals } from 'utils/calculate';
import BigNumber from 'bignumber.js';

interface IAmountInputValue {
  amount?: number | null;
  symbol?: string;
}
interface AmountInputProps {
  daoId: string;
  value?: IAmountInputValue;
  onChange?: (value: IAmountInputValue) => void;
  selectOptions: SelectProps['options'];
  treasuryAssetsData?: ITreasuryAssetsRes;
}
export default function AmountInput(props: AmountInputProps) {
  const { value, onChange, treasuryAssetsData, selectOptions } = props;

  const handleAmountChange = (amount: number | null) => {
    console.log(111, amount);
    onChange?.({
      ...value,
      amount,
    });
  };
  const handleSelectChange = (symbol?: string) => {
    onChange?.({
      ...value,
      symbol,
    });
  };
  const { status } = Form.Item.useStatus();
  const balance = useMemo(() => {
    const symbolInfo = treasuryAssetsData?.data.asserts?.find(
      (item) => item.symbol === value?.symbol,
    );
    if (!symbolInfo) return '-';
    return divDecimals(symbolInfo?.amount, symbolInfo?.decimal)
      .dp(symbolInfo.decimal, BigNumber.ROUND_DOWN)
      .toString();
  }, [treasuryAssetsData, value?.symbol]);

  return (
    <div className={`relative amount-wrap ${status}`}>
      <InputNumber
        className="amount-input flex-1 w-full"
        placeholder={`Enter amount`}
        value={value?.amount}
        onChange={handleAmountChange}
        controls={false}
      />
      {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
      <div className="amount-select-wrap">
        <Select
          size="small"
          className="amount-select"
          onChange={handleSelectChange}
          value={value?.symbol}
          options={selectOptions}
        />
        <p className="mt-[8px]">Balance: {balance}</p>
      </div>
    </div>
  );
}
