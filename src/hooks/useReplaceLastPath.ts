import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function useReplaceLastPath() {
  const router = useRouter();
  const pathName = usePathname();
  const push = useCallback(
    (path: string, replaceStart?: string) => {
      const parts = pathName.split('/').filter(Boolean);
      const suffix = path.split('/').filter(Boolean);
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
      parts.push(...suffix);
      const newPath = parts.join('/');
      router.push('/' + newPath);
    },
    [pathName, router],
  );
  return {
    push,
  };
}
