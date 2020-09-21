import React, { FC } from 'react';
import { RouteComponentProps } from '@reach/router';
//import styles from './Home.module.less';
import { useStoreState } from '../../../store';

type Props = RouteComponentProps;

const ModMailLogs: FC<Props> = () => {
  const member = useStoreState(state => state.member.currentMember)

  return member? (
    <div>
      <p>homepage</p>
    </div>
  ): null
};

export default ModMailLogs;
