import React, { FC } from 'react';
import { RouteComponentProps } from '@reach/router';
//import styles from './Overview.module.less';
import { useStoreState } from '../../../store';

type Props = RouteComponentProps;

const Overview: FC<Props> = () => {
  const member = useStoreState(state => state.member.currentMember)

  return member? (
    <div>
      <p>Overview discord moderation</p>
    </div>
  ): null
};

export default Overview;
