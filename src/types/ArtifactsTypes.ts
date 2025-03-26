export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface Artifact {
  id: number;
  storyTeller: string;
  intro: string;
  avatarUrl: string;
  status: number;
  createTime: string;
  deleted: boolean;
  collected: boolean;
  tags: Tag[];
}

export interface Tag {
  id: number;
  tagName: string;
}

export interface ArtifactsResponse {
  content: Artifact[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  number: number;
  size: number;
}

export interface StoryDetail {
  id: number;
  storyTeller: string;
  intro: string;
  avatarUrl: string;
  status: number;
  createTime: string;
  tags: Tag[];
  deleted: boolean;
  collected: boolean;
}

// src/types/index.ts
export interface ArtifactFile {
  id: number;
  artifact: { id: number };
  fileType: string;
  fileUrl: string;
  fileName: string;
  createdAt: string;
}

export interface FileUploadResponse {
  code: number;
  message: string;
  data: string; // 文件 URL
}

export interface FileAddResponse {
  code: number;
  message: string;
  data: ArtifactFile;
}

export interface FileListResponse {
  code: number;
  message: string;
  data: ArtifactFile[];
}

export interface DeleteFileResponse {
  code: number;
  message: string;
  data: null;
}