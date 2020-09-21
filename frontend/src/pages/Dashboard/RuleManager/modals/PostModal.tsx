import React, { useState, useEffect } from 'react';
import { Modal, Select, Button } from 'antd';
import axios from 'axios';
import styles from './PostModal.module.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

interface ChannelData {
  id: string
  name: string
}

const PostModal = ({ open, close, postRules }) => {
  const [channels, SetChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");

  useEffect(() => {
    if (channels.length === 0) {
      axios.get(`${process.env.REACT_APP_BE_DOMAIN}/rule-manager/channels`, {
        headers: {
          Authorization: localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`)
        }
      })
      .then((data) => {
        SetChannels(data.data)

        // Set the %rules% as default channel in the dropdown menu.
        setSelectedChannel(((data.data).find(x => x.name.includes('rules'))).id)
      })
    }
  })

  const handleChange = (e: any) => {
    setSelectedChannel(e)
  }

  const actionHandler = () => {
    const actChannelInfo: any = channels.find((x: ChannelData) => x.id === selectedChannel);
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <p>You're about to clear out <b>{actChannelInfo.name}</b></p>,
      onOk() {
        postRules(selectedChannel)
        close()
      },
      onCancel() {
        Modal.destroyAll();
      },
    });
  }

  return (
    <Modal
    title="Send and clear channel"
    visible={open}
    onOk={close}
    width={350}
    onCancel={close}
    wrapClassName={styles.modal}
    footer={null}
  >
    <div className={styles.modalBody}>
      <Select defaultValue={selectedChannel} style={{ width: 225 }} onChange={handleChange}>
      {channels.map((data: ChannelData, index: number) =>  <Option value={data.id} key={index}>{data.name}</Option>)}
      </Select>

      <Button type="primary" onClick={actionHandler}>Yeet</Button>
    </div>
  </Modal>
  )
};

export default PostModal;
