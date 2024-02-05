'use client';
import StoreProvider from './store';
import enUS from 'antd/lib/locale/en_US';
import WebLoginProvider from './webLoginProvider';

import { useEffect, useState } from 'react';
import { store } from 'redux/store';


function Provider({ children }: { children: React.ReactNode }) {

	return (
		<>
			{children}
		</>
	);
}

export default Provider;
