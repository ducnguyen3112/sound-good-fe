import React from 'react';
import {Button, List} from 'antd';
import {HeartFilled, HeartOutlined, PlayCircleOutlined} from '@ant-design/icons';


export interface Sound {
    id: number;
    title: string;
    url: string;
    liked: boolean;
    playing: boolean;
}

export interface SoundListProp {
    sounds: Sound[];
    onPlay: (data: any) => void;
}

const SoundList: React.FC<SoundListProp> = ({sounds, onPlay}) => {

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
                            >
                            </Button>
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
