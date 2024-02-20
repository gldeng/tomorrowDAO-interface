import clsx from 'clsx';
import { Flex, FlexProps } from 'antd';
import { Button, IButtonProps } from 'aelf-design';
import './index.css';

export interface ICommonFooterProps {
  flexProps?: FlexProps;
  buttonList: IButtonProps[];
}

export default function CommonFooter({ flexProps, buttonList }: ICommonFooterProps) {
  if (!buttonList.length) {
    return null;
  }
  return (
    <Flex
      gap={12}
      justify="center"
      {...flexProps}
      className={clsx('common-footer', flexProps?.className)}
    >
      {buttonList.map((buttonProps, index) => (
        <Button
          type="primary"
          {...buttonProps}
          key={index}
          className={clsx('common-footer-button', buttonProps.className)}
        >
          {buttonProps.children}
        </Button>
      ))}
    </Flex>
  );
}
