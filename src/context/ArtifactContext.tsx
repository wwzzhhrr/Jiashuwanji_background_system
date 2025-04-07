import React, { createContext, useState } from 'react';
import { Artifact } from '../types/ArtifactsTypes.ts'; // 统一从类型文件导入

const defaultContextValue: ArtifactContextType = {
  artifacts: [],
  setArtifacts: () => {},
  inputValue: "",
  setInputValue: () => {},
  totalElements: 0,
  setTotalElements: () => {},
};

interface ArtifactContextType {
  artifacts: Artifact[];
  setArtifacts: React.Dispatch<React.SetStateAction<Artifact[]>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  totalElements: number;
  setTotalElements: React.Dispatch<React.SetStateAction<number>>;
}

export const ArtifactContext = createContext<ArtifactContextType>(defaultContextValue);

export const ArtifactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [totalElements, setTotalElements] = useState<number>(0);

  return (
      <ArtifactContext.Provider value={{ artifacts, setArtifacts, inputValue, setInputValue, totalElements, setTotalElements }}>
        {children}
      </ArtifactContext.Provider>
  );
};
