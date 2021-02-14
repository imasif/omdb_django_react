import React, { Component } from 'react';
import { Button, Input, Form, message} from 'antd';
import { LockTwoTone, MailTwoTone } from '@ant-design/icons';
const FormItem = Form.Item;

export default class Signup extends Component {
	state = {
		data: {}
	}

	signup(data){

        let url = 'http://localhost:8000/api';

        let self = this;


        fetch(url+'/signup/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=> res.json())
        .then(res=>{
            
            // if(res['non_field_errors']){
            //     message.error(res['non_field_errors'])
            // }

            data.username = data.email;
            delete data.email;

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
                            self.props.setModal2Visible(false);
                            self.props.currentuser(res);
                            
                            message.success('Logged in succesfully');
                        })
                    }
                }
            });

        });

		

	}

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || 
    !!value });
     }
     validateToNextPassword = (values, pass,item3) => {
         if(values)
        return true; // for simplicity
     }

	render() {
		return (
            <Form onFinish={(data)=>this.signup(data)} className="sign-in-form">
                <FormItem name="first_name" rules={[{
                required: true, message: 'Please input your First Name!',
                }]}>          
                    <Input prefix={<LockTwoTone type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="First Name" />          
                </FormItem>
                
                <FormItem name="last_name" rules={[{
                required: true, message: 'Please input your Last Name!',
                }]}>          
                    <Input prefix={<LockTwoTone type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="Last Name" />         
                </FormItem>

                <FormItem name="email" rules={[{
                type: 'email', message: 'The input is not valid E-mail!',
                }, {
                required: true, message: 'Please input your E-mail!',
                }]}>          
                    <Input prefix={<MailTwoTone type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />          
                </FormItem>

                <FormItem name="password" rules={[{
                required: true, message: 'Please input your Password!',
                }]}>          
                    <Input prefix={<LockTwoTone type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />          
                </FormItem>

                <FormItem name="password2" rules={[ {
                    required: true, message: 'Please confirm your password!',
                    },({ getFieldValue }) => ({
                    validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                        }
                        return Promise.reject('password does not match!');
                    },
                    }),
                ]}>          
                    <Input prefix={<LockTwoTone type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Confirm Password" onBlur={this.handleConfirmBlur} />        
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
