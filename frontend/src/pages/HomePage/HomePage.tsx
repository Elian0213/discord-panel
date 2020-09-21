import React, { FC } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Button, Space } from 'antd';
import styles from './HomePage.module.less';
import { DiscordIcon } from '../../core/components/Icons';
import logo from './logo.png';

type Props = RouteComponentProps;

const HomePage: FC<Props> = () => (
  <Space className={styles.homePage} size="large" direction="vertical">
    <img draggable="false" className={styles.logoImg} src={logo} alt="Logo" />
    <Button
      className={styles.authorizeBtn}
      size="large"
      type="primary"
      href={process.env.REACT_APP_DISCORD_AUTHORIZE_URL}
      icon={<DiscordIcon />}
    >
      Authorize with Discord
    </Button>
  </Space>
);

export default HomePage;
