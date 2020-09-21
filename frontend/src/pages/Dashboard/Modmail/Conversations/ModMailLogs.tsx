import React, { FC, useEffect, useState } from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import { Table, Space, Avatar, Tag } from 'antd';
import { useStoreState, useStoreActions } from '../../../../store';
import styles from './ModMailLogs.module.less';
import Column from 'antd/lib/table/Column';
import { Conversation } from '../../../../store/modmail';

// Modals
import ConversationModal from './../modals/ConversationModal';

type Props = RouteComponentProps;

const ModMailLogs: FC<Props> = () => {
  const member = useStoreState(state => state.member.currentMember)

  const [hasLoaded, setHasLoaded] = useState(false);
  const [conversations, setConversations] = useState([]);

  const [viewConversation, setViewConversation] = useState(false);
  const [viewConversationData, setViewConversationData] = useState({} as Conversation)

  const getActiveConversations = useStoreActions(
    (actions) => actions.modmail.getActiveConversations
  )

  useEffect(() => {
    if (!hasLoaded) {
      getActiveConversations()
      .then((data) => {
        setHasLoaded(true);
        setConversations(data);
      });
    }
  });

  const viewConversationInfo = (data: Conversation) => {
    setViewConversation(true);
    setViewConversationData(data);
  }

  const closeViewConversationInfo = () => {
    setViewConversation(false);
  }

  return member && hasLoaded ? (
    <div className={styles.modMailLogs}>
      <ConversationModal open={viewConversation} close={closeViewConversationInfo} data={viewConversationData}/>
      <Table size='large' dataSource={conversations}>
        <Column title="ID" render={(_, record: any) => record.ConversationID} />
        <Column title="Guild" render={(_, record: any) => (
            <>
              <Avatar src={record.Meta.GuildIcon} />
              <span className={styles.username}>{record.Meta.GuildName}</span>
            </>
          )}
        />
        <Column title="Category" render={(_, record: any) => <Tag color="#5d75a0">#{record.Meta.CategoryName}</Tag>} />
        <Column title="Reporter" render={(_, record: any) => (
            <>
              <Avatar src={record.User.AvatarURL} />
              <span className={styles.username}>{record.User.username}</span>
            </>
          )}
        />
        <Column title="Opened at" render={(_, record: any) => {
          const date = new Date(record.CreatedAt);

          return `${date.toDateString()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}`;
        }} />
        <Column
          title="Actions"
          key="action"
          render={(_, record: any) => (
            <Space size="middle">
              <a onClick={() => viewConversationInfo(record)}>Info</a>
              <a onClick={() => navigate(`/dashboard/modmail/conversation/${record.ConversationID}`)}>View</a>
            </Space>
          )}
        />
      </Table>
    </div>
  ) : null
};

export default ModMailLogs;
