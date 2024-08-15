import Image, { ImageProps } from 'next/image';
import React, { useState } from 'react';
import './index.css';
import { NetworkDaoAlias } from 'config';

interface ImageWithPlaceHolderProps {
  src: string;
  text: string;
  alias: string;
  imageProps: Partial<ImageProps>;
}

const ImageWithPlaceHolder: React.FC<ImageWithPlaceHolderProps> = ({
  src,
  text,
  imageProps,
  alias,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className=" image-with-placeholder-wrap">
      <div
        className={`${alias === NetworkDaoAlias ? 'network-dao' : ''} ${
          isLoading ? '' : 'layer-low'
        } image-placeholder-text`}
      >
        {text?.[0] ?? 'D'}
      </div>
      <Image
        src={src}
        alt={text}
        className={`${isLoading ? 'layer-low' : ''} image-content`}
        onLoad={handleImageLoad}
        {...imageProps}
      />
    </div>
  );
};

export default ImageWithPlaceHolder;
