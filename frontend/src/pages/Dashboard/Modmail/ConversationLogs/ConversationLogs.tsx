import React, { FC, useEffect, useState } from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import { Comment } from 'antd';
import { useStoreActions, useStoreState } from '../../../../store';
import styles from './ConversationLogs.module.less';
import { ConversationMessage, FullConversation } from '../../../../store/modmail';

type Props = RouteComponentProps;

const ConversationLogs: FC<Props> = (router: any) => {
  const member = useStoreState(state => state.member.currentMember)

  const [currentConversation, setCurrentConversation] = useState({} as FullConversation);

  const getConversationLogs = useStoreActions(
    (actions) => actions.modmail.getConversationLogs
  )

  const convertDate = (actDate) => {
    const date = new Date(actDate);

    return `${date.toDateString()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}`;
  }

  useEffect(() => {
    if (!router?.id || isNaN(router.id)) {
      navigate('/dashboard/modmail/conversations')
    }

    getConversationLogs(router.id)
      .then((data) => {
        setCurrentConversation(data)
      })

    console.log(currentConversation)
  }, [])

  return member && currentConversation?.Messages ? (
    <div className={styles.modMailLogs}>
      {currentConversation.Messages.map((message: ConversationMessage) => <Comment
          author={message.Author.Name}
          avatar={message.Author.AvatarURL}
          content={() => {
            if (message.attachment != null) {
              return "yes"
            }

            return <p>{message.Message.Content}</p>
          }}
          datetime={convertDate(message.CreatedAt)}
        />)}
    </div>
  ) : null
};

export default ConversationLogs;
