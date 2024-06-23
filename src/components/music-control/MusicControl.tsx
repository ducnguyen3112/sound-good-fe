import React, {useState} from 'react';
import {Button, Slider} from 'antd';
import {
    CaretLeftOutlined,
    CaretRightOutlined,
    PauseOutlined,
    PlayCircleOutlined,
    SoundOutlined,
} from '@ant-design/icons';
import {get} from "../service/apiService";
import {NotificationInstance} from "antd/lib/notification/interface";

interface MusicControlProps {
    notificationInstance: NotificationInstance;
}
const MusicControls: React.FC<MusicControlProps> = ({notificationInstance}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioData, setAudioData] = useState<ArrayBuffer | null>(null);
    const handlePlay = () => {
        console.log('Clicked Play');
    };

    const handlePause = () => {
        console.log('Clicked Pause');
    };

    const handleNext = async () => {
        try {
            const response = await get(`sounds/18`, notificationInstance);
            const { data } = response;
            setAudioData(data);
        } catch (error) {
            console.error('Error fetching next song:', error);
        }
    };

    const handlePrevious = () => {
        console.log('Clicked Previous');
    };

    const handleVolumeChange = (value: number) => {
        console.log('Volume changed to:', value);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        if (isPlaying) {
            console.log('Clicked Pause');
        } else {
            console.log('Clicked Play');
        }
    };

    return (
        <div style={{display: 'flex', justifyContent: "center", alignItems: "flex-end", height: "100%"}}>

            <div style={{display: 'flex', justifyContent: "center", alignItems: "center", marginBottom: 15}}>
                <Button icon={<CaretLeftOutlined/>} onClick={handlePrevious} style={{marginRight: 8}}/>
                <Button icon={isPlaying ? <PauseOutlined/> : <PlayCircleOutlined/>} onClick={togglePlayPause}
                        style={{marginRight: 8}}/>
                <Button icon={<CaretRightOutlined/>} onClick={handleNext} style={{marginRight: 50}}/>
                <SoundOutlined></SoundOutlined>
                <div>
                    <Slider
                        defaultValue={30}
                        style={{marginLeft: 10, marginRight: 10, width: 100}}
                        onChange={handleVolumeChange}
                        min={0}
                        max={100}
                        step={1}
                    />
                </div>
            </div>
        </div>
    );
};

export default MusicControls;
