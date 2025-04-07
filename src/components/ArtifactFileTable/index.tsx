import React, { useEffect, useState } from 'react';
import { Table, Spin, Toast, Button, AudioPlayer} from '@douyinfe/semi-ui';
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table';
import { fetchFilesByArtifactId, deleteFile } from '../../services/ArtifactService.ts';
import { ArtifactFile } from '../../types/ArtifactsTypes.ts';

interface FileListProps {
  artifactId: number;
  refreshKey?: number; // 添加 refreshKey 属性
}

const FileList: React.FC<FileListProps> = ({ artifactId, refreshKey }) => {
  const [fileList, setFileList] = useState<ArtifactFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const pagination = { pageSize: 5 };

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
      title: '文件展示',
      dataIndex: 'fileUrl',
      render: (text: string, record: any) => {
        // 判断文件类型是否为 audio/x-m4a
        if (record.fileType === 'audio/x-m4a') {
          return (
              <AudioPlayer
                  autoPlay={false}
                  audioUrl={text} // 使用 fileUrl 作为 audioUrl
                  style={{ width: '100%' }} // 调整样式，确保在表格中显示正常
              />
          );
        }
        // 其他文件类型显示为可点击链接
        return (
            <a href={text} target="_blank" rel="noopener noreferrer">
              {text}
            </a>
        );
      },
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
    setFileList([]);
    setSelectedRowKeys([]);
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
      for (const fileId of selectedRowKeys) {
        const response = await deleteFile(fileId);
        if (response.code !== 0) {
          Toast.error(`删除文件 ${fileId} 失败: ${response.message}`);
          return;
        }
      }
      Toast.success('删除成功');
      setSelectedRowKeys([]);
      await fetchFiles();
    } catch (error: any) {
      Toast.error('删除失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 当 artifactId 或 refreshKey 变化时，重新加载文件列表
  useEffect(() => {
    fetchFiles();
  }, [artifactId, refreshKey]);

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
              pagination={pagination}
              rowSelection={rowSelection}
          />
        </Spin>
      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={fileList}
          rowKey="id"
          pagination={pagination}
          rowSelection={rowSelection}
        />
      </Spin>
    </div>
  );
};

export default FileList;