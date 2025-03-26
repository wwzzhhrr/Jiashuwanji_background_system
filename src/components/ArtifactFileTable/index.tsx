// src/components/FileList.tsx
import React, { useEffect, useState } from 'react';
import { Table, Spin, Toast, Button} from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { fetchFilesByArtifactId, deleteFile } from '../../services/ArtifactService.ts';
import { ArtifactFile } from '../../types/ArtifactsTypes.ts';

interface FileListProps {
  artifactId: number;
}

const FileList: React.FC<FileListProps> = ({ artifactId }) => {
  const [fileList, setFileList] = useState<ArtifactFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]); // 存储选中的文件 ID

  const columns: ColumnProps<ArtifactFile>[] = [
    {
      title: '文件 ID',
      dataIndex: 'id',
    },
    {
      title: '作品 ID',
      dataIndex: 'artifactId',
      render: (text: any, record: ArtifactFile) => record.artifact.id,
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
    },
    {
      title: '文件 URL',
      dataIndex: 'fileUrl',
      render: (text: string) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
  ];

  const fetchFiles = async () => {
    setLoading(true);
    setFileList([]); // 清空旧数据
    setSelectedRowKeys([]); // 清空选中状态
    try {
      console.log('FileList: 正在请求 artifactId:', artifactId);
      const response = await fetchFilesByArtifactId(artifactId);
      console.log('FileList: 响应:', response);
      if (response.code === 0) {
        setFileList(response.data);
      } else {
        setFileList([]);
        Toast.error('获取文件列表失败: ' + response.message);
      }
    } catch (error: any) {
      setFileList([]);
      Toast.error('请求失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length === 0) {
      Toast.warning('请先选择要删除的文件');
      return;
    }

    setLoading(true);
    try {
      // 逐个删除选中的文件
      for (const fileId of selectedRowKeys) {
        const response = await deleteFile(fileId);
        if (response.code !== 0) {
          Toast.error(`删除文件 ${fileId} 失败: ${response.message}`);
          return;
        }
      }
      Toast.success('删除成功');
      setSelectedRowKeys([]); // 清空选中状态
      await fetchFiles(); // 刷新文件列表
    } catch (error: any) {
      Toast.error('删除失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [artifactId]);

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: (string | number)[] | undefined) => {
      setSelectedRowKeys((selectedKeys as number[]) || []);
    },
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <Button
          theme="solid"
          type="danger"
          onClick={handleDelete}
          disabled={selectedRowKeys.length === 0}
        >
          删除选中文件
        </Button>
      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={fileList}
          rowKey="id"
          pagination={true}
          rowSelection={rowSelection} // 启用行选择
        />
      </Spin>
    </div>
  );
};

export default FileList;