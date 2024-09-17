import React from 'react';
import { TagWithRelations, Tag } from '../../../types';
import TagTypeCircle from './TagTypeCircle';

interface TagTreeProps {
  tag?: TagWithRelations; // Make tag optional to handle null cases
  onSelected: (tag: Tag) => void; // New prop for handling selection
}

const TagTree: React.FC<TagTreeProps> = ({ tag, onSelected }) => {
  if (!tag) {
    return <p className="text-gray-500">No tag data available</p>;
  }

  return (
    <section>
      {tag.parentTag && (
        <div className="border p-2 mb-2">
          <div className="text-slate-500">Parent</div>
          {tag.parentTag ? (
            <ul id="tags">
              {[tag.parentTag].map((parentTag) => (
                <li
                  key={parentTag.id}
                  className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                  onClick={() => onSelected(parentTag)} // Pass the parent tag on selection
                >
                  <TagTypeCircle type={parentTag.type} />
                  <span className="text-lg">{parentTag.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No parent tags</p>
          )}
        </div>
      )}

      <div className="border p-2 mb-2">
        <div className="text-slate-500">Selected</div>
        {tag ? (
          <ul id="tags">
            {[tag].map((selectedTag) => (
              <li
                key={selectedTag.id}
                className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => onSelected(selectedTag)} // Pass the selected tag on selection
              >
                <TagTypeCircle type={selectedTag.type} />
                <span className="text-lg">{selectedTag.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No selected tag</p>
        )}
      </div>

      {tag.childTags && tag.childTags.length > 0 ? (
        <div className="border p-2">
          <div className="text-slate-500">
            Children ({tag.childTags.length} records)
          </div>
          <ul id="tags">
            {tag.childTags.map((childTag) => (
              <li
                key={childTag.id}
                className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => onSelected(childTag)} // Pass the child tag on selection
              >
                <TagTypeCircle type={childTag.type} />
                <span className="text-lg">{childTag.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">No child tags</p>
      )}
    </section>
  );
};

export default TagTree;
