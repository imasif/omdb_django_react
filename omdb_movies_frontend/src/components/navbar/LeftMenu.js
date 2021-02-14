import React, { useState } from "react";
import { Menu, Grid } from "antd";
import { Location, Link } from "@reach/router"

const { useBreakpoint } = Grid;

const LeftMenu = (prop) => {

    const { md } = useBreakpoint();
    
    return (
        <Location>
            {props => {
                return (
                    <Menu mode={md ? "horizontal" : "inline"} selectedKeys={[props.location.pathname]}>
                        <Menu.Item key="/">
                            <Link to="/">Home</Link>
                        </Menu.Item>
                        
                        <Menu.Item key="/favs">
                            {prop.currentuser != undefined ? <Link to="/favs">Favorites</Link> : ''}
                        </Menu.Item>
                    </Menu>
                );
            }}
        </Location>
    );
};

export default LeftMenu;
