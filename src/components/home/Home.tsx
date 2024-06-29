import React, {useEffect, useRef, useState} from "react";
import {Button, Layout, Menu, MenuProps, notification, Pagination, theme} from 'antd';

import {
    CaretLeftOutlined,
    CaretRightOutlined,
    CloudUploadOutlined,
    HeartOutlined, HomeOutlined,
    LogoutOutlined,
    PauseOutlined,
    PlayCircleOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import {get, post, put} from "../service/apiService";
import CreatePlaylist from "../create-play-list/CreatePlaylist";
import UploadSound from "../upload/UploadSound";
import SoundList, {Sound} from "../sound-list/SoundList";
import {useNavigate} from "react-router-dom";
import {Playlist} from "../playlist-selector/PlaylistSelector";

const {Header, Sider, Content} = Layout;

const Home: React.FC = () => {

    const navigate = useNavigate()
    const [api, contextHolder] = notification.useNotification();
    const [playListSub, setPlayListSub] = useState([{key: '', label: ''}]);
    const [isModalUploadVisible, setIsModalUploadVisible] = useState(false);
    const [isModalCreatePlaylistVisible, setIsModalCreatePlaylistVisible] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [soundList, setSoundList] = useState<Sound[]>([]);
    const [playingSound, setPlayingSound] = useState<Sound>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLikedList, setIsLikedList] = useState(false);
    const [playListId, setPlayListId] = useState<number>();
    const [playlist, setPlaylist] = useState<Playlist[]>()


    const handleCloseModalUpload = () => {
        setIsModalUploadVisible(false);
    };

    const handleCloseModalCreatePlaylist = () => {
        setIsModalCreatePlaylistVisible(false);
    };

    const fetchSoundList = async (page: number) => {
        const params = {
            size: 15,
            isLiked: isLikedList,
            page,
            playListId,
        }
        const res = await get('/sounds', api, params);
        let sounds: Sound[] = res.result.data;
        sounds = sounds.map(({id, title, liked}) => ({
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
            key: value.id,
            label: value?.title
        }));

        const playList = subPlaylist.map((value: any) => ({
            id: value.key,
            title: value.label
        }));
        setPlaylist(playList);

        setPlayListSub([
            {
                key: 'playlist-0',
                label: 'Create Playlist',
            },
            ...subPlaylist
        ]);
    };

    useEffect(() => {
        fetchPlayList();
    }, []);

    useEffect(() => {
        fetchSoundList(currentPage);
    }, [currentPage, isLikedList, playListId]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleUploadSound = () => {
        setIsModalUploadVisible(true);
    };

    const handleCreatePlaylist = () => {
        setIsModalCreatePlaylistVisible(true)
    };

    const handleLikedSound = () => {
        setIsLikedList(true);
        setPlayListId(undefined);
    };

    const handleHome = () => {
        setIsLikedList(false);
        setPlayListId(undefined);
    };


    const handlePlaylistClick = (key: React.Key) => {
        if (key === 'playlist-0') {
            handleCreatePlaylist();
        } else {
            setIsLikedList(false);
            setPlayListId(key as number);
        }
    }

    const handleLogout = async () => {
        const res = await post('/auth/logout', api);
        if (res) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const handlePlaylistCreated = () => {
        setIsModalCreatePlaylistVisible(false);
        fetchPlayList();
    };


    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    const username = localStorage.getItem('username');
    const menuItem: MenuProps['items'] = [
        {
            key: `menu-1`,
            icon: <HomeOutlined />,
            label: `Home`,
            onClick: handleHome
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
        if (playingSound) {
            const currentIndex = soundList.findIndex(sound => sound.id === playingSound.id);
            if (currentIndex !== -1) {
                const previousIndex = (currentIndex - 1 + soundList.length) % soundList.length;
                handlePlayInList(soundList[previousIndex]);
                setPlayingSound(soundList[previousIndex]);
            }
        } else if (soundList.length > 0) {
            handlePlayInList(soundList[0]);
            setPlayingSound(soundList[0]);
        }
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

    const handleLikeSoundInList = async (song: Sound) => {
        const res = await put(`/sounds/${song.id}/favorites?isLiked=${!song.liked}`, api);
        if (res) {
            await fetchSoundList(currentPage);
        }
    };

    return (
        <>
            {contextHolder}
            <Layout
                style={{minHeight: '100vh'}}>
                <Sider trigger={null}>
                    <h2 style={{color: 'wheat'}}>{username}</h2>

                    <Sider width={200} style={{background: colorBgContainer}}>
                        <Button style={{background: colorBgContainer, width: '100%', height: 50, border: 10}} icon={<CloudUploadOutlined/>} onClick={handleUploadSound}>
                            Upload Sound
                        </Button>
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
                        <SoundList sounds={soundList}
                                   onPlay={handlePlayInList}
                                   onLike={handleLikeSoundInList}
                                   playList={playlist}
                                   playlistId={playListId}
                                   actionPlaylist={() => fetchSoundList(1)}
                                   notificationInstance={api}/>
                        <Pagination
                            current={currentPage}
                            total={totalPages * 10}
                            onChange={handlePageChange}
                            style={{marginTop: 20, textAlign: 'center'}}
                        />
                        <CreatePlaylist visible={isModalCreatePlaylistVisible}
                                        onClose={handleCloseModalCreatePlaylist}
                                        notificationInstance={api}
                                        onPlaylistCreated={handlePlaylistCreated}/>
                        <UploadSound onClose={handleCloseModalUpload}
                                     notificationInstance={api}
                                     visible={isModalUploadVisible}
                                     onUploadSuccess={() => fetchSoundList(currentPage)}/>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}
export default Home;