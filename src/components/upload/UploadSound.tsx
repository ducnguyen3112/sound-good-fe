import React, {useEffect, useState} from 'react';
import {Button, Input, message, Modal, Upload} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {NotificationInstance} from 'antd/lib/notification/interface';
import {post} from '../service/apiService';

interface UploadSoundProps {
    visible: boolean;
    onClose: () => void;
    notificationInstance: NotificationInstance;
}

const UploadSound: React.FC<UploadSoundProps> = ({visible, onClose, notificationInstance}) => {
    const [fileList, setFileList] = useState<any[]>([]);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (visible) {
            setFileList([]);
            setFileName('');
        }
    }, [visible]);

    const handleFileChange = (info: any) => {
        let fileList = [...info.fileList];

        fileList = fileList.slice(-1);

        setFileList(fileList);

        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            setFileName(info.file.name);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        } else if (info.file.status !== 'removed') {
            setFileName(info.file.name);
        }
    };

    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.error('Please select a file to upload.');
            return;
        }

        const file = fileList[0].originFileObj;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await post('/file/upload', notificationInstance, formData, true);
            if (res) {
                console.log(res)
                const req = {
                    title: fileName,
                    soundPath: res.result.filePath
                }
                const createSoundRes = await post('/sounds', notificationInstance, req);
                if (createSoundRes) {
                    message.success('File uploaded successfully');
                    onClose();
                }
            }

        } catch (error) {
            message.error('Upload failed');
            console.error('Error uploading file:', error);
        }
    };

    return (
        <Modal
            title="Upload Sound"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="upload" type="primary" onClick={handleUpload} disabled={!fileName}>
                    Upload
                </Button>,
            ]}
        >
            <Upload
                beforeUpload={() => false}
                maxCount={1}
                onChange={handleFileChange}
                fileList={fileList}
            >
                <Button icon={<UploadOutlined/>}>Select Sound</Button>
            </Upload>
            <Input
                style={{marginTop: '10px'}}
                placeholder="Enter sound name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
            />
        </Modal>
    );
};

export default UploadSound;
