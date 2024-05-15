import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

interface LinkReplaceLastPathNameProps extends LinkProps {
  children?: React.ReactNode;
  replaceStart?: string;
}
export default function LinkReplaceLastPathName(props: LinkReplaceLastPathNameProps) {
  const { href: originHref, replaceStart } = props;
  let pathName = usePathname();
  if (pathName.endsWith('/')) {
    pathName = pathName.slice(0, -1);
  }
  const newPath = useMemo(() => {
    const parts = pathName.split('/').filter(Boolean);
    if (replaceStart) {
      const index = parts.findIndex((part) => part === replaceStart);
      if (index !== -1) {
        parts.splice(index);
      } else {
        parts.pop();
      }
    } else {
      parts.pop();
    }
    let suffix = [];
    if (typeof originHref === 'string') {
      suffix = originHref.split('/').filter(Boolean);
      parts.push(...suffix);
      return '/' + parts.join('/');
    } else {
      suffix = originHref.pathname?.split('/').filter(Boolean) ?? [];
      parts.push(...suffix);
      return {
        ...originHref,
        pathname: '/' + parts.join('/'),
      };
    }
  }, [pathName, originHref]);
  return <Link {...props} href={newPath} />;
}
