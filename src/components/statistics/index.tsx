import { Button, Slider, Spin, Descriptions } from '@douyinfe/semi-ui';
import { useState } from "react";

import http from "../../http.ts";
import {ApiResponse} from "../../types/ArtifactsTypes.ts";

interface AnalyticsData {
  uniqueDevices: number;
  eventCounts: {
    SESSION: number;
    PAGEVIEW: number;
    EVENT: number;
  };
  totalEvents: number;
}

export function Statistics() {
  const [from, setFrom] = useState(23);
  const [to, setTo] = useState(30);
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 计算日期范围
  const calculateDateRange = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0]; // 返回 YYYY-MM-DD 格式
  };

  // 获取统计数据
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // 计算实际日期
      const startDate = calculateDateRange(30 - from);
      const endDate = calculateDateRange(30 - to);

      const response = await http.get<ApiResponse<any>>('/api/events/statistics', {
        params: {
          start: startDate,
          end: endDate
        }
      });

      setAnalyticsData(response.data.data);
    } catch (err) {
      setError('获取数据失败，请稍后重试');
      console.error('API请求失败:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Slider
              defaultValue={[23, 30]}
              range
              tipFormatter={v => `${30 - v}天前`}
              max={30}
              style={{ width: '20%' }}
              onChange={v => {
                setFrom(v[0]);
                setTo(v[1]);
              }}
          />
        </div>

        <Button
            onClick={fetchAnalytics}
            loading={loading}
            disabled={loading}
            type="primary"
            style={{ marginBottom: '20px' }}
        >
          获取从{30 - from}天前到{30 - to}天前的网站访问信息
        </Button>

        {error && (
            <div style={{ color: 'red', margin: '10px 0' }}>
              {error}
            </div>
        )}

        {analyticsData && !loading && (
            <Descriptions>
              <Descriptions.Item itemKey="独立设备数">
                {analyticsData.uniqueDevices}
              </Descriptions.Item>
              <Descriptions.Item itemKey="总事件数">
                {analyticsData.totalEvents}
              </Descriptions.Item>
              <Descriptions.Item itemKey="会话事件">
                {analyticsData.eventCounts.SESSION}
              </Descriptions.Item>
              <Descriptions.Item itemKey="页面浏览">
                {analyticsData.eventCounts.PAGEVIEW}
              </Descriptions.Item>
              <Descriptions.Item itemKey="交互事件">
                {analyticsData.eventCounts.EVENT}
              </Descriptions.Item>
            </Descriptions>
        )}

        {loading && <Spin tip="数据加载中..." />}
      </div>
  );
}