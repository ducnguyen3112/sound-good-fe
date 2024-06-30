import React, {useEffect, useState} from 'react';
import {Layout, Menu, message, notification, Pagination} from 'antd';
import UserTable, {User} from "../user-table/UserTable";
import {get, post, put} from "../service/apiService";
import {useNavigate} from "react-router-dom";

const { Header, Content, Sider } = Layout;

const Dashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>();
    const [page, setPage] = useState<number>(1);
    const [api, contextHolder] = notification.useNotification();
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();



    useEffect(() => {
        fetchUsers(page);
    }, [page]);
    const fetchUsers = async (page: number) => {
        const params = {
            size: 10,
            page,
        }
        const res = await get('/users', api, params);
        if (res) {
            setUsers(res?.result.data);
            setTotalPages(res?.result.totalPages);

        }
    }
    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const handleLogout = async () => {
        const res = await post('/auth/logout', api);
        if (res) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const handleAction = async (id: number, action: string) => {
        const body = {
            action
        }
        const res = await put(`/users/${id}/action`, api, body);
        if (res) {
            message.success('Success');
            fetchUsers(page);
        }
    };
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {contextHolder}
            <Sider collapsible>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['dash-1']} mode="inline">
                    <Menu.Item key="dash-1">Users</Menu.Item>
                    <Menu.Item key="dash-2" onClick={handleLogout}>Logout</Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }} />
                <Content style={{ margin: '0 16px' }}>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        <UserTable users={users} onAction={handleAction}/>
                        <Pagination
                            current={page}
                            total={totalPages * 10}
                            onChange={handlePageChange}
                            style={{marginTop: 20, textAlign: 'center'}}
                        />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
