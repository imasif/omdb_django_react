import React, { Component } from 'react';
import { Button, Input, Form, message, } from 'antd';
import { LockTwoTone, MailTwoTone } from '@ant-design/icons';
const FormItem = Form.Item;

export default class Signin extends Component {
	state = {
		data: {}
	}


	signin(data){
        data.username = data.email;
        delete data.email;

        let url = 'http://localhost:8000/api';
        let self = this;

        fetch(url+'/login/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=> res.json())
        .then(res=>{
            if(res){
                if(res['non_field_errors']){
                    message.error(res['non_field_errors'])
                }
                if(res.token){
                    let token = res.token;
                    fetch(url+'/users/current/',{
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Token ${token}`
                        }
                    }).then(res=>res.json())
                    .then(res=> {
                        res.token = token;
                        window.localStorage.setItem('CurrentUser', JSON.stringify(res));
                        self.props.setModal1Visible(false);
                        self.props.currentuser(res);
                    })
                }
            }
        })

	}

	validatePassword(data){

	}


	render() {
		return (
            <Form onFinish={(data)=>this.signin(data)} className="sign-in-form">
                <FormItem name="email" rules={[{
                    type: 'email', message: 'The input is not valid E-mail!',
                }, {
                required: true, message: 'Please input your E-mail!',
                }]}>          
                    <Input prefix={<MailTwoTone type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />          
                </FormItem>

                <FormItem name="password" rules={[
                    {
                        required: true, message: 'Please input your Password!',
                    }
                ]}>          
                    <Input prefix={<LockTwoTone type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />          
                </FormItem>

                <FormItem>
                    <Button  type="primary" block htmlType="submit" style={{marginRight: '10px'}}>
                        Sign In
                    </Button>
                </FormItem>

            </Form>
		);
	}
}
