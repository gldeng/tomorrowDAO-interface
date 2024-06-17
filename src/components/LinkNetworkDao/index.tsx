import { useEffect, useMemo, useState } from 'react';
import Link, { LinkProps } from 'next/link';
import { useParams } from 'next/navigation';
import { NetworkDaoHomePathName } from 'config';
import getChainIdQuery from 'utils/url';

interface ILinkReplaceLastPathNameProps extends LinkProps {
  children?: React.ReactNode;
}
export default function LinkNetworkDao(props: ILinkReplaceLastPathNameProps) {
  const { href: originHref } = props;
  const { networkDaoId } = useParams<{ networkDaoId: string }>();
  const [chainIdQuery, setChainIdQuery] = useState({});
  const newPath = useMemo(() => {
    if (typeof originHref === 'string') {
      return {
        query: chainIdQuery,
        pathname: `${NetworkDaoHomePathName}/${networkDaoId}${originHref}`,
      };
    } else {
      const originQuery = typeof originHref.query === 'object' ? originHref.query : {};
      return {
        ...originHref,
        query: {
          ...originQuery,
          ...chainIdQuery,
        },
        pathname: `${NetworkDaoHomePathName}/${networkDaoId}${originHref.pathname}`,
      };
    }
  }, [networkDaoId, originHref, chainIdQuery]);
  useEffect(() => {
    const chainIdQuery = getChainIdQuery();
    setChainIdQuery(chainIdQuery);
  }, []);
  return <Link {...props} href={newPath} />;
}
