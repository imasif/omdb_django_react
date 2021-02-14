import React from 'react';
import { Menu, Grid, Button } from 'antd';

const { useBreakpoint } = Grid;

const RightMenu = (props) => {
  const { md } = useBreakpoint();

  return (
    <Menu mode={md ? "horizontal" : "inline"}>
      <Menu.Item key="signin">
      {props.currentuser == undefined ? <Button type="link" onClick={() => props.setModal1Visible(true)}>Sign In</Button> : ''}
      </Menu.Item>
      <Menu.Item key="signup">
        {props.currentuser == undefined ? <Button type="link" onClick={() => props.setModal2Visible(true)}>Sign Up</Button> : ''}
      </Menu.Item>
      
      <Menu.Item key="signout">
        {props.currentuser != undefined ? <Button type="link" onClick={() => props.signout(true)}>Sign out</Button> : ''}
      </Menu.Item>
    </Menu>
  );
}

export default RightMenu;