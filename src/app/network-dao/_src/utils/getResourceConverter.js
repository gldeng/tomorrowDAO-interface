/**
 * @file getResoruceConverter.js
 * @author zhouminghui
 * @description
*/

import getResourceWeight from './getResourceWeight';
import getTokenWeight from './getTokenWeight';
import getWeight from './getWeight';
import getResourceBalance from './getResourceBalance';
import getTokenBalance from './getTokenBalance';

export default function getResourceConverter(type, tokenConverterContract, tokenContract) {
  return Promise.all([
    getWeight(tokenConverterContract, type),
    getResourceBalance(tokenContract, type),
    getTokenBalance(tokenConverterContract, type),
  ]).then((result) => result.reduce((acc, v) => ({ ...v, ...acc }), {}));
}
