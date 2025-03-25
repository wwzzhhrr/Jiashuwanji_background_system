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
  tags: storyTag[];
}

export interface storyTag {
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
  tags: storyTag[];
  deleted: boolean;
  collected: boolean;
}