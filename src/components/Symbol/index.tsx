import React from 'react';
import { TokenIconMap } from 'constants/token';
import './index.css';

interface SymbolProps {
  symbol: string;
}
export default function Symbol(props: SymbolProps) {
  const { symbol } = props;
  return (
    <div className="token flex items-center">
      {TokenIconMap[symbol] && <img src={TokenIconMap[symbol]} className="token-logo " alt="" />}
      {symbol}
    </div>
  );
}
