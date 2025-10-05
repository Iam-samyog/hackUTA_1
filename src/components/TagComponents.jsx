import React from 'react';

const TagChip = ({ tag, onClick, onRemove, clickable = true, removable = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 bg-blue-100 text-blue-800 rounded-full font-medium ${sizeClasses[size]} ${
        clickable ? 'cursor-pointer hover:bg-blue-200' : ''
      }`}
      onClick={clickable && onClick ? () => onClick(tag) : undefined}
    >
      {tag.name || tag}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove && onRemove(tag);
          }}
          className="ml-1 text-blue-600 hover:text-blue-800"
        >
          ×
        </button>
      )}
    </span>
  );
};

const TagList = ({ tags = [], onTagClick, onTagRemove, showCount = false, maxTags = null }) => {
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;
  const remainingCount = maxTags && tags.length > maxTags ? tags.length - maxTags : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag, index) => (
        <TagChip
          key={tag.id || tag.name || index}
          tag={tag}
          onClick={onTagClick}
          onRemove={onTagRemove}
          clickable={!!onTagClick}
          removable={!!onTagRemove}
        />
      ))}
      {remainingCount > 0 && (
        <span className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded-full">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};

const TagInput = ({ tags = [], onTagsChange, suggestions = [], placeholder = "Add tags..." }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const filteredSuggestions = suggestions.filter(
    suggestion => 
      suggestion.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.some(tag => (tag.name || tag) === suggestion.name)
  );

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = (tagToAdd = null) => {
    const tagName = tagToAdd || inputValue.trim();
    if (tagName && !tags.some(tag => (tag.name || tag) === tagName)) {
      onTagsChange([...tags, tagName]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove) => {
    onTagsChange(tags.filter(tag => (tag.name || tag) !== (tagToRemove.name || tagToRemove)));
  };

  return (
    <div className="relative">
      <div className="border border-gray-300 rounded-md p-2 min-h-[2.5rem] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <div className="flex flex-wrap gap-2 items-center">
          {tags.map((tag, index) => (
            <TagChip
              key={tag.id || tag.name || index}
              tag={tag}
              onRemove={removeTag}
              removable={true}
              clickable={false}
              size="sm"
            />
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] outline-none bg-transparent"
          />
        </div>
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
            <button
              key={suggestion.id || index}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 flex justify-between items-center"
              onClick={() => addTag(suggestion.name)}
            >
              <span>{suggestion.name}</span>
              {suggestion.notes_count && (
                <span className="text-xs text-gray-500">{suggestion.notes_count} notes</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { TagChip, TagList, TagInput };
export default TagList;
