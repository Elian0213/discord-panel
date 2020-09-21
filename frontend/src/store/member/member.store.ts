import { thunk, action } from 'easy-peasy';
import { navigate } from '@reach/router';
import { message } from 'antd';
import { MemberModel } from './types';
import axios from 'axios';

const currentMemberModel: MemberModel = {
  // State
  currentMember: null,

  // Getters & Setters
  setCurrentMember: action((state, user) => {
    state.currentMember = user;
  }),

  logoutCurrentMember: action((state) => {
    localStorage.removeItem(`${process.env.REACT_APP_TOKEN_NAME}`);
    state.currentMember = null;
  }),

  // Thunks: Http calls
  getCurrentMember: thunk((actions, token) => {
    return axios
      .get(`${process.env.REACT_APP_BE_DOMAIN}/auth/init-discord?code=${token}`, )
      .then(({ data: member }) => {
        actions.setCurrentMember(member);
        localStorage.setItem(
          `${process.env.REACT_APP_TOKEN_NAME}`,
          member.AccessToken
        );
      })
      .catch((err) => {
        const errMessage = err.response.data;
        message.error(`Auth failed... ${errMessage.message}`);

        // Navigate back to the login page.
        navigate('/');
      });
  }),

  verifyOauth: thunk((actions) => {
    if (!localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`))
      return Promise.resolve('No auth token set');
    return axios
      .get(
        `${
          process.env.REACT_APP_BE_DOMAIN
        }/auth/discord?code=${localStorage.getItem(
          `${process.env.REACT_APP_TOKEN_NAME}`
        )}`
      )
      .then(({ data: member }) => {
        actions.setCurrentMember(member);
      })
      .catch(() => {
        message.error(
          'Error! Could not verify Discord token. Please sign in again'
        );
      });
  }),
};

export default currentMemberModel;
