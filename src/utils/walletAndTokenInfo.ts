import { SignatureData, WalletType } from 'aelf-web-login';
import { TWalletInfoType } from 'types';
import { getCaHashAndOriginChainIdByWallet, getManagerAddressByWallet } from './wallet';
import { getLocalJWT } from './localJWT';
class AuthManager {
  isAuthing = false;
}
const authManager = new AuthManager();
export { authManager };
export default class WalletAndTokenInfo {
  public static signInfo: SignatureData | null;
  public static walletType: WalletType | null;
  public static walletInfo: TWalletInfoType | null;
  public static getSignature: (() => Promise<ITokenRes | null>) | null;
  public static version: string | null;

  public static setSignInfo(data: SignatureData) {
    this.signInfo = data;
  }

  public static setWallet(walletType: WalletType, walletInfo: TWalletInfoType, version: string) {
    this.walletInfo = walletInfo;
    this.walletType = walletType;
    this.version = version;
  }

  public static setSignMethod(method: () => Promise<ITokenRes | null>) {
    this.getSignature = method;
  }

  public static getToken(requestPath: string) {
    return new Promise(async (resolve, reject) => {
      // const {
      //   isCurrentPageNeedToken,
      //   getAccountInfoFromStorage,
      //   isNeedCheckToken,
      //   checkAccountExpired,
      //   // createToken,
      // } = require('./token');
      // if (!isCurrentPageNeedToken()) {
      //   return resolve(false);
      // }

      // const accountInfo = getAccountInfoFromStorage();

      // if (!isNeedCheckToken(requestPath)) {
      //   return resolve(accountInfo.token);
      // }

      // if (!checkAccountExpired(accountInfo, this.walletInfo?.address || '')) {
      //   return resolve(accountInfo.token);
      // }

      if (!(this.getSignature && this.walletInfo && this.walletType && this.version)) {
        return reject();
      }
      const { caHash } = await getCaHashAndOriginChainIdByWallet(this.walletInfo, this.walletType);
      const managerAddress = await getManagerAddressByWallet(this.walletInfo, this.walletType);
      const key = caHash + managerAddress;

      // const data = getLocalJWT(key);
      // 1: local storage has JWT token
      // if (data) {
      // const token_type = data.token_type;
      // const access_token = data.access_token;
      // service.defaults.headers.common['Authorization'] = `${token_type} ${access_token}`;
      // loginSuccessActive();
      // }
      // const res = await createToken({ signMethod: this.getSignature });
      const res = await this.getSignature();

      if (res) {
        return resolve(res.access_token);
      }
      return reject();
    });
  }

  public static reset() {
    this.signInfo = null;
    this.walletInfo = null;
    this.walletType = null;
    this.getSignature = null;
    this.version = null;
  }
}
