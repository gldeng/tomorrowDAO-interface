import { useAsyncEffect } from 'ahooks';
import {
  fetchCommitments,
  fetchProposalDetail,
  fetchVoterCommitment,
  sendAnonymousTx,
} from 'api/request';
import { curChain, voteAddress } from 'config';
import { callContract, callViewContract } from 'contract/callContract';
import MerkleTree, { ProofPath } from 'fixed-merkle-tree';
import { useEffect, useState } from 'react';
import { EVoteOption } from 'types/vote';

import { buildMimcSponge, MimcSponge } from 'circomlibjs';
import { getTornadoKeys } from 'utils/snark';
import { useWebLogin } from 'aelf-web-login';
import { useCommitment } from 'provider/CommitmentProvider';
import { buffPedersenHash, leInt2Buff } from 'utils/commitment';

class Mimc {
  sponge: MimcSponge | null;
  hash: (
    left: string | number | bigint | boolean,
    right: string | number | bigint | boolean,
  ) => any;
  constructor() {
    this.sponge = null;
    this.hash = (
      left: string | number | bigint | boolean,
      right: string | number | bigint | boolean,
    ) => {
      if (!this.sponge) throw new Error('MiMC not initialized');
      return this.sponge.F.toString(this.sponge.multiHash([BigInt(left), BigInt(right)]));
    };
    this.initMimc();
  }

  async initMimc() {
    this.sponge = await buildMimcSponge();
    this.hash = (
      left: string | number | bigint | boolean,
      right: string | number | bigint | boolean,
    ) => this.sponge!.F.toString(this.sponge!.multiHash([BigInt(left), BigInt(right)]));
  }
}

const mimc = new Mimc();

interface TNote {
  nullifier: bigint;
  secret: bigint;
  nullifierHash: bigint;
  commitment: bigint;
}

const parseNote = (preimage: string): TNote => {
  const preimageBuffer = Buffer.from(preimage.replace('0x', ''), 'hex');
  const nullifier = BigInt(leInt2Buff(preimageBuffer.subarray(0, 31)).toString());
  const secret = BigInt(leInt2Buff(preimageBuffer.subarray(31, 62)).toString());
  const nullifierHash = BigInt(buffPedersenHash(preimageBuffer.subarray(0, 31)) ?? 0);
  const commitment = BigInt(buffPedersenHash(preimageBuffer) ?? 0);
  return { nullifier, secret, nullifierHash, commitment };
};

