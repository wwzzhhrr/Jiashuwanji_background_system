// src/App.tsx
import React, { useState } from 'react';
import FileUpload from './components/AddArtifactFiles';
import FileList from './components/ArtifactFileTable';
import { InputNumber } from '@douyinfe/semi-ui';

const App: React.FC = () => {
  const [artifactId, setArtifactId] = useState<number>(2); // 默认 artifactId 为 2

  return (
    <div style={{ padding: 20 }}>
      <h2>文件管理</h2>
      <div style={{ marginBottom: 20 }}>
        <label>作品 ID: </label>
        <InputNumber
          value={artifactId}
          onChange={(value) => setArtifactId(Number(value))}
          min={1}
          style={{ width: 120 }}
        />
      </div>
      <FileUpload artifactId={artifactId} />
      <FileList artifactId={artifactId} />
    </div>
  );
};

export default App;