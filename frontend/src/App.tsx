import React, { FC } from 'react';
import styles from './App.module.less';
import ErrorBoundary from './core/components/ErrorBoundary';
import AppRoutes from './AppRoutes';

const App: FC = () => (
  <ErrorBoundary>
    <main className={styles.app}>
      <AppRoutes />
    </main>
  </ErrorBoundary>
);

export default App;
