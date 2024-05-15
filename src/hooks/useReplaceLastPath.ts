import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export default function useReplaceLastPath() {
  const router = useRouter();
  const pathName = usePathname();
  const paths = useMemo(() => {
    const parts = pathName.split('/').filter(Boolean);
    parts.pop();
    return parts;
  }, [pathName]);
  const push = useCallback(
    (path: string) => {
      const suffix = path.split('/').filter(Boolean);
      paths.push(...suffix);
      const newPath = paths.join('/');
      router.push('/' + newPath);
    },
    [paths, router],
  );
  return {
    push,
  };
}
