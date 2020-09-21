import React, { FC, useState, useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Spin, Alert } from 'antd';
import styles from './DiscordAuth.module.less';
import { useStoreActions } from '../../store';

type Props = RouteComponentProps;

const DiscordAuth: FC<Props> = ({ location }) => {
  const [hasError, setHasError] = useState(false);
  const [sendAuth, setSendAuth] = useState(false);

  const getCurrentMember = useStoreActions(
    (actions) => actions.member.getCurrentMember
  );

  useEffect(() => {
    // Very scuffed way to fix the issue of making it the request twice but who cares
    if (!sendAuth) {
      const params = new URLSearchParams(location?.search)
      getCurrentMember(params.get('code') || '')
      .catch(() => {
        setHasError(true);
      });

      setSendAuth(true);
    }
  }, [sendAuth, getCurrentMember, location]);

  return (
    <span className={styles.discordAuth}>
      {!hasError ? (
        <Spin size="large" />
      ) : (
        <Alert
          message="Woops..."
          description="An unexpected error occurred. Please try again later."
          type="error"
          showIcon
        />
      )}
    </span>
  );
};

export default DiscordAuth;
