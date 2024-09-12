import React from 'react';
import { TagWithRelations, Tag} from '../../../types';
import TagTypeCircle from './TagTypeCircle';

interface TagTreeProps {
  tag: TagWithRelations;
  onSelected: (tag: Tag) => void; // New prop for handling selection
}

const TagTree: React.FC<TagTreeProps> = ({ tag, onSelected }) => {
  return (
    <section>
      {tag && tag.parentTag && (
        <div className="border p-2 mb-2">
          <div>Parent</div>
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
        </div>
      )}

      {tag && (
        <div className="border p-2 mb-2">
          <div>Selected</div>
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
        </div>
      )}

      {tag && tag.childTags.length > 0 && (
        <div className="border p-2">
          <div>Children</div>
          <ul id="tags" className="">
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
      )}
    </section>
  );
};

export default TagTree;
