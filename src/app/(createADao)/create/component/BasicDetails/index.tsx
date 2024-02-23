import { Upload } from 'antd';
import type { UploadRequestOption } from 'rc-upload/lib/interface';

import pinFileToIPFS from 'components/PinFileToIPFS';
import { Button } from 'aelf-design';
import { Image } from 'antd';
import { useState } from 'react';
export default function BasicDetails() {
  const [imageUrl, setImageUlr] = useState('');
  const customUpload = async ({ file, onSuccess, onError }: UploadRequestOption) => {
    try {
      const uploadData = await pinFileToIPFS(file as File);
      console.log(uploadData, 'uploadData');
      setImageUlr(uploadData?.url ?? '');
      onSuccess &&
        onSuccess({
          uploadData,
        });
    } catch (error) {
      onError && onError(error as Error);
    }
  };

  return (
    <div>
      <p>Basic Details</p>
      <Upload customRequest={customUpload}>
        <Button>Click to Upload</Button>
      </Upload>
      {imageUrl && <Image src={imageUrl} width={100} height={100} alt="" />}
    </div>
  );
}
