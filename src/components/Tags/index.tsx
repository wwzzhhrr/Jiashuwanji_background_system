import { StoryTag } from "../../types/ArtifactsTypes.ts";
import { TagGroup } from "@douyinfe/semi-ui";
import {TagProps} from "@douyinfe/semi-ui/lib/es/tag";
import http from "../../http.ts";
import {useNavigate, useParams} from "react-router-dom";

const Tags = ({ tagList, maxNum, canBeDelete, canOpen }: { tagList: StoryTag[] | undefined, maxNum: number, canBeDelete: boolean, canOpen: boolean}) => {
  const { storyId: id } = useParams();
  const tagGroupStyle = {
    display: "flex",
    alignItems: "center",
    width: 350,
  };
  const navigate = useNavigate();

  const colorOptions: TagProps["color"][] = [
    "blue",
    "cyan",
    "violet",
    "red",
    "green",
    "yellow",
    "pink",
    "purple",
    "orange",
  ];

  const getRandomColor = (): TagProps["color"] => {
    return colorOptions[1];
  };

  const formatTags = (tags: StoryTag[] | undefined): TagProps[] => {
    if (!tags) return [];
    return tags.map(tag => ({
      tagKey: tag.id,
      color: getRandomColor(),
      children: tag.tagName,
      closable: canBeDelete,
    }));
  };

  const tagListClick = (tagKey: number|string) => {
    console.log(tagKey);
    http.delete(`http://localhost:8080/artifacts/${id}/tags/${tagKey}`)
        .then(()=>navigate(0))
  };

  return (
      <TagGroup
          maxTagCount={maxNum}
          style={tagGroupStyle}
          tagList={formatTags(tagList)}
          size="large"
          avatarShape="circle"
          showPopover={canOpen}
          popoverProps={{
            position: "bottomLeft"
          }}
          onTagClose={(tagChildren, e,tapKey)=>{tagListClick(tapKey); console.log(tagChildren, e,tapKey)}}
      />
  );
};

export default Tags;
