// src/components/FileUpload.tsx
import React, { useState } from 'react';
import { Upload, Button, Toast } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';
import { uploadFile, addFileToDatabase } from '../../services/ArtifactService';

interface FileUploadProps {
  artifactId: number; // 动态传入 artifactId
}

const FileUpload: React.FC<FileUploadProps> = ({ artifactId }) => {
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<string | null>(null);

  const uploadAction = 'http://localhost:8080/upload';

  const handleUploadSuccess = (response: any, file: any) => {
    if (response.code === 0 && response.data) {
      setUploadedFileUrl(response.data);
      setUploadedFileName(file.name);
      setUploadedFileType(file.type);
      Toast.success('文件上传成功');
    } else {
      console.log('上传失败，响应:', response);
      Toast.error('文件上传失败');
    }
  };

  const handleUploadError = (err: any) => {
    console.error('上传错误:', err);
    Toast.error('文件上传失败: ' + err.message);
  };

  const handleAddFile = async () => {
    if (!uploadedFileUrl || !uploadedFileName || !uploadedFileType) {
      Toast.warning('请先上传文件');
      return;
    }

    try {
      const response = await addFileToDatabase({
        artifactId,
        fileType: uploadedFileType,
        fileUrl: uploadedFileUrl,
        fileName: uploadedFileName,
      });

      if (response.code === 0) {
        Toast.success('文件添加成功');
        setUploadedFileUrl(null);
        setUploadedFileName(null);
        setUploadedFileType(null);
      } else {
        Toast.error('文件添加失败: ' + response.message);
      }
    } catch (err: any) {
      Toast.error('文件添加失败: ' + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Upload
        action={uploadAction}
        name="file"
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
        multiple={false}
      >
        <Button icon={<IconUpload />} theme="light">
          点击上传
        </Button>
      </Upload>
      <Button
        theme="solid"
        style={{ marginTop: 20 }}
        onClick={handleAddFile}
        disabled={!uploadedFileUrl}
      >
        给你的作品添加文件
      </Button>
    </div>
  );
};

export default FileUpload;