import "./TagList.css";

type Tag = {
  id: number;
  name: string;
};

type TagListProps = {
  tags: Tag[];
  selectedTag: string | null;
  onTagClick: (tagName: string) =>void;
};

function TagList({ tags, selectedTag, onTagClick }: TagListProps) {
  return (
    <div>
      <h2>タグ一覧</h2>

      <div className="tag-list">
        {tags.map((tag) => {
		  const selected =selectedTag === tag.name;

		  return(
          <button
		    key={tag.id}
			className={
			`tag-button ${selected ? "selected" : ""}`
			}
			onClick={() => onTagClick(tag.name)}
		  >
			  {tag.name}
		  </button>
		  );
        })}
      </div>
    </div>
  );
}

export default TagList;
