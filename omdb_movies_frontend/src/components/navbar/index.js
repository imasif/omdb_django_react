import React, { Component } from 'react';
import LeftMenu from './LeftMenu'
import RightMenu from './RightMenu'
import { Drawer, Button } from 'antd';

class Navbar extends Component {
	state = {
		current: this.props.current,
		visible: false
	}
	showDrawer = () => {
		this.setState({
			visible: true,
		});
	};

	onClose = () => {
		this.setState({
			visible: false,
		});
	};

	render() {
		const { current } = this.state;
		
		return (
			<nav style={{ position: 'fixed', zIndex: 1, width: '100%' }} className="menuBar">
				<div className="logo">
					<a href="#">OMDB</a>
				</div>
				<div className="menuCon">
					<div className="leftMenu">
						<LeftMenu currentuser={this.props.currentuser} current={[current]}/>
					</div>
					<div className="rightMenu">
						<RightMenu signout={(data)=>this.props.signout(data)} currentuser={this.props.currentuser} setModal1Visible={(data)=>this.props.setModal1Visible(data)}  setModal2Visible={(data)=>this.props.setModal2Visible(data)} />
					</div>
					<Button className="barsMenu" type="primary" onClick={this.showDrawer}>
						<span className="barsBtn"></span>
					</Button>
					<Drawer
						title="Basic Drawer"
						placement="right"
						closable={true}
						onClose={this.onClose}
						visible={this.state.visible}
					>
						<LeftMenu />
						<RightMenu />
					</Drawer>

				</div>
			</nav>
		);
	}
}

export default Navbar;