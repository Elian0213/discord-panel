import React, { FC } from 'react';
import { Router, Redirect } from '@reach/router';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import DiscordAuth from './pages/DiscordAuth';
import { useStoreState } from './store';

const AppRoutes: FC = () => {
  const currentMember = useStoreState((state) => state.member.currentMember);

  return (
    <Router>
      {!currentMember ? (
        <>
          <HomePage path="/" />
          <DiscordAuth path="/discord-auth" />
          <Redirect from="*" to="/" noThrow />
        </>
      ) : (
        <>
          <Dashboard path="/dashboard/*" />
          <Redirect from="*" to="/dashboard" noThrow />
        </>
      )}
    </Router>
  );
};

export default AppRoutes;
