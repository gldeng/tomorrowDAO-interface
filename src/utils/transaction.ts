const checkIsOut = (address: string, record: IAddressTransferListDataListItem) => {
  const { from, to, isCrossChain } = record;
  if (isCrossChain === 'Transfer' || isCrossChain === 'no') {
    if (from === address) {
      return true;
    }
    return false;
  }
  // isCrossChain: Receive
  if (to === address) {
    return false;
  }
  return true;
};
export { checkIsOut };
