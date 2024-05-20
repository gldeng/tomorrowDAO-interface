import { useMemo } from 'react';
import Link, { LinkProps } from 'next/link';
import { useParams } from 'next/navigation';
import { NetworkDaoHomePathName } from 'config';

interface ILinkReplaceLastPathNameProps extends LinkProps {
  children?: React.ReactNode;
}
export default function LinkNetworkDao(props: ILinkReplaceLastPathNameProps) {
  const { href: originHref } = props;
  const { networkDaoId } = useParams<{ networkDaoId: string }>();
  const newPath = useMemo(() => {
    if (typeof originHref === 'string') {
      return `${NetworkDaoHomePathName}/${networkDaoId}${originHref}`;
    } else {
      return {
        ...originHref,
        pathname: `${NetworkDaoHomePathName}/${networkDaoId}${originHref.pathname}`,
      };
    }
  }, [networkDaoId, originHref]);
  console.log('newPath', newPath);
  return <Link {...props} href={newPath} />;
}
