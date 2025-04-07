// src/App.tsx
import React, { useState } from 'react';
import FileUpload from './components/AddArtifactFiles';
import FileList from './components/ArtifactFileTable';
import { InputNumber } from '@douyinfe/semi-ui';
import { useCallback } from 'react';

const App: React.FC = () => {
  const [artifactId, setArtifactId] = useState<number>(2);
  const [refreshKey, setRefreshKey] = useState<number>(0); // 用于触发刷新

  // 刷新方法，更新 refreshKey 触发 FileList 重新加载
  const refreshFiles = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  console.log('App: 当前 artifactId:', artifactId);

  return (
    <div style={{ padding: 20 }}>
      <h2>文件管理</h2>
      <div style={{ marginBottom: 20 }}>
        <label>作品 ID: </label>
        <InputNumber
          value={artifactId}
          onChange={(value) => {
            const newId = Number(value);
            setArtifactId(newId);
            console.log('App: artifactId 变更为:', newId);
          }}
          min={1}
          style={{ width: 120 }}
        />
      </div>
      <FileUpload artifactId={artifactId} onFileAdded={refreshFiles} />
      <FileList artifactId={artifactId} refreshKey={refreshKey} />
    </div>
  );
};

export default App;