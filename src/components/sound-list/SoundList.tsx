import React from 'react';
import {Button, List, message} from 'antd';
import {HeartFilled, HeartOutlined, PlayCircleOutlined} from '@ant-design/icons';
import PlaylistSelector, {Playlist} from "../playlist-selector/PlaylistSelector";
import {put} from "../service/apiService";
import {NotificationInstance} from "antd/lib/notification/interface";


export interface Sound {
    id: number;
    title: string;
    url: string;
    liked: boolean;
    playing: boolean;
}

export interface SoundListProp {
    sounds: Sound[];
    playList?: Playlist[];
    onPlay: (data: any) => void;
    onLike: (data: any) => void;
    notificationInstance: NotificationInstance,
    actionPlaylist: () => void;
    playlistId?: number;
}

const SoundList: React.FC<SoundListProp> = ({sounds, onPlay, onLike, playList, notificationInstance, actionPlaylist, playlistId}) => {

    const handleActionPlaylist = async (data: any, sound: Sound, action = 'ADD' || 'REMOVE') => {
        const res = await put(`/playlists/${data.id}/sounds/${sound.id}?action=${action}`, notificationInstance);
        if (res) {
            actionPlaylist();
            message.success('Sound added to playlist');
        }
    }

    const handleRemoveSound = async (sound: Sound) => {
        const res = await put(`/playlists/${playlistId}/sounds/${sound.id}?action=REMOVE`, notificationInstance);
        if (res) {
            actionPlaylist();
            message.success('Sound removed from playlist');
        }
    }
    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={sounds}
                renderItem={song => (
                    <List.Item
                        actions={[
                            <Button
                                type={song.playing ? "primary" : "default"}
                                icon={<PlayCircleOutlined/>}
                                onClick={() => onPlay(song)}
                            >
                            </Button>,
                            <Button
                                icon={song.liked ? <HeartFilled style={{color: "red"}}/> : <HeartOutlined/>}
                                onClick={() => onLike(song)}
                            >
                            </Button>,
                            <PlaylistSelector playlists={playList}
                                              onSelect={(data) => handleActionPlaylist(data, song, 'ADD')}
                                              playlistId={playlistId}
                            onRemove={() => handleRemoveSound(song)}></PlaylistSelector>
                        ]}
                    >
                        <List.Item.Meta
                            title={song.title}
                        />
                    </List.Item>
                )}
            />
        </>
    );
};

export default SoundList;
