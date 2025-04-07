import { Input, Button } from '@douyinfe/semi-ui';
import {useContext, useEffect} from 'react';
import {ArtifactContext} from '../../context/ArtifactContext.tsx';
import {useFetchArtifacts} from "../../services/ArtifactService.ts"; // 导入类型

const SearchTable = () => {
  const context = useContext(ArtifactContext);
  const { inputValue, setInputValue } = context;
  const fetchArtifacts = useFetchArtifacts();

  const handleSearch = async () => {
    await fetchArtifacts(inputValue, 0, 10);
  };

  useEffect(() => {
    if(!inputValue){
      fetchArtifacts('', 0, 10).then();
    }
  }, [inputValue]);

  return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Input
            showClear
            value={inputValue}
            onChange={(value) => setInputValue(value)}
            placeholder="请输入搜索内容"
        />
        <Button onClick={handleSearch} style={{ marginLeft: '8px' }}>
          搜索Search
        </Button>
      </div>
  );
};

export default SearchTable;