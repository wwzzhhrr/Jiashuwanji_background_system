import {Button, Spin, Table} from '@douyinfe/semi-ui';
import {useContext, useEffect, useState} from 'react';
import {ArtifactContext} from '../../context/ArtifactContext.tsx';
import {Artifact, Tag} from '../../types/ArtifactsTypes.ts';
import {processArtifacts} from '../../utils/ArtifactUtils.ts';
import {useFetchArtifacts} from "../../services/ArtifactService.ts";
import {ColumnProps} from "@douyinfe/semi-ui/lib/es/table";
import {useNavigate} from "react-router-dom";
import Tags from "../Tags";

const ArtifactsTable = () => {
  const context = useContext(ArtifactContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const {artifacts, inputValue, totalElements} = context;
  const fetchArtifacts = useFetchArtifacts();
  const navigate = useNavigate();


  const loadData = async () => {
    setLoading(true); // 开始加载时设置为true
    await fetchArtifacts("", 0, pageSize); // 初次加载数据
    setLoading(false)
  };

  useEffect(()=>{
    loadData().catch(error => {
      console.error('Failed to load artifacts:', error);
    });
  }, []);

  if (loading) {
    return <Spin/>;
  }

  const processedData = processArtifacts(artifacts);

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    await fetchArtifacts(inputValue, newPage - 1, pageSize);
  };

  const columns = [
    {
      title: '见证人storyTeller',
      dataIndex: 'storyTeller',
      width: 300,
      render: (_: string, record: Artifact) => (
          <div style={{display: 'flex', alignItems: 'center'}}>
            <img
                src={record.avatarUrl}
                alt="avatar"
                style={{width: 50, height: 50, marginRight: 8}}
            />
            <span style={{color: 'var(--semi-color-text-0)', fontWeight: 500}}>{record.storyTeller}</span>
          </div>
      ),
    },
    {
      title: '介绍Introduction',
      dataIndex: 'intro',
    },
    {
      title: '标签Tags',
      dataIndex: 'tags',
      render: (tags: Tag[]) => (
          <Tags tagList={tags} maxNum={2} canBeDelete={false} canOpen={false}/>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: number) => {
        const statusMap = {
          0: '审核中',
          1: '通过',
          2: '打回'
        };
        return <span>{statusMap[status as keyof typeof statusMap] || '未知状态'}</span>; // 显式返回JSX元素
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (time: string) => <span>{new Date(time).toLocaleDateString()}</span> // 包装返回值
    },
    {
      title: '进入作品',
      dataIndex: 'id',  // 修改为实际存在的字段
      render: (id: number) => (
          <Button
              theme="borderless"
              onClick={() => navigate(`/storyDetail/${id}`)}
          >
            查看详情
          </Button>
      )
    }
  ] as ColumnProps<Artifact>[]; // 添加类型断言


  return (
      <Table
          columns={columns}
          dataSource={processedData}
          rowKey="id"
          pagination={{
            currentPage,
            pageSize,
            total: totalElements,
            onPageChange: handlePageChange,
          }}
      />
  );
};

export default ArtifactsTable;