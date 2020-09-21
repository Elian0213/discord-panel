import React, { FC } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import { Layout } from 'antd';
import styles from './Dashboard.module.less';
import { useStoreState } from '../../store';
import Navbar from './../../core/components/Navbar'

// Pages
import Home from './Home';

// Discord
import DiscordOverview from './Overview';
import ModmailConversations from './Modmail/Conversations';
import ModmailConversationLogs from './Modmail/ConversationLogs';
import RuleManager from './RuleManager';

type Props = RouteComponentProps;

const Dashboard: FC<Props> = () => {
  const member = useStoreState(state => state.member.currentMember)
  const { Content, Sider } = Layout;

  return member? (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <Navbar member={member} />
      </Sider>
      <Layout>
        <Content className={styles.dashboard}>
          <Router>
            <RuleManager path="/rule-manager" />
            <ModmailConversations path="/modmail/conversations" />
            <ModmailConversationLogs path="/modmail/conversation/:id" />
            <DiscordOverview path="/overview" />
            <Home path="*" />
          </Router>
        </Content>
      </Layout>
    </Layout>
  ): null
};

export default Dashboard;
