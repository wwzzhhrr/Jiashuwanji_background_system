import {useParams} from "react-router-dom";
import { IconStar, IconDelete } from '@douyinfe/semi-icons';
import {useEffect, useState} from "react";
import {AutoComplete, Button, Dropdown, Input, Modal, Tag} from '@douyinfe/semi-ui';
import { IconSearch } from "@douyinfe/semi-icons";
import http from "../../http.ts";
import {ApiResponse, StoryDetail, StoryTag} from '../../types/ArtifactsTypes.ts';
import { Typography } from '@douyinfe/semi-ui';
import {useNavigate} from "react-router-dom";
import Tags from "../Tags";
import { DropDownMenuItem } from "@douyinfe/semi-ui/lib/es/dropdown/index";
const ArtifactController = ()=>{
  const { storyId: id } = useParams();
  const [ deleted, setDeleted ] = useState(false);
  const [hoverState, setHoverState] = useState({
    star: false,
    delete: false
  });
  const [inputValue, setInputValue] = useState('');
  const { Text, Title } = Typography;
  const [storyDetail, setStoryDetail] = useState<StoryDetail | null>(null)
  const [filteredTags, setFilteredTags] = useState<StoryTag[]|undefined>([]);
  const [allTags, setAllTags] = useState<StoryTag[]|undefined>([]);
  const [status, setStatus] = useState("");

  const statusMap = {
    0: 'published',

    1001: '未审核',

    2001: 'meaningless passage',

    3001: 'unauthorized facts',

    4001: 'typo',
    4002: 'grammer error',

    5001: 'disqualified',

    6001: 'waiting manual check'
    
  };

  const menu = [
    { node: 'item', name: 'published', onClick: () => setStatus('published') },
    { node: 'item', name: '未审核', onClick: () => setStatus('未审核') },
    { node: 'item', name: 'meaningless passage', onClick: () => setStatus('meaningless passage') },
    { node: 'item', name: 'unauthorized facts', onClick: () => setStatus('unauthorized facts') },
    { node: 'item', name: 'typo', onClick: () => setStatus('typo') },
    { node: 'item', name: 'grammer error', onClick: () => setStatus('grammer error') },
    { node: 'item', name: 'disqualified', onClick: () => setStatus('disqualified') },
    { node: 'item', name: 'waiting manual check', onClick: () => setStatus('waiting manual check') },
  ] as DropDownMenuItem[];

  useEffect(()=> {
    http.get<ApiResponse<StoryDetail>>(`http://localhost:8080/artifacts/${id}`).then((res) => {
      setStoryDetail(res.data.data);
      setStatus(statusMap[res.data.data.status as keyof typeof statusMap] || '未知状态');
    });
    http.get<ApiResponse<StoryTag[]>>(`http://localhost:8080/tags`).then((res) => {setAllTags(res.data.data)});
  }, []);
  useEffect(()=>{console.log(inputValue)}, [inputValue])

  const navigate = useNavigate();

  const handleSearch = (inputValue: string) => {
    if (!inputValue) {
      setFilteredTags(allTags);
    } else {
      setFilteredTags(allTags ? allTags.filter(tag => tag.tagName.includes(inputValue)) : []);
    }
  };

  const handleSelect = (value: string) => {
    http.post(`/artifacts/${id}/tags?tagId=${value}`)
        .then(()=>{navigate(0)})
  };

  const backButtonOnClick = () => {
    return () => {
      http.post(`/artifacts/${id}/manualcheck/${Number(Object.entries(statusMap).find(([_, v]) => v === status)![0])}`);
      navigate(`/`)
    }
  }

  return (
    <>
      <div style={{display: 'flex', alignItems: "center", gap: '10px'}}>
        <Title heading={1}>{storyDetail?.storyTeller}</Title>
        <IconStar size="extra-large"
                  style={{
                    color: storyDetail?.collected ? '#FFC300' : '#E6E8EA',
                    transform: hoverState.star ? 'scale(1.15)' : 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoverState(v => ({...v, star: true}))}
                  onMouseLeave={() => setHoverState(v => ({...v, star: false}))}
                  onClick={() => {http.patch(`/artifacts/${id}/collection`); navigate(0)
                  }}
        />
        <IconDelete
            size="extra-large"
            style={{
              color: hoverState.delete ? '#ff4d4f' : '#666',
              transform: hoverState.delete ? 'scale(1.15)' : 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHoverState(v => ({...v, delete: true}))}
            onMouseLeave={() => setHoverState(v => ({...v, delete: false}))}
            onClick={() => setDeleted(true)}
        />
      <Tags tagList={storyDetail?.tags} maxNum={3} canBeDelete={true} canOpen={true}/>
      <Dropdown
                position={'bottom'}
                menu={menu}
            >
                <Tag>审核状态:“{status}”</Tag>
      </Dropdown>
      <AutoComplete
          data={ filteredTags ? filteredTags.map(tag => ({
            value: tag.id,
            label: tag.tagName,
          })) : [{value: '', label: ''}]}
          style={{ width: 300 }}
          prefix={ <IconSearch />}
          onSearch={handleSearch}
          renderSelectedItem={()=>{return '成功添加了一个tag'}}
          motion
          showClear
          onSelect={(item) => handleSelect(item)}
          placeholder="搜索标签..."
      />
      <Button onClick={backButtonOnClick()}>返回</Button>
      </div>

      <Text>{storyDetail?.intro}...</Text>
      <Modal
          title={`请确认要删除${storyDetail?.storyTeller}的故事`}
          visible={deleted}
          onCancel={()=>{setDeleted(false)}}
          onOk={()=>{
            if(inputValue === `确认删除${storyDetail?.storyTeller}的故事`) {
              setDeleted(false)
              console.log(`删除${storyDetail?.storyTeller}的故事`)
              alert(`删除${storyDetail?.storyTeller}的故事`)
              http.delete(`/artifacts/${id}`)
              navigate('/')
            }
          }}
          okText={'确认删除'}
          okButtonProps={{ type: 'danger' }}
      >
        <div style={{display: "flex", gap:"20px", flexDirection:"column"}}>
          <div>
            <Text>如果要删除这个故事请在下方输入</Text>
            <Text strong>确认删除{storyDetail?.storyTeller}的故事</Text>
          </div>

          <Input placeholder="请输入确认信息" validateStatus='error' onChange={(value)=>{setInputValue(value)}} size={"large"}/>
        </div>

      </Modal>
    </>
  )
}
export default ArtifactController;