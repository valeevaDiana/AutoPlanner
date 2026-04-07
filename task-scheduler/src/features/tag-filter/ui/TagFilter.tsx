import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../../shared/lib/contexts';
import { tagApi } from '../../../shared/api/tagApi';
import type { Tag } from '../../../entities/tag/model/types';

interface TagFilterProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  refreshTrigger?: number;
}

export const TagFilter: React.FC<TagFilterProps> = ({ selectedTagIds, onChange, refreshTrigger = 0 }) => {
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadTags = useCallback(() => {
    const freshTags = tagApi.getTags();
    setTags(freshTags);
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      loadTags();
    }
  }, [refreshTrigger, loadTags]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'autoplanner_tags') {
        loadTags();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadTags]);

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
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
    setIsOpen(false);
  };

  const getTagById = (id: string) => tags.find(t => t.id === id);

  const activeFilterCount = selectedTagIds.length;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: activeFilterCount > 0 ? currentTheme.colors.primary + '20' : currentTheme.colors.background,
          border: `1px solid ${currentTheme.colors.border}`,
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          color: currentTheme.colors.text,
          transition: 'all 0.2s ease',
        }}
      >
        <span>Фильтр по тегам</span>
        {activeFilterCount > 0 && (
          <span
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: 'white',
              borderRadius: '10px',
              padding: '2px 6px',
              fontSize: '11px',
              fontWeight: 'bold',
            }}
          >
            {activeFilterCount}
          </span>
        )}
        <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span>
      </button>

      {/* Выпадающее меню фильтра */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '5px',
            minWidth: '220px',
            backgroundColor: currentTheme.colors.surface,
            border: `1px solid ${currentTheme.colors.border}`,
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}
        >
          {/* Заголовок */}
          <div
            style={{
              padding: '10px 12px',
              borderBottom: `1px solid ${currentTheme.colors.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>
              Показать задачи с тегами:
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearAll}
                style={{
                  fontSize: '11px',
                  background: 'none',
                  border: 'none',
                  color: currentTheme.colors.error,
                  cursor: 'pointer',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                Сбросить все
              </button>
            )}
          </div>

          {/* Список тегов */}
          <div style={{ maxHeight: '250px', overflow: 'auto' }}>
            {tags.length === 0 ? (
              <div
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: currentTheme.colors.textSecondary,
                  fontSize: '12px',
                }}
              >
                Нет созданных тегов
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
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentTheme.colors.background;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '3px',
                      backgroundColor: tag.color,
                    }}
                  />
                  <span style={{ flex: 1, color: currentTheme.colors.text, fontSize: '13px' }}>
                    {tag.name}
                  </span>
                </label>
              ))
            )}
          </div>

          {/* Информация о фильтре */}
          {activeFilterCount > 0 && (
            <div
              style={{
                padding: '8px 12px',
                borderTop: `1px solid ${currentTheme.colors.border}`,
                fontSize: '11px',
                color: currentTheme.colors.textSecondary,
                textAlign: 'center',
              }}
            >
              Показаны задачи с выбранными тегами
            </div>
          )}
        </div>
      )}
    </div>
  );
};