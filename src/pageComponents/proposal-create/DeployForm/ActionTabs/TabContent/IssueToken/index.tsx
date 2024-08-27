import { Form, InputNumber } from 'antd';
import { Input, HashAddress } from 'aelf-design';
import { fetchTokenIssue } from 'api/request';
import { curChain } from 'config';
import { useRef } from 'react';
import { divDecimals, timesDecimals } from 'utils/calculate';
import BigNumber from 'bignumber.js';
import useResponsive from 'hooks/useResponsive';
import './index.css';

const symbolNamePath = ['issueObj', 'symbol'];
const amountNamePath = ['issueObj', 'amount'];
const issueToNamePath = ['issueObj', 'to'];

interface IIssueTokenProps {
  governanceMechanismList: TGovernanceSchemeList;
}
export default function IssueToken(props: IIssueTokenProps) {
  const { governanceMechanismList } = props;
  const form = Form.useFormInstance();
  const currentSymbol = useRef<ITokenIssueRes['data']>();
  const { isLG } = useResponsive();
  return (
    <div className="issue-token-form">
      <p className="org-address normal-text">
        <div> Organisation address:</div>
        {governanceMechanismList?.[0]?.schemeAddress && (
          <HashAddress
            chain={curChain}
            preLen={isLG ? 8 : 0}
            endLen={isLG ? 8 : 0}
            address={governanceMechanismList?.[0]?.schemeAddress}
          />
        )}
      </p>
      <Form.Item
        validateFirst
        rules={[
          {
            required: true,
            message: 'Symbol is required',
          },
          {
            validator: (_, value) => {
              const reqParams = {
                symbol: value ?? '',
                chainId: curChain,
              };
              return new Promise<void>((resolve, reject) => {
                fetchTokenIssue(reqParams)
                  .then((res) => {
                    currentSymbol.current = res?.data;
                    if (!res?.data?.totalSupply) {
                      reject(new Error('The token has not yet been issued'));
                    }
                    resolve();
                  })
                  .catch(() => {
                    reject(new Error('The token has not yet been issued.'));
                  });
              });
            },
          },
        ]}
        validateTrigger="onBlur"
        name={symbolNamePath}
        label={<span className="form-item-label">Symbol</span>}
        className="governance-token-item"
      >
        <Input
          placeholder="Enter a token symbol"
          onBlur={() => {
            const token = form.getFieldValue(symbolNamePath);
            form.setFieldValue(symbolNamePath, token?.toUpperCase());
          }}
        />
      </Form.Item>
      <Form.Item
        dependencies={[symbolNamePath]}
        name={amountNamePath}
        validateFirst
        rules={[
          {
            required: true,
          },
          {
            validator: (_, value) => {
              if (value <= 0) {
                return Promise.reject(new Error('The amount must be greater than 0'));
              } else {
                return Promise.resolve();
              }
            },
          },
          {
            validator: (_, value) => {
              const symbol = form.getFieldValue(symbolNamePath);
              if (!symbol) {
                return Promise.reject(new Error('Please enter symbol'));
              }
              return new Promise<void>((resolve, reject) => {
                const reqParams = {
                  symbol,
                  chainId: curChain,
                };
                fetchTokenIssue(reqParams)
                  .then((res) => {
                    const { totalSupply, decimals, supply } = res?.data ?? {};
                    if (
                      typeof decimals !== 'number' ||
                      typeof totalSupply !== 'number' ||
                      typeof supply !== 'number'
                    ) {
                      return reject(new Error('miss token info'));
                    }
                    const inputAmount = timesDecimals(value, decimals);
                    const decimalPlaces = BigNumber(value).decimalPlaces();
                    if (decimalPlaces && decimalPlaces > decimals) {
                      return reject(
                        new Error(`The maximum number of decimal places is ${decimals}`),
                      );
                    }
                    const inputTotal = BigNumber(totalSupply - supply);
                    if (inputTotal.lt(inputAmount)) {
                      return reject(
                        new Error(
                          `The maximum amount that can be issued: ${divDecimals(
                            inputTotal,
                            decimals,
                          ).toFormat()}`,
                        ),
                      );
                    }
                    resolve();
                  })
                  .catch((err) => {
                    console.error(err);
                    reject(new Error('get token info error'));
                  });
              });
            },
          },
        ]}
        label={<span className="form-item-label">Amount</span>}
      >
        <InputNumber
          placeholder="Please enter the amount you want to issue"
          className="w-full"
          controls={false}
        />
      </Form.Item>
      <Form.Item
        name={issueToNamePath}
        label={<span className="form-item-label">Issue To</span>}
        validateFirst
        rules={[
          {
            required: true,
            message: 'The address is required',
          },
          {
            validator: (_, value) => {
              return new Promise<void>((resolve, reject) => {
                if (value.endsWith(`AELF`)) {
                  reject(new Error('Must be a SideChain address'));
                }
                if (!value.startsWith(`ELF`) || !value.endsWith(curChain)) {
                  reject(new Error('Must be a valid address'));
                }
                resolve();
              });
            },
          },
        ]}
      >
        <Input type="text" placeholder={`Enter ELF_..._${curChain}`} />
      </Form.Item>
    </div>
  );
}
