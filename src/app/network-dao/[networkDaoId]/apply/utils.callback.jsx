/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { getOriginProposedContractInputHash } from "@redux/common/util.proposed";
import { getContractAddress, getTxResult } from "@redux/common/utils";
import { useWebLogin } from "aelf-web-login";
import { callGetMethod } from "@utils/utils";
import getChainIdQuery from 'utils/url';
import { useChainSelect } from "hooks/useChainSelect";
import CopylistItem from "../../_proposal_root/components/CopylistItem";
import { getDeserializeLog } from "./utils.js";
import { get } from "../../_src/utils";
import { VIEWER_GET_CONTRACT_NAME } from "@api/url";
import { mainExplorer } from "config";
import AddressNameVer from "../../_proposal_root/components/AddressNameVer";

export const useCallbackAssem = () => {
  const common = useSelector((state) => state.common);
  const { wallet } = common;
  const { callContract } = useWebLogin();
  // eslint-disable-next-line no-return-await
  const contractSend =  async (action, params, isOriginResult) => {
    const chainIdQuery = getChainIdQuery();
    const result = await callContract({
      contractAddress: getContractAddress("Genesis"),
      args: params,
      methodName: action,
      options: {
        chainId: chainIdQuery.chainId
      }
    });
    if (isOriginResult) return result;
    if ((result && +result.error === 0) || !result.error) {
      return result;
    }
    throw new Error(
      result?.error?.message ||
        (result?.errorMessage || {}).message ||
        "Send transaction failed"
    );
  }

  return {
    contractSend,
  }
};

export const useCallGetMethod = () => {
  const common = useSelector((state) => state.common);
  const { wallet } = common;
  // eslint-disable-next-line no-return-await
  const callGetMethodSend = useCallback(
    async (contractName, action, param, fnName = "call") => {
      const result = await callGetMethod(
        {
          contractAddress: getContractAddress(contractName),
          param,
          contractMethod: action,
        },
        fnName
      );
      return result;
    },
    [wallet]
  );
  return {
    callGetMethodSend,
  }
};

export const useReleaseApprovedContractAction = () => {
  const { isSideChain } = useChainSelect()
  const proposalSelect = useSelector((state) => state.proposalSelect);
  const common = useSelector((state) => state.common);
  const { contractSend } = useCallbackAssem();
  const { aelf } = common;
  return  async (contract) => {
    const { contractMethod, proposalId } = contract;
    const proposalItem = proposalSelect.list.find(
      (item) => item.proposalId === proposalId
    );
    if (!proposalItem)
      throw new Error("Please check if the proposalId is valid");
    const res = await getDeserializeLog(
      aelf,
      proposalItem.createTxId,
      "ContractProposed"
    );
    const { proposedContractInputHash } = res ?? {};
    if (!proposedContractInputHash)
      throw new Error("Please check if the proposalId is valid");
    const param = {
      proposalId,
      proposedContractInputHash,
    };
    const result = await contractSend(contractMethod, param, true);
    let isError = false;
    if (!((result && +result.error === 0) || !result.error)) {
      isError = true;
      throw new Error(
        (result.errorMessage || {}).message ||
          result?.error?.message ||
          "Send transaction failed"
      );
    }
    const txsId =
      result?.TransactionId ||
      result?.result?.TransactionId ||
      result.transactionId ||
      "";
    const Log = await getDeserializeLog(aelf, txsId, "ProposalCreated");
    const { proposalId: newProposalId } = Log ?? "";
    return {
      visible: true,
      title:
        !isError && newProposalId
          ? "Proposal is created！"
          : "Proposal failed to be created！",
      children: (
        <div style={{ textAlign: "left" }}>
          {!isError && newProposalId ? (
            <CopylistItem
              label="Proposal ID"
              value={newProposalId ?? ""}
              // href={`/proposalsDetail/${newProposalId}`}
            />
          ) : (
            "This may be due to transaction failure. Please check it via Transaction ID:"
          )}
          <CopylistItem
            label="Transaction ID"
            isParentHref
            value={txsId}
            href={`${isSideChain ? explorer : mainExplorer}/tx/${txsId}`}
          />
        </div>
      ),
    };
  };
};

export const useReleaseCodeCheckedContractAction = () => {
  const proposalSelect = useSelector((state) => state.proposalSelect);
  const common = useSelector((state) => state.common);
  const { contractSend } = useCallbackAssem();
  const { callGetMethodSend } = useCallGetMethod();
  const { aelf } = common;
  return  async (contract, isDeploy) => {
    const { contractMethod, proposalId } = contract;
    const proposalItem = proposalSelect.list.find(
      (item) => item.proposalId === proposalId
    );
    if (!proposalItem)
      throw new Error("Please check if the proposalId is valid");
    const proposedContractInputHash =
      await getOriginProposedContractInputHash({
        txId: proposalItem.createTxId,
      });
    if (!proposedContractInputHash)
      throw new Error("Please check if the proposalId is valid");
    const param = {
      proposalId,
      proposedContractInputHash,
    };

    const result = await contractSend(contractMethod, param, true);
    let isError = false;
    if (!((result && +result.error === 0) || !result.error)) {
      isError = true;
      throw new Error(
        (result.errorMessage || {}).message ||
          result?.error?.message ||
          "Send transaction failed"
      );
    }
    const txsId =
      result?.TransactionId ||
      result?.result?.TransactionId ||
      result.transactionId ||
      "";
    let txResult;
    if (result.data) {
      // portkey sdk login
      txResult = result.data;
    } else {
      txResult = await getTxResult(aelf, txsId ?? "");
    }
    if (!txResult) {
      throw Error("Can not get transaction result.");
    }

    if (txResult.Status.toLowerCase() === "mined") {
      isError = false;
    } else {
      isError = true;
    }
    let contractAddress = "";
    let contractVersion = "";
    if (!isError) {
      const logs = await getDeserializeLog(aelf, txsId, [
        "ContractDeployed",
        "CodeUpdated",
      ]);
      const { address } = logs ?? {};
      contractVersion = (logs || {}).contractVersion;
      contractAddress = address;
    }
    // get contractVersion
    let contractName = "";
    if (contractAddress) {
      if (!contractVersion) {
        const verRes = await callGetMethodSend(
          "Genesis",
          "GetContractInfo",
          contractAddress
        );
        contractVersion = verRes.contractVersion;
      }
      // get contractName
      const nameRes = await get(VIEWER_GET_CONTRACT_NAME, {
        address: contractAddress,
      });
      contractName = nameRes.data.name;
    }

    return {
      visible: true,
      title:
        !isError && contractAddress
          ? `Contract is ${isDeploy ? "deployed" : "updated"}！`
          : `Contract failed to be ${isDeploy ? "deployed" : "updated"}！`,
      children: (
        <div style={{ textAlign: "left" }}>
          {!isError && contractAddress ? (
            <div>
              <AddressNameVer
                address={contractAddress}
                name={contractName || contract.name}
                ver={contractVersion}
              />
            </div>
          ) : (
            "Please check your Proposal ."
          )}
        </div>
      ),
    };
  }
};
