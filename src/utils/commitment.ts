import * as crypto from 'crypto';
import { BigNumber } from 'ethers';
import { BabyJub, buildPedersenHash, PedersenHash } from 'circomlibjs';

class Pedersen {
  pedersenHash: PedersenHash | null;
  babyJub: BabyJub | null;
  constructor() {
    this.pedersenHash = null;
    this.babyJub = null;
    this.initPedersen();
  }

  async initPedersen() {
    this.pedersenHash = await buildPedersenHash();
    this.babyJub = this.pedersenHash.babyJub;
  }

  unpackPoint(buffer: Uint8Array) {
    if (!this.pedersenHash || !this.babyJub) return null;
    return this.babyJub.unpackPoint(this.pedersenHash.hash(buffer));
  }
  toStringBuffer(buffer: Uint8Array) {
    if (!this.babyJub) return null;
    return this.babyJub.F.toString(buffer);
  }
}

const pedersen = new Pedersen();

export function buffPedersenHash(buffer: Uint8Array) {
  const point = pedersen.unpackPoint(buffer);
  if (point == null) return null;
  const [hash] = point;
  return pedersen.toStringBuffer(hash);
}

function calculateHash(mimc: any, left: any, right: any) {
  return BigNumber.from(mimc.F.toString(mimc.multiHash([left, right])));
}

export function leInt2Buff(value: Buffer) {
  return BigNumber.from('0x' + value.toString('hex'));
}

export function randomBN(nbytes = 31) {
  return BigNumber.from(leInt2Buff(crypto.randomBytes(nbytes)));
}

export function toFixedHex(value: string | number | bigint | boolean | Buffer, length = 32) {
  const isBuffer = value instanceof Buffer;

  const str = isBuffer ? value.toString('hex') : BigInt(value).toString(16);
  return '0x' + str.padStart(length * 2, '0');
}

export async function generateCommitment() {
  const secret = randomBN(31);
  const nullifier = randomBN(31);
  const preimage = Buffer.concat([
    Buffer.from(nullifier.toHexString().slice(2), 'hex'),
    Buffer.from(secret.toHexString().slice(2), 'hex'),
  ]);

  // const commitment = mimc.F.toString(mimc.multiHash([nullifier, secret]))
  // const nullifierHash = mimc.F.toString(mimc.multiHash([nullifier]))
  // return {
  //     nullifier: nullifier,
  //     secret: secret,
  //     commitment: commitment,
  //     nullifierHash: nullifierHash
  // }

  const commitment = buffPedersenHash(preimage);
  const commitmentHex = toFixedHex(commitment);
  return {
    preimage: '0x' + preimage.toString('hex'),
    commitmentHex,
  };
}
