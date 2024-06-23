import React, {useEffect, useState} from "react";
import {Layout, Menu, MenuProps, notification, theme} from 'antd';

import {CloudUploadOutlined, HeartOutlined, LogoutOutlined, UnorderedListOutlined} from '@ant-design/icons';
import {get} from "../service/apiService";
import CreatePlaylist from "../create-play-list/CreatePlaylist";
import UploadSound from "../upload/UploadSound";
import MusicControls from "../music-control/MusicControl";

const {Header, Sider, Content} = Layout;


const Home: React.FC = () => {

    const [api, contextHolder] = notification.useNotification();
    const [playListSub, setPlayListSub] = useState([{key: '', label: ''}]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const fetchData = async () => {
        try {
            const res = await get('/playlists', api);

            const subPlaylist = res.result.map((value: any, index: number) => ({
                key: `playlist-${index + 2}`,
                label: value?.title
            }));

            setPlayListSub([
                {
                    key: 'playlist-1',
                    label: 'Create Playlist',
                },
                ...subPlaylist
            ]);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUploadSound = () => {
        handleOpenModal();
    };

    const handleLikedSound = () => {
        // Xử lý khi click vào Liked Sound
        console.log('Clicked Liked Sound');
    };

    const handlePlaylistClick = (key: React.Key) => {
        if (key === 'playlist-1') {
            handleOpenModal();
        }
    };

    const handleLogout = () => {
        // Xử lý khi click vào Logout
        console.log('Clicked Logout');
    };

    const handlePlaylistCreated = () => {
        setIsModalVisible(false);
        fetchData();
    };


    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    const username = localStorage.getItem('username');
    const menuItem: MenuProps['items'] = [
        {
            key: `menu-1`,
            icon: <CloudUploadOutlined />,
            label: `Upload Sound`,
            onClick: handleUploadSound
        },
        {
            key: `menu-2`,
            icon: <HeartOutlined />,
            label: `Liked Sound`,
            onClick: handleLikedSound
        },
        {
            key: `menu-3`,
            icon: <UnorderedListOutlined />,
            label: `Playlists`,
            children: playListSub,
            onClick: ({ key }) => handlePlaylistClick(key)
        },
        {
            key: `menu-4`,
            icon: <LogoutOutlined />,
            label: `Logout`,
            onClick: handleLogout
        }
    ];

    return (
        <>
            {contextHolder}
            <Layout
                style={{minHeight: '100vh'}}>
                <Sider trigger={null}>
                    <h2 style={{color: 'wheat'}}>{username}</h2>
                    <Sider width={200} style={{background: colorBgContainer}}>
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={['menu-1']}
                            defaultOpenKeys={['menu-1']}
                            style={{height: '100%', borderRight: 0}}
                            items={menuItem}
                        />
                    </Sider>
                </Sider>
                <Layout>
                    <Header style={{padding: 0, background: colorBgContainer, height: 90}}>
                        <MusicControls notificationInstance={api}/>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        Content
                        <CreatePlaylist visible={isModalVisible}
                                        onClose={handleCloseModal}
                                        notificationInstance={api}
                                        onPlaylistCreated={handlePlaylistCreated}/>
                        <UploadSound onClose={handleCloseModal}
                                     notificationInstance={api}
                                     visible={isModalVisible}/>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}
export default Home;