import {useContext} from "react";
import http from '../http';
import {ApiResponse, ArtifactsResponse} from '../types/ArtifactsTypes.ts';
import {ArtifactContext} from "../context/ArtifactContext.tsx";

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