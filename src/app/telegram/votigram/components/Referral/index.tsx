import { useWebLogin, WalletType } from 'aelf-web-login';
import { getReferrelCode } from 'api/request';
import { curChain, networkType } from 'config';
import qs from 'query-string';
import { getCaHashAndOriginChainIdByWallet } from 'utils/wallet';
const AElf = require('aelf-sdk');

const portkeyUrl =
  networkType === 'TESTNET'
    ? 'https://auth-aa-portkey-test.portkey.finance/connect/token'
    : 'https://referral.portkey.finance/connect/token';
interface IReferralProps {}
export default function Referral(props: IReferralProps) {
  const { wallet, getSignature, walletType } = useWebLogin();
  console.log('wallet', wallet, walletType);
  const handleInvite = async () => {
    const timestamp = Date.now();
    // const sign = await getSignature({
    //   appName: 'TomorrowDAOServer',
    //   address: wallet.address,
    //   signInfo:
    //     walletType === WalletType.portkey
    //       ? Buffer.from(`${wallet.address}-${timestamp}`).toString('hex')
    //       : '',
    // });
    const didWallet = wallet.portkeyInfo;
    const message = Buffer.from(`${didWallet.walletInfo.address}-${timestamp}`).toString('hex');
    const signature = AElf.wallet.sign(message, didWallet.walletInfo.keyPair).toString('hex');
    const publicKey = wallet.publicKey || '';
    const { caHash } = await getCaHashAndOriginChainIdByWallet(wallet, walletType);
    const requestObject = {
      grant_type: 'signature',
      client_id: 'CAServer_App',
      scope: 'CAServer',
      signature: signature,
      pubkey: publicKey,
      timestamp: timestamp,
      ca_hash: caHash,
      chain_id: curChain,
    };
    const portKeyRes = await fetch(portkeyUrl, {
      method: 'POST',
      body: qs.stringify(requestObject),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const portKeyResObj = await portKeyRes.json();
    if (portKeyRes.ok) {
      const token = portKeyResObj.access_token;
      console.log('portKeyResObj', portKeyResObj);
      const res = await getReferrelCode({
        token: token,
        chainId: curChain,
      });
      console.log(res);
    }
  };
  return (
    <div>
      <button onClick={handleInvite}>invite</button>
    </div>
  );
}
