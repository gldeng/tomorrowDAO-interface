import { usePathname } from 'next/navigation';

export function useUrlPath() {
  const pathName = usePathname();
  const isHome = pathName === '/';
  return {
    isHome,
  };
}
