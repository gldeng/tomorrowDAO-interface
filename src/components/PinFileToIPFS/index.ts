const JWT = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`;
console.log('process.env.NEXT_PUBLIC_PINATA_JWT', process.env.NEXT_PUBLIC_PINATA_JWT);
async function pinFileToIPFS(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const pinataMetadata = JSON.stringify({
      name: file.name,
      //   keyvalues: {
      //     description: 'File description',
      //     externalUrl: 'xxx',
      //   },
    });
    formData.append('pinataMetadata', pinataMetadata);

    const options = {
      method: 'POST',
      headers: {
        // 'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        authorization: JWT,
      },
      body: formData,
    } as RequestInit;

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', options);
    const resData = await res.json();

    return {
      cid: resData.IpfsHash ?? '',
      name: file.name ?? '',
      url: `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${resData.IpfsHash}?pinataGatewayToken=${process.env.NEXT_PUBLIC_GATEWAY_TOKEN}`,
    };
  } catch (error) {
    console.log(error);
  }
}

export default pinFileToIPFS;
