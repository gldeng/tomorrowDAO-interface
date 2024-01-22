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
	const {
		WebLoginState,
		useWebLogin,
		useCallContract,
		WebLoginEvents,
		useWebLoginEvent,
	} = await import('aelf-web-login').then((module) => module);
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
				<AntdLayout className={`TS-wrapper`}>
					<Header />
					<AntdLayout.Content
						className={`TS-content min-h-[100vh] flex justify-center`}
					>
						<Suspense fallback={<Loading />}>{children}</Suspense>
					</AntdLayout.Content>
				</AntdLayout>
			</>
		);
	};
});

export default Layout;
