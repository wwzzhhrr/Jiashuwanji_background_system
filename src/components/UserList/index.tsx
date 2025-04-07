import React, { useState, useEffect } from 'react';
import { Table, Avatar, Button, Spin, Typography } from '@douyinfe/semi-ui';
import { ApiResponse, User } from '../../types/ArtifactsTypes';
import http from "../../http.ts";

const { Column } = Table;

const UserList: React.FC = () => {
  const { Title, Text } = Typography;
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const count = 5; // 每次加载的用户数
  let loadCount = 0; // 计数器，控制加载

  useEffect(() => {
    fetchUserCount();
    fetchData();
  }, []);

  // 获取用户总数
  const fetchUserCount = () => {
    http
        .get<ApiResponse<number>>('http://localhost:8080/user/count')
        .then(response => {
          if (response.data.code === 0) {
            setUserCount(response.data.data);
          } else {
            setError('Failed to fetch user count: ' + response.data.message);
          }
        })
        .catch(error => {
          setError('Failed to fetch user count');
          console.error('Error fetching user count:', error);
        });
  };

  // 获取用户列表
  const fetchData = () => {
    if (loading) return;
    setLoading(true);

    http
        .get<ApiResponse<User[]>>('http://localhost:8080/user/all')
        .then(response => {
          if (response.data.code === 0) {
            const fetchedUsers = response.data.data;
            const newUsers = [
              ...users,
              ...fetchedUsers.slice(loadCount * count, loadCount * count + count)
            ];
            loadCount++;
            setUsers(newUsers);
            setHasMore(newUsers.length < fetchedUsers.length);
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setHasMore(false);
        })
        .then(() => setLoading(false));
  };

  // 渲染用户名称（使用 Avatar 显示首字母）
  const renderName = (_text: string, record: User): React.ReactNode => (
      <div>
        <Avatar size="small" style={{ marginRight: 12 }}>
          {record.defaultName ? record.defaultName.slice(0, 1) : ''}
        </Avatar>
        {record.defaultName}
      </div>
  );

  // 渲染邮箱
  const renderEmail = (_text: string, record: User): React.ReactNode => (
      <div>{record.email}</div>
  );

  return (
      <div>
        {/* 用户总数信息 */}
        <Title style={{ margin: '8px 0' }}>用户列表</Title>
        {error ? (
            <Text type="danger">{error}</Text>
        ) : (
            <Text>用户总数: {userCount !== null ? userCount-1 : '加载中...'}</Text>
        )}

        {/* 使用 Table 展示用户数据 */}
        <Table dataSource={users} pagination={false}>
          <Column
              title="用户名称"
              dataIndex="defaultName"
              key="defaultName"
              render={renderName}
          />
          <Column title="邮箱" dataIndex="email" key="email" render={renderEmail} />
        </Table>

        {/* 加载更多按钮或加载动画 */}
        {loading ? (
            <div style={{ textAlign: 'center', marginTop: 12, padding: 12 }}>
              <Spin />
            </div>
        ) : hasMore ? (
            <div style={{ textAlign: 'center', marginTop: 12, padding: 12 }}>
              <Button onClick={fetchData}>显示更多</Button>
            </div>
        ) : (
            <div style={{ textAlign: 'center', marginTop: 12, padding: 12 }}>
              没有更多数据了
            </div>
        )}
      </div>
  );
};

export default UserList;
