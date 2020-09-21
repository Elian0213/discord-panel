import React, { FC } from 'react'
import { Menu, Tag } from 'antd';
import { navigate } from '@reach/router'
import { MenuInfo } from 'rc-menu/lib/interface.d';
import {  LogoutOutlined, HomeOutlined, SafetyOutlined, MailOutlined } from '@ant-design/icons';
import styles from './Navbar.module.less'
import { useStoreActions } from '../../../store';
import { Member } from '../../../store/member';

const { SubMenu } = Menu;

interface Prop {
  member: Member
}

const Navbar: FC<Prop> = ({ member }) => {
  const handleClick = (info: MenuInfo): void => {
    switch (info.key) {
      case 'logout':
        logoutCurrentMember(null)
        break;
      case 'home':
        navigate('/dashboard/')
        break;
      case 'dAllLogs':
        navigate('/dashboard/modmail/conversations')
        break;
      case 'dGeneral':
        navigate('/dashboard/overview')
        break;
      case 'dRuleManager':
        navigate('/dashboard/rule-manager')
        break;
    }
  }

  const logoutCurrentMember = useStoreActions(
    (actions) => actions.member.logoutCurrentMember
  );

  return (
      <Menu
        onClick={handleClick}
        className={ styles.navbar }
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <div className={ styles.userSection }>
            <img src={ member.ProfileURL } alt=""/>
            <div className={styles.userSection__info}>
              <span>{ member.Username }</span>
              <Tag className={styles.userSection__tag} color={member.Roles[0].Color} key={member.Roles[0].ID}>{member.Roles[0].Name}</Tag>
            </div>
        </div>
        <Menu.Item className={styles.logout} key="home" icon={<HomeOutlined />}>
          General info
        </Menu.Item>
        <SubMenu key="dModeration" title="Moderation" icon={<SafetyOutlined />}>
          <Menu.Item key="dRuleManager">Rules Manager</Menu.Item>
          <Menu.Item key="dLog">Warnings & modlogs</Menu.Item>
        </SubMenu>
        <SubMenu key="dModMail" title="Modmail" icon={<MailOutlined />}>
          <Menu.Item key="dAllLogs">Log overview</Menu.Item>
          <Menu.Item key="dStandardReplies">Standard Replies</Menu.Item>
        </SubMenu>
        <Menu.Item className={styles.logout} key="logout" icon={<LogoutOutlined />}>
          Logout
        </Menu.Item>
      </Menu>
  )
}

export default Navbar;
