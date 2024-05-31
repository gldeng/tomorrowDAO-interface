import { storages } from 'storages';

const Day = 1 * 24 * 60 * 60 * 1000;
export const getLocalJWT = (key: string) => {
  try {
    const localData = localStorage.getItem(storages.daoAccessToken);
    if (!localData) return;
    const data = JSON.parse(localData) as { [key: string]: LocalJWTData };
    const cData = data[key];
    if (!cData || !cData?.expiresTime) return;
    if (Date.now() > cData?.expiresTime) return;
    return cData;
  } catch (error) {
    return;
  }
};

export const setLocalJWT = (key: string, data: LocalJWTData) => {
  const localData: LocalJWTData = {
    ...data,
    expiresTime: Date.now() + (data.expires_in - 60) * 1000,
  };
  return localStorage.setItem(storages.daoAccessToken, JSON.stringify({ [key]: localData }));
};

export const removeJWT = () => {
  localStorage.removeItem(storages.daoAccessToken);
};
