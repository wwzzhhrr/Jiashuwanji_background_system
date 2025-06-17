import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Button, Spin, Typography } from '@douyinfe/semi-ui';
import InfiniteScroll from 'react-infinite-scroller';

const UserList = () => {
    const { Title, Text } = Typography;
    const [users, setUsers] = useState([]);
    const [userCount, setUserCount] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const count = 5; // 每次加载的用户数
    let loadCount = 0; // 计数器，控制加载

    useEffect(() => {
        fetchUserCount();
        fetchData();
    }, []);

    // 获取用户总数
    const fetchUserCount = () => {
        axios.get('http://localhost:8080/user/count')
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
        axios.get('http://localhost:8080/user/all')
            .then(response => {
                if (response.data.code === 0) {
                    const fetchedUsers = response.data.data;
                    const newUsers = [...users, ...fetchedUsers.slice(loadCount * count, loadCount * count + count)];
                    loadCount++;
                    setUsers(newUsers);
                    setHasMore(newUsers.length < fetchedUsers.length);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setHasMore(false);
            })
            .finally(() => setLoading(false));
    };

    const showLoadMore = loadCount % 4 === 0;
    const loadMoreButton = !loading && hasMore && showLoadMore ? (
        <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
            <Button onClick={fetchData}>显示更多</Button>
        </div>
    ) : null;

    return (
        <div>
            {/* 用户总数信息 */}
            <Title style={{ margin: '8px 0' }}>用户列表</Title>
            {error ? (
                <Text type="danger">{error}</Text>
            ) : (
                <Text>用户总数: {userCount !== null ? userCount : '加载中...'}</Text>
            )}

            {/* 用户列表 */}
            <div
                className="light-scrollbar"
                style={{ height: 420, overflow: 'auto', border: '1px solid var(--semi-color-border)', padding: 10, marginTop: 10 }}
            >
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    threshold={20}
                    loadMore={fetchData}
                    hasMore={!loading && hasMore && !showLoadMore}
                    useWindow={false}
                >
                    <List
                        loadMore={loadMoreButton}
                        dataSource={users}
                        renderItem={user => (
                            <List.Item
                                main={
                                    <div>
                                        <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>
                                            {user.defaultName}
                                        </span>
                                        <p style={{ color: 'var(--semi-color-text-2)', margin: '4px 0' }}>
                                            邮箱: {user.email}
                                        </p>
                                    </div>
                                }
                            />
                        )}
                    />
                    {loading && hasMore && (
                        <div style={{ textAlign: 'center' }}>
                            <Spin />
                        </div>
                    )}
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default UserList;
