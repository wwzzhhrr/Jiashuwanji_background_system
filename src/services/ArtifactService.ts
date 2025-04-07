import {useContext} from "react";
import http from '../http';
import {ApiResponse, ArtifactsResponse,FileUploadResponse, FileAddResponse, FileListResponse, DeleteFileResponse} from '../types/ArtifactsTypes.ts';
import {ArtifactContext} from "../context/ArtifactContext.tsx";
import axios from "axios";

export const useFetchArtifacts = () => {
  const context = useContext(ArtifactContext);
  const { setArtifacts, setTotalElements } = context;

  return async (search: string, page: number, size: number) => {
    try {
      console.log(`Fetching artifacts with params: page=${page}, size=${size}, search=${search}`);
      const response = await http.get<ApiResponse<ArtifactsResponse>>('/artifacts', {
        params: {
          page,
          size,
          search
        }
      });

      console.log('API response:', response.data);
      
      if (response.data.code !== 0) {
        console.error('API error:', response.data.message);
        return;
      }

      const responseData = response.data.data;
      
      if (!responseData || !responseData.content) {
        console.error('Invalid response data structure:', responseData);
        return;
      }
      
      console.log('Setting artifacts:', responseData.content);
      console.log('Total elements:', responseData.totalElements);
      
      setArtifacts(responseData.content);
      setTotalElements(responseData.totalElements);

    } catch (error) {
      console.error('Error fetching artifacts:', error);
    }
  };
};

// 上传文件
export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post<FileUploadResponse>('http://localhost:8080/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 添加文件到数据库
export const addFileToDatabase = async (data: {
  artifactId: number;
  fileType: string;
  fileUrl: string;
  fileName: string;
}): Promise<FileAddResponse> => {
  const response = await axios.post<FileAddResponse>('http://localhost:8080/files', data);
  return response.data;
};

// 获取文件列表
export const fetchFilesByArtifactId = async (artifactId: number): Promise<FileListResponse> => {
  const response = await http.get<FileListResponse>(`http://localhost:8080/files/artifact/${artifactId}`);
  return response.data;
};

export const deleteFile = async (fileId: number): Promise<DeleteFileResponse> => {
  const response = await axios.delete<DeleteFileResponse>(`http://localhost:8080/files/${fileId}`);
  return response.data;
};