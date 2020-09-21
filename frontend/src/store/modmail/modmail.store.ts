import { thunk } from 'easy-peasy';
import { message } from 'antd';
import { ModmailModel } from './types';
import axios from 'axios';

const currentModmailModel: ModmailModel = {
  // State
  currentConversation: null,

  // Thunks: Http calls
  getActiveConversations: thunk(async () => {
    return axios
      .get(`${process.env.REACT_APP_BE_DOMAIN}/modmail/conversations/active/get`, {
        headers: {
          Authorization: localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`)
        }
      })
      .then(({ data })  => {
        return data;
      })
      .catch((err) => {
        const errMessage = err.response.data;
        message.error(`Modmail failed... ${errMessage.message}`);

        return err.response;
      });
  }),

    // Thunks: Http calls
    getConversationLogs: thunk(async (_, id) => {
      return axios
        .get(`${process.env.REACT_APP_BE_DOMAIN}/modmail/conversation/${id}/full`, {
          headers: {
            Authorization: localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`)
          }
        })
        .then(({ data })  => {
          return data;
        })
        .catch((err) => {
          console.log(id);
          const errMessage = err.response.data;
          message.error(`Modmail failed... ${errMessage.message}`);

          return err.response;
        });
    }),
};

export default currentModmailModel;
