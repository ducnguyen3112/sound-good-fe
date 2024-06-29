import React, {useState} from 'react';
import {Popconfirm, Button, Select} from 'antd';
import {MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";

const {Option} = Select;

export interface PlaylistSelectorProps {
    playlists?: Playlist[];
    playlistId?: number;
    onSelect: (data: any) => void;
    onRemove: () => void;
}

export interface Playlist {
    id: number;
    title: string;
}

const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({playlists, onSelect, playlistId, onRemove}) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const [visible, setVisible] = useState(false);

    const handleConfirm = () => {
        if (selectedPlaylist && !playlistId) {
            onSelect(selectedPlaylist);
        } else {
            onRemove();
        }
        setVisible(false);
    };

    const handleChange = (value: number) => {
        const playlist = playlists?.find(playlist => playlist.id === value) || null;
        setSelectedPlaylist(playlist);
    };

    const handleVisibleChange = (newVisible: boolean) => {
        if (newVisible) {
            setSelectedPlaylist(null);
        }
        setVisible(newVisible);
    };

    return (
        <Popconfirm
            title={
                !playlistId ?
                    <Select
                        placeholder="Select playlist"
                        onChange={handleChange}
                        style={{width: 200}}
                        value={selectedPlaylist?.id || undefined}
                    >
                        {playlists?.map((playlist) => (
                            <Option key={playlist.id} value={playlist.id}>
                                {playlist.title}
                            </Option>
                        ))}
                    </Select> : 'Remove this sound?'
            }
            open={visible}
            onConfirm={handleConfirm}
            onCancel={() => setVisible(false)}
            onOpenChange={handleVisibleChange}
            okButtonProps={{disabled: !selectedPlaylist && !playlistId}}
            okText="Select"
            cancelText="Cancel"
        >
            <Button
                icon={!playlistId ? <PlusCircleOutlined/> : <MinusCircleOutlined/>}
            >
            </Button>
        </Popconfirm>
    );
};

export default PlaylistSelector;
