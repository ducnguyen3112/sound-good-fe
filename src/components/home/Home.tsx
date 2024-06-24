import React, {useEffect, useRef, useState} from "react";
import {Button, Layout, Menu, MenuProps, notification, Pagination, theme} from 'antd';

import {
    CaretLeftOutlined,
    CaretRightOutlined,
    CloudUploadOutlined,
    HeartOutlined,
    LogoutOutlined,
    PauseOutlined,
    PlayCircleOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import {get} from "../service/apiService";
import CreatePlaylist from "../create-play-list/CreatePlaylist";
import UploadSound from "../upload/UploadSound";
import SoundList, {Sound} from "../sound-list/SoundList";

const {Header, Sider, Content} = Layout;

const Home: React.FC = () => {

    const [api, contextHolder] = notification.useNotification();
    const [playListSub, setPlayListSub] = useState([{key: '', label: ''}]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [soundList, setSoundList] = useState<Sound[]>([]);
    const [playingSound, setPlayingSound] = useState<Sound>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const fetchSoundList = async (page: number) => {
        const params = {
            page: page,
            size: 15,
        }
        const res = await get('/sounds', api, params);
        let sounds: Sound[] = res.result.data;
        sounds = sounds.map(({ id, title, liked }) => ({
            id,
            url: `${process.env.REACT_APP_API_URL}/sounds/${id}`,
            title,
            liked,
            playing: false
        }));

        setSoundList(sounds);
        setTotalPages(res.result.totalPages);
    }

    const fetchPlayList = async () => {
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
    };

    useEffect(() => {
        fetchPlayList();
        fetchSoundList(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleUploadSound = () => {
        handleOpenModal();
    };

    const handleLikedSound = () => {
        console.log('Clicked Liked Sound');
    };


    const handlePlaylistClick = (key: React.Key) => {
        if (key === 'playlist-1') {
            handleOpenModal();
        }
    };

    const handleLogout = () => {
        console.log('Clicked Logout');
    };

    const handlePlaylistCreated = () => {
        setIsModalVisible(false);
        fetchPlayList();
    };


    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    const username = localStorage.getItem('username');
    const menuItem: MenuProps['items'] = [
        {
            key: `menu-1`,
            icon: <CloudUploadOutlined/>,
            label: `Upload Sound`,
            onClick: handleUploadSound
        },
        {
            key: `menu-2`,
            icon: <HeartOutlined/>,
            label: `Liked Sound`,
            onClick: handleLikedSound
        },
        {
            key: `menu-3`,
            icon: <UnorderedListOutlined/>,
            label: `Playlists`,
            children: playListSub,
            onClick: ({key}) => handlePlaylistClick(key)
        },
        {
            key: `menu-4`,
            icon: <LogoutOutlined/>,
            label: `Logout`,
            onClick: handleLogout
        }
    ];
    const handlePausePlayButton = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handlePreviousSound = () => {

    };

    const handleNextSound = () => {
        if (playingSound) {
            const currentIndex = soundList.findIndex(sound => sound.id === playingSound?.id);
            const nextIndex = (currentIndex + 1) % soundList.length;
            handlePlayInList(soundList[nextIndex]);
        } else {
            handlePlayInList(soundList[0]);
            setPlayingSound(soundList[0]);
        }

    };

    const handleAudioEnded = () => {
        handleNextSound();
    };

    const handlePlayInList = (song: any) => {
        setSoundList(prevSoundList =>
            prevSoundList.map(s =>
                s.id === song.id ? {...s, playing: true} : {...s, playing: false}
            )
        );
        setPlayingSound(song);
        if (audioRef.current) {
            audioRef.current.src = song.url;
        }
        setIsPlaying(false);
    };

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

                        <div style={{height: 42}}>
                            <audio ref={audioRef} src={playingSound?.url} controls style={{width: '100%'}}
                                   controlsList="nodownload" onCanPlay={() => {
                                setIsPlaying(true);
                                audioRef.current?.play()
                            }}
                                   onEnded={handleAudioEnded}/>
                        </div>
                        <Button icon={<CaretLeftOutlined/>} onClick={handlePreviousSound} style={{marginRight: 8}}
                                disabled={!playingSound}/>
                        <Button icon={isPlaying ? <PauseOutlined/> : <PlayCircleOutlined/>}
                                onClick={handlePausePlayButton}
                                style={{marginRight: 8}} disabled={!playingSound}/>
                        <Button icon={<CaretRightOutlined/>} onClick={handleNextSound} style={{marginRight: 50}}
                                disabled={!playingSound}/>

                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            display: "flex",
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}
                    >
                        <SoundList sounds={soundList} onPlay={handlePlayInList}/>
                        <Pagination
                            current={currentPage}
                            total={totalPages * 10}
                            onChange={handlePageChange}
                            style={{ marginTop: 20, textAlign: 'center' }}
                        />
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