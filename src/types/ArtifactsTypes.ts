export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface CollectResponse {
  "isCollected": boolean;
}

export interface User {
  id: string;
  defaultName: string;
  email: string;
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

