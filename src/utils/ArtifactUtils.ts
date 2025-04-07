import { Artifact } from '../types/ArtifactsTypes.ts';

// 简化数据处理，避免添加不必要的字段
export const processArtifacts = (data: Artifact[]) => {
  if (!data || !Array.isArray(data)) {
    console.warn('processArtifacts received invalid data:', data);
    return [];
  }
  return data.map((artifact) => ({
    ...artifact
  }));
};