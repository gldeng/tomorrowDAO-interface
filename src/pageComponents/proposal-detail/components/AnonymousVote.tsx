import { Button } from "aelf-design"
import { useAsyncEffect } from "ahooks";
import { fetchCommitments, fetchVoterCommitment } from "api/request";
import { voteAddress } from "config";
import { callContract, callViewContract } from "contract/callContract";
import MerkleTree, { ProofPath } from "fixed-merkle-tree";
import { memo, useEffect, useState } from "react";
import { EVoteOption } from "types/vote";


import { buildMimcSponge, MimcSponge } from 'circomlibjs'
import { getTornadoKeys } from "utils/snark";
import { useWebLogin } from "aelf-web-login";
import { useCommitment } from "provider/CommitmentProvider";
import { buffPedersenHash, leInt2Buff } from "utils/commitment";

class Mimc {
    sponge: MimcSponge | null;
    hash: (left: string | number | bigint | boolean, right: string | number | bigint | boolean) => any;
    constructor() {
        this.sponge = null
        this.hash = (left: string | number | bigint | boolean, right: string | number | bigint | boolean) => {
            if (!this.sponge) throw new Error('MiMC not initialized')
            return this.sponge.F.toString(this.sponge.multiHash([BigInt(left), BigInt(right)]))
        }
        this.initMimc()
    }

    async initMimc() {
        this.sponge = await buildMimcSponge()
        this.hash = (left: string | number | bigint | boolean, right: string | number | bigint | boolean) => this.sponge!.F.toString(this.sponge!.multiHash([BigInt(left), BigInt(right)]))
    }
}

const mimc = new Mimc()

interface IAnonymousVoteProps {
    proposalId: string;
    canVote: boolean;
}

const AnonymousVote = (props: IAnonymousVoteProps) => {
    const { proposalId, canVote } = props;
    const [merkleRoot, setMerkleRoot] = useState<string>();
    const [tree, setMerkleTree] = useState<MerkleTree | null>(null);
    const [websnarkJsLoaded, setWebsnarkJsLoaded] = useState(false);
    const { wallet } = useWebLogin();
    const { commitmentHex, preimage } = useCommitment();
    const [proofPath, setProofPath] = useState<ProofPath | null>(null);
    const note = (() => {
        if (preimage == null) {
            return { nullifier: BigInt(0), secret: BigInt(0), nullifierHash: BigInt(0) };
        } else {
            const preimageBuffer = Buffer.from(preimage.replace("0x", ""), "hex");
            const nullifier = BigInt(leInt2Buff(preimageBuffer.slice(0, 31)).toString());
            const secret = BigInt(leInt2Buff(preimageBuffer.slice(31, 62)).toString());
            const nullifierHash = BigInt(buffPedersenHash(preimageBuffer.slice(0, 31)) ?? 0);
            return { nullifier, secret, nullifierHash };
        }
    })();
    const ready = websnarkJsLoaded;
    const [done, setDone] = useState(false);

    useEffect(() => {
        // Load the websnark.js script dynamically
        const script = document.createElement('script');
        script.src = '/files/websnark.js';
        script.onload = () => {
            setWebsnarkJsLoaded(true);
        };
        document.body.appendChild(script);

        // Cleanup script on component unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);


    useAsyncEffect(async () => {
        if (!wallet.address)
            return;
        const contractAddress = await callViewContract<string, string>(
            'GetMerkleTreeHistoryContractAddress',
            "",
            voteAddress,
        );
        if (!contractAddress) return;

        const root = await callViewContract<string, string>(
            'GetLastRoot',
            props.proposalId,
            contractAddress,
        );
        setMerkleRoot(root);
        console.log('queried root', root)
        let commitments: { index: number; commitment: string; }[] = [];
        let totalCount = -1;
        do {
            let res = await fetchCommitments({ proposalId, skipCount: commitments.length });
            if (totalCount == -1) {
                totalCount = res.data.totalCount;
            }
            commitments = commitments.concat(res.data.items.map(x => ({ index: x.leafIndex, commitment: x.commitment })));
        } while (totalCount > commitments.length);

        // Sort commitments by index
        commitments.sort((a, b) => a.index - b.index);

        // Extract the commitment field into an array
        const commitmentArray = commitments.map(c => BigInt(`0x${c.commitment}`).toString());
        const _tree = new MerkleTree(20, commitmentArray, {
            zeroElement: "21663839004416932945382355908790599225266501822907911457504978515578255421292",
            hashFunction: mimc.hash
        });
        setMerkleTree(_tree);
        const commRes = await fetchVoterCommitment({ proposalId, voter: wallet.address });

        if (commRes.data) {
            const proofPath = _tree.path(commRes.data.leafIndex);
            setProofPath(proofPath);
        }

    }, [wallet?.address]);

    const produceProof = async (voteOption: number) => {

        const input = {
            // public
            fee: BigInt(0),
            root: BigInt(`0x${merkleRoot}`),
            refund: BigInt(0),
            relayer: BigInt(0),
            recipient: BigInt(voteOption),
            nullifierHash: note.nullifierHash,
            // private
            pathIndices: proofPath!.pathIndices,
            pathElements: proofPath!.pathElements,
            secret: note.secret,
            nullifier: note.nullifier
        }

        const { circuit, provingKey } = await getTornadoKeys()

        console.log('Start generating SNARK proof', input)
        console.time('SNARK proof time')

        if (window.genZKSnarkProofAndWitness) {
            return await window.genZKSnarkProofAndWitness(input, circuit, provingKey);
        }
    };




    const handleVote = async (optionVotingFor: EVoteOption) => {

        setDone(true);
        const proof = await produceProof(optionVotingFor);
        if (!proof) {
            console.error("Failed to produce proof.");
        }

        const contractParams = {
            votingItemId: props.proposalId,
            voteOption: optionVotingFor,
            anonymousVoteExtraInfo: {
                nullifier: '0x' + note.nullifierHash.toString(16),
                proof: {
                    a: {
                        x: proof.pi_a[0],
                        y: proof.pi_a[1]
                    },
                    b: {
                        x: {
                            first: proof.pi_b[0][1],
                            second: proof.pi_b[0][0]
                        },
                        y: {
                            first: proof.pi_b[1][1],
                            second: proof.pi_b[1][0]
                        }
                    },
                    c: {
                        x: proof.pi_c[0],
                        y: proof.pi_c[1]
                    }
                }
            }
        };

        // TODO: Better handling of error
        callContract('Vote', contractParams, voteAddress)
            .then((res) => {
                if (res.Error != null && res.Error != '') {
                    console.error('Error submitting commitment: ', res);
                }
                console.log('tx', res)
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return <div className={`flex justify-between gap-[16px] items-center`}>
        <Button
            type="primary"
            size="medium"
            millisecondOfDebounce={1000}
            className="approve-button flex-1"
            onClick={() => handleVote(EVoteOption.APPROVED)}
            disabled={!ready || done}
        >
            Approve
        </Button>
        <Button
            type="primary"
            size="medium"
            className="reject-button flex-1"
            millisecondOfDebounce={1000}
            onClick={() => handleVote(EVoteOption.REJECTED)}
            disabled={!ready || done}
        >
            Reject
        </Button>
        <Button
            type="primary"
            size="medium"
            millisecondOfDebounce={1000}
            className="abstention-button flex-1"
            onClick={() => handleVote(EVoteOption.ABSTAINED)}
            disabled={!ready || done}
        >
            Abstain
        </Button>
    </div>
}

export default memo(AnonymousVote);
