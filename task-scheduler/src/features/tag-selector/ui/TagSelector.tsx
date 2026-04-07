import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../shared/lib/contexts';
import { tagApi } from '../../../shared/api/tagApi';
import type { Tag } from '../../../entities/tag/model/types';

interface TagSelectorProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  onManageTags?: () => void;
  disabled?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTagIds,
  onChange,
  onManageTags,
  disabled = false,
}) => {
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadTags = () => {
    setTags(tagApi.getTags());
  };

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleTagToggle = (tagId: string) => {
    if (disabled) return;
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const getTagById = (id: string) => tags.find(t => t.id === id);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          padding: '8px',
          border: `1px solid ${currentTheme.colors.border}`,
          borderRadius: '6px',
          backgroundColor: disabled ? currentTheme.colors.background : currentTheme.colors.surface,
          cursor: disabled ? 'not-allowed' : 'pointer',
          minHeight: '42px',
        }}
      >
        {selectedTagIds.length === 0 ? (
          <span style={{ color: currentTheme.colors.textSecondary, fontSize: '14px' }}>
            Выберите теги...
          </span>
        ) : (
          selectedTagIds.map(tagId => {
            const tag = getTagById(tagId);
            return tag ? (
              <span
                key={tagId}
                style={{
                  backgroundColor: tag.color + '30',
                  color: tag.color,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {tag.name}
                {!disabled && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTagToggle(tagId);
                    }}
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginLeft: '4px',
                    }}
                  >
                    ✕
                  </span>
                )}
              </span>
            ) : null;
          })
        )}
        {!disabled && <span style={{ marginLeft: 'auto', fontSize: '12px' }}>▼</span>}
      </div>

      {isOpen && !disabled && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: currentTheme.colors.surface,
            border: `1px solid ${currentTheme.colors.border}`,
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            maxHeight: '250px',
            overflow: 'auto',
          }}
        >
          {tags.length === 0 ? (
            <div style={{ padding: '12px', textAlign: 'center', color: currentTheme.colors.textSecondary }}>
              Нет тегов. Нажмите "Управление тегами" чтобы создать.
            </div>
          ) : (
            tags.map(tag => (
              <label
                key={tag.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${currentTheme.colors.border}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedTagIds.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '3px',
                    backgroundColor: tag.color,
                  }}
                />
                <span style={{ flex: 1, color: currentTheme.colors.text }}>{tag.name}</span>
              </label>
            ))
          )}
          {onManageTags && (
            <button
              onClick={() => {
                setIsOpen(false);
                onManageTags();
              }}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: currentTheme.colors.primary,
                color: 'white',
                border: 'none',
                borderRadius: '0 0 6px 6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Управление тегами
            </button>
          )}
        </div>
      )}
    </div>
  );
};