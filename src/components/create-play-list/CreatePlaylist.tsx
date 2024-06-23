import React, {useEffect, useState} from "react";
import {Input, Modal, notification} from "antd";
import {post} from "../service/apiService";
import {NotificationInstance} from "antd/lib/notification/interface";

interface CreatePlaylistProps {
    visible: boolean;
    onClose: () => void;
    onPlaylistCreated: () => void;
    notificationInstance: NotificationInstance;
}
const CreatePlaylist: React.FC<CreatePlaylistProps> = ({visible, onClose, onPlaylistCreated}) => {
    const [playlistTitle, setPlaylistTitle] = useState('');

    useEffect(() => {
        if (visible) {
            setPlaylistTitle('');
        }
    }, [visible]);

    const handleSavePlaylist = async () => {
        const res = await post('/playlists', notification, {title: playlistTitle});
        notification.success({
            message: 'Success',
            description: 'Playlist created successfully!',
        });
        setPlaylistTitle('');
        onClose();
        onPlaylistCreated();
    };

    return (
        <Modal
            title="Create Playlist"
            open={visible}
            onOk={handleSavePlaylist}
            onCancel={onClose}
            okText="Save"
            cancelText="Cancel"
        >
            <Input placeholder="Enter playlist title" onChange={(e) => setPlaylistTitle(e.target.value)} value={playlistTitle}/>
        </Modal>
    );
};

export default CreatePlaylist;