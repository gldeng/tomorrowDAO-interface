'use client';

import { store } from 'redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from 'components/Loading';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={<Loading />}>
        {children}
      </PersistGate>
    </Provider>
  );
}
