import "./TagList.css";

type Tag = {
  id: number;
  name: string;
};

type TagListProps = {
  tags: Tag[];
  selectedTag: string;
  onTagClick: (tagName: string) =>void;
};

function TagList({ tags, selectedTag, onTagClick }: TagListProps) {
  return (
    <>
      <h2>タグ一覧</h2>

      <div className="tag-List">
        {tags.map((tag) => (
          <button
		    key={tag.id}
			className={
			  selectedTag === tag.name
			    ? "tag-button active"
				: "tag-button"
			}
			onClick={() => onTagClick(tag.name)}
		  >
			  {tag.name}
		  </button>
		  
        ))}
      </div>
	  <h2>選択中: {selectedTag}</h2>
    </>
  );
}

export default TagList;
