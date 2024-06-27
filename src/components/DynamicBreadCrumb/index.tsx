'use client';
import Breadcrumb from 'components/Breadcrumb';
import { usePathname, useRouter } from 'next/navigation';
import { LeftOutlined } from '@aelf-design/icons';
import useResponsive from 'hooks/useResponsive';

const denyList = ['/', '/explore', '/assets', '/my-daos'];

const DynamicBreadCrumb = () => {
  const pathname = usePathname();

  const { isLG } = useResponsive();
  const router = useRouter();

  if (denyList.includes(pathname)) {
    return null;
  }
  return (
    <div className="pb-6 ">
      {isLG ? (
        <span
          className="breadcrumb-back-button flex items-center"
          onClick={() => {
            router.back();
          }}
        >
          <LeftOutlined className="icon" />
          <span>Back</span>
        </span>
      ) : (
        <Breadcrumb />
      )}
    </div>
  );
};

export default DynamicBreadCrumb;
