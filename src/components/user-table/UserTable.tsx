import React from 'react';
import {Button, message, Space, Table, Tag} from 'antd';
import {CheckOutlined, CloseCircleOutlined} from '@ant-design/icons';

export interface User {
    id: number;
    username: string;
    role: string;
    status: string;
}

export interface UserTableProps {
    users?: User[];
    onAction: (id: number, action: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({users, onAction}) => {

    const handleAction = (id: number, action: string) => {
        onAction(id, action);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = status === 'ACTIVE' ? 'geekblue' : 'volcano';
                return <Tag color={color} key={status}>{status?.toUpperCase()}</Tag>
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: User) => (
                <Space size="middle">
                    <Button icon={record.status === 'ACTIVE' ? <CloseCircleOutlined/> : <CheckOutlined />} onClick={() => {
                        const action = record.status === 'ACTIVE' ? 'DEACTIVATE' : 'ACTIVATE';
                        handleAction(record.id, action);
                    }}> {record.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={users} rowKey="id" pagination={false}/>
        </>

    );
};

export default UserTable;
