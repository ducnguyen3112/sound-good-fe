import React, {useEffect, useState} from 'react';
import {Button, Form, Input, notification} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Link, useNavigate} from "react-router-dom";
import {loginUser} from "../service/apiService";
import {useAuth} from "../auth/AuthProvider";

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

    const { tokenExpiredMessage, setTokenExpiredMessage, setIsAuthenticated } = useAuth();

    useEffect(() => {
        if (tokenExpiredMessage) {
            notification.error({
                message: tokenExpiredMessage,
            });
        }
    }, [tokenExpiredMessage]);

    const onFinish = async (values: any) => {
        setLoading(true);
        const response = await loginUser(values, api);
        if (response) {
            localStorage.setItem('token', response.result.token);
            localStorage.setItem('role', response.result.role);
            localStorage.setItem('exp', response.result.exp);
            localStorage.setItem('username', values.username);
            setIsAuthenticated(true);
            if (response.result.role === 'USER') {
                navigate('/home');
            } else if (response.result.role === 'ADMIN') {
                navigate('/admin/dashboard');
            }
        }
        setLoading(false);
        setTokenExpiredMessage('');
    };

    const onFinishFailed = (errorInfo: any) => {
    };

    return (
        <>
            {contextHolder}
            <Form
                name="login-form"
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{maxWidth: 300, margin: 'auto', paddingTop: 100, fontSize: '14px'}}
            >
                <h1>Welcome Back!</h1>
                <Form.Item
                    name="username"
                    rules={[{required: true, message: 'Please input your username!'}]}
                >
                    <Input prefix={<UserOutlined/>} placeholder="Username"/>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password prefix={<LockOutlined/>} placeholder="Password"/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Log in
                    </Button>
                    Or <Link to="/register">register now!</Link>
                </Form.Item>
            </Form>
        </>
    );
};

export default Login;
