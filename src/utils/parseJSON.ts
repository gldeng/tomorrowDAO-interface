export const parseJSON = (str: string) => {
  let result = null;
  try {
    result = JSON.parse(str);
  } catch (e) {
    result = str;
  }
  return result;
};

export function uint8ToBase64(u8Arr: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) {
  console.log(Buffer, typeof Buffer);
  return Buffer.from(u8Arr).toString('base64');
}
