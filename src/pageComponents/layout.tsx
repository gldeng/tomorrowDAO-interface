'use client';
import React, { useEffect, Suspense } from 'react';
import { Layout as AntdLayout } from 'antd';
import Header from 'components/Header';
import Loading from 'components/Loading';
import dynamic from 'next/dynamic';

import { store } from 'redux/store';
import { setIsMobile } from 'redux/reducer/info';
import isMobile from 'utils/isMobile';

const Layout = dynamic(async () => {

	return (props: React.PropsWithChildren<{}>) => {
		const { children } = props;

		useEffect(() => {
			const resize = () => {
				const ua = navigator.userAgent;
				const mobileType = isMobile(ua);
				const isMobileDevice =
					mobileType.apple.phone ||
					mobileType.android.phone ||
					mobileType.apple.tablet ||
					mobileType.android.tablet;
				store.dispatch(setIsMobile(isMobileDevice));
			};
			resize();
			window.addEventListener('resize', resize);
			return () => {
				window.removeEventListener('resize', resize);
			};
		}, []);

		return (
			<>
				<Suspense fallback={<Loading />}>{children}</Suspense>
			</>
		);
	};
});

export default Layout;
