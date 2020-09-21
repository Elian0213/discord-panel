import React from 'react';
import { Modal, Avatar, Tag, Tooltip, Descriptions   } from 'antd';
import styles from './Conversation.module.less';
import { Conversation } from '../../../../store/modmail';

type ConversationModalProps = {
  open: any,
  close: any,
  data: Conversation
}

const ConversationModal = ({ open, close, data }: ConversationModalProps) => {
  const convertDate = (actDate) => {
    const date = new Date(actDate);

    return `${date.toDateString()} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}`;
  }

  const openStatus = () => {
    return data.Active ?
      <Tag color="success">Open</Tag>
      :
      <Tag color="#error">Closed</Tag>

  }

  return data?.Meta ? (
    <Modal
    title={`Modmail info #${data.ConversationID}`}
    visible={open}
    onOk={close}
    width={350}
    onCancel={close}
    wrapClassName={styles.modal}
    footer={null}
  >
      <div className={styles.modalBody}>
        <div className={styles.metainfo}>
          <Avatar size={64} src={data.User.AvatarURL} />
          <Tooltip title={data.User.userID}>
            <Tag className={styles.usernameTag} color="#4067ad">{data.User.username}</Tag>
          </Tooltip>
          {openStatus()}
          <div className={styles.ChannelInfo}>
            <Tooltip title={data.Meta.ChannelID}>
            <Tag color="#5d75a0">{data.Meta.ChannelName}</Tag>
            </Tooltip>
            <Tooltip title={data.Meta.CategoryID}>
              <Tag color="#5e5da0">{data.Meta.CategoryName}</Tag>
            </Tooltip>
            <Tag color="#4067ad" className={styles.serverNameTag}><Avatar className={styles.serverNameTagAvatar} size={17} src={data.Meta.GuildIcon} /> {data.Meta.GuildName}</Tag>
          </div>
        </div>
        <Descriptions bordered size="small" column={1}>
          <Descriptions.Item label="Created At">{convertDate(data.CreatedAt)}</Descriptions.Item>
          <Descriptions.Item label="Updated at">{convertDate(data.LastUpdatedAt)}</Descriptions.Item>
        </Descriptions>
      </div>
  </Modal>
  ) : null
};

export default ConversationModal;
