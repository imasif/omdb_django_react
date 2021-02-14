import React, { Component } from 'react';
import { Button, Input, Layout, Form, Modal} from 'antd';
import { Router } from "@reach/router"

import Navbar from './components/navbar';
import Home from './components/Home';
import Favorites from './components/Favorites';
import MovieDetails from './components/movie_details';
import './App.css';
import { LockTwoTone, MailTwoTone, UserOutlined } from '@ant-design/icons';
import Signin from './components/Signin';
import Signup from './components/Signup';

const { Footer } = Layout;
const FormItem = Form.Item;

export default class App extends Component {
	state = {
		data: {},
		movies: [],
		visible: false,
		modal1Visible: false,
		currentuser: undefined
	}

	componentDidMount(){
		let currentuser = JSON.parse(localStorage.getItem('CurrentUser'));
		if(currentuser != undefined){
			this.setState({currentuser})
		}
	}
	

    setModal1Visible(modal1Visible) {
        this.setState({ modal1Visible });
    }
    
    setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible });
    }

	signout(data){
		if(data === true){
			let currentuser = localStorage.clear();
			this.setState({ currentuser });
			window.location.replace(window.location.origin);
		}
	}


	render() {
		return (
			<Layout>
				<Navbar signout={data=>this.signout(data)} currentuser={this.state.currentuser} setModal1Visible={(data)=>this.setModal1Visible(data)} setModal2Visible={(data)=>this.setModal2Visible(data)} />
				<Router>
					<Home currentuserCB={currentuser=>this.setState({currentuser})} currentuser={this.state.currentuser} path="/"/>
					<MovieDetails currentuser={this.state.currentuser} path="/movies/:id"/>
					<Favorites currentuser={this.state.currentuser} path="/favs"/>
				</Router>

				
                <Modal
                    title="Sign In Form"
					closable={false}
                    centered
                    visible={this.state.modal1Visible}
					footer={[<Button key='close_modal' onClick={()=>this.setModal1Visible(false)} danger>close</Button>]}
                >
                    <Signin currentuser={data=>this.setState({currentuser: data})} setModal1Visible={(data)=>this.setModal1Visible(data)}/>
                </Modal>
				
                <Modal
                    title="Sign Up Form"
					closable={false}
                    centered
                    visible={this.state.modal2Visible}
					footer={[<Button key='close_modal' onClick={()=>this.setModal2Visible(false)} danger>close</Button>]}
                >
                    
                    <Signup currentuser={data=>this.setState({currentuser: data})} setModal2Visible={(data)=>this.setModal2Visible(data)}/>
                </Modal>

				<Footer style={{ textAlign: 'center' }}>&copy; 2021 . OMDB</Footer>
			</Layout>
		);
	}
}
