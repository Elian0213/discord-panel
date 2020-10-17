import React, { FC, useEffect, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Button } from 'antd';
import { JsonEditor as Editor } from 'jsoneditor-react';
import styles from './RuleManager.module.less';
import { useStoreState } from '../../../store';
import axios from 'axios';

// Modal
import PostModal from './modals/PostModal';

// Overwrite jsoneditor styles
import './jsoneditor.css';

type Props = RouteComponentProps;

const RuleManager: FC<Props> = () => {
  const [Rules, setRules] = useState({});
  const [postModal, setPostModal] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const member = useStoreState(state => state.member.currentMember)

  useEffect(() => {
    // If rules haven't been fetched yet, the object is empty so there are 0 keys. Not the best way but who cares.
    if (Object.keys(Rules).length === 0) {
      getRules();
    }
  })

  const getRules = async () => {
    axios.get(`${process.env.REACT_APP_BACKEND_DOMAIN}/rule-manager/get`, {
      headers: {
        Authorization: localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`)
      }
    })
    .then((resp) => {
      setRules(resp.data);
      setHasLoaded(true)
      if (document.querySelector('.jsoneditor-expand-all') !== null) {
        const button = document.querySelector('.jsoneditor-expand-all');
        if (button !== null && button !== null) {
          button.dispatchEvent(new Event('click'))
        }
      }
      console.log(Rules)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const onChange = (e: object) => {
    setRules(e)
  }

  const openPostModal = async () => {
    setPostModal(true);
  }

  const closePostModal = async () => {
    setPostModal(false);
  }

  const updateRulesToChannel = async (channelID: string) => {
    await axios.post(`${process.env.REACT_APP_BACKEND_DOMAIN}/rule-manager/set`, {
      rules: Rules,
      channel: channelID
    }, {
      headers: {
        Authorization: localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`)
      }
    })
    .then((data) => {
      console.log(data)
    })
  }

  return member? (
    <div className={styles['rule-manager']}>
      <div className={styles['rule-manager__topbar']}>
        <h3>Rule Manager</h3>
        <Button type="primary" onClick={openPostModal}>Send embeds to channel</Button>
      </div>
      <PostModal open={postModal} close={closePostModal} postRules={updateRulesToChannel} />
      <div className={styles['rule-editor__container']}>
        {
          hasLoaded ?
          <Editor
            mode="tree"
            className={styles['rule-editor-container']}
            allowedModes={["tree", "code"]}
            search={false}
            statusBar={true}
            expandAll={true}
            navigationBar={false}
            value={Rules}
            onChange={onChange}
          />
          :
          null
        }
      </div>
    </div>
  ): null
};

export default RuleManager;