export const useAnonymousVote = ({ proposalId }: { proposalId: string }) => {
  const [merkleRoot, setMerkleRoot] = useState<string>();
  const [merkleTree, setMerkleTree] = useState<MerkleTree | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const { wallet } = useWebLogin();
  const { commitmentHex: cachedCommitment, preimage: cachedPreimage } = useCommitment();
  const [preimage, setPreimage] = useState(cachedPreimage);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isAnonymousVoteInitialized, setIsAnonymousVoteInitialized] = useState(false);

  useAsyncEffect(async () => {
    const detail = await fetchProposalDetail({ proposalId, chainId: curChain });
    if (detail.data.isAnonymous) {
      setIsAnonymous(true);
    }
    setIsAnonymousVoteInitialized(true);
  }, []);

  useEffect(() => {
    if (!isAnonymous) return;
    const script = document.createElement('script');
    script.src = '/files/websnark.js';
    script.onload = () => {
      setScriptReady(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isAnonymous]);

  useAsyncEffect(async () => {
    if (!isAnonymous) return;
    if (!wallet.address) return;
    const contractAddress = await callViewContract<string, string>(
      'GetMerkleTreeHistoryContractAddress',
      '',
      voteAddress,
    );
    if (!contractAddress) return;

    const root = await callViewContract<string, string>('GetLastRoot', proposalId, contractAddress);
    setMerkleRoot(root);
    console.log('queried root', root);
    let commitments: { index: number; commitment: string }[] = [];
    let totalCount = -1;
    do {
      const res = await fetchCommitments({ proposalId, skipCount: commitments.length });
      if (totalCount == -1) {
        totalCount = res.data.totalCount;
      }
      commitments = commitments.concat(
        res.data.items.map((x) => ({ index: x.leafIndex, commitment: x.commitment })),
      );
    } while (totalCount > commitments.length);

    commitments.sort((a, b) => a.index - b.index);

    const commitmentArray = commitments.map((c) => BigInt(`0x${c.commitment}`).toString());
    const _tree = new MerkleTree(20, commitmentArray, {
      zeroElement: '21663839004416932945382355908790599225266501822907911457504978515578255421292',
      hashFunction: mimc.hash,
    });
    setMerkleTree(_tree);
    // TODO: Make sure `_tree.root` is equal to `merkleRoot`
    const myCommitment = await fetchVoterCommitment({ proposalId, voter: wallet.address });
  }, [wallet?.address, isAnonymous]);

  const produceProof = async (voteOption: number, note: TNote) => {
    if (!merkleTree) throw new Error('Merkle tree not found');
    const index = merkleTree.indexOf(note.commitment.toString());
    const proofPath = merkleTree.path(index);
    const input = {
      fee: BigInt(0),
      root: BigInt(`0x${merkleRoot}`),
      refund: BigInt(0),
      relayer: BigInt(0),
      recipient: BigInt(voteOption),
      nullifierHash: note.nullifierHash,
      pathIndices: proofPath.pathIndices,
      pathElements: proofPath.pathElements,
      secret: note.secret,
      nullifier: note.nullifier,
    };

    const { circuit, provingKey } = await getTornadoKeys();

    console.log('Start generating SNARK proof', input);
    console.time('SNARK proof time');

    if ((window as any).genZKSnarkProofAndWitness) {
      return await (window as any).genZKSnarkProofAndWitness(input, circuit, provingKey);
    }
  };

  const castAnonymousVote = async (optionVotingFor: EVoteOption, newPreimage?: string) => {
    const note = parseNote(newPreimage ?? preimage ?? '');
    const proof = await produceProof(optionVotingFor, note);
    if (!proof) {
      console.error('Failed to produce proof.');
    }
    const leftPad = (str: string, len: number) => {
      while (str.length < len) {
        str = '0' + str;
      }
      return str;
    };
    const result = await sendAnonymousTx({
      chainName: curChain,
      contractAddress: voteAddress,
      voteDetails: {
        votingItemId: proposalId,
        voteOption: optionVotingFor,
        voteAmount: 0,
        nullifierHash: '0x' + leftPad(note.nullifierHash.toString(16), 64),
        proof: {
          piA: proof.pi_a,
          piB: proof.pi_b,
          piC: proof.pi_c,
        },
      },
    });

    return result;
  };

  // TODO: Remove this function
  const prepareAnonymousVotingInput = async (
    optionVotingFor: EVoteOption,
    newPreimage?: string,
  ) => {
    if (!preimage && !newPreimage) {
      throw 'preimage is not found';
    }
    const note = parseNote(newPreimage ?? preimage ?? '');
    const proof = await produceProof(optionVotingFor, note);
    if (!proof) {
      console.error('Failed to produce proof.');
    }

    const leftPad = (str: string, len: number) => {
      while (str.length < len) {
        str = '0' + str;
      }
      return str;
    };

    const contractParams = {
      votingItemId: proposalId,
      voteOption: optionVotingFor,
      anonymousVoteExtraInfo: {
        nullifier: '0x' + leftPad(note.nullifierHash.toString(16), 64),
        proof: {
          a: {
            x: proof.pi_a[0],
            y: proof.pi_a[1],
          },
          b: {
            x: {
              first: proof.pi_b[0][1],
              second: proof.pi_b[0][0],
            },
            y: {
              first: proof.pi_b[1][1],
              second: proof.pi_b[1][0],
            },
          },
          c: {
            x: proof.pi_c[0],
            y: proof.pi_c[1],
          },
        },
      },
    };
    return contractParams;
  };

  return {
    isAnonymousVoteInitialized,
    isAnonymous,
    cachedCommitment,
    cachedPreimage,
    scriptReady,
    castAnonymousVote,
    prepareAnonymousVotingInput,
    setPreimage,
  };
};
