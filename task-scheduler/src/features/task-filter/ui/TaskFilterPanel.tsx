import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../../shared/lib/contexts';
import { tagApi } from '../../../shared/api/tagApi';
import type { Tag } from '../../../entities/tag/model/types';

export type PriorityFilterType = 'none' | 'exact' | 'above' | 'below' | 'range';

export interface TaskFilters {
  tagIds: string[];
  priorityFilterType: PriorityFilterType;
  priorityValue: number;
  priorityMin: number;
  priorityMax: number;
}

interface TaskFilterPanelProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  onClose?: () => void;
  isOpen?: boolean;
  triggerButton?: React.ReactNode;
}

const DEFAULT_FILTERS: TaskFilters = {
  tagIds: [],
  priorityFilterType: 'none',
  priorityValue: 5,
  priorityMin: 1,
  priorityMax: 10,
};

export const TaskFilterPanel: React.FC<TaskFilterPanelProps> = ({
  filters,
  onChange,
  onClose,
  isOpen: externalIsOpen,
  triggerButton,
}) => {
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [localFilters, setLocalFilters] = useState<TaskFilters>(filters);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const isFirstOpenRef = useRef(true);

  const actualIsOpen = externalIsOpen !== undefined ? externalIsOpen : isOpen;

  const calculateDropdownPosition = useCallback(() => {
    if (!containerRef.current || !buttonRef.current) return;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const dropdownWidth = 250;
    const dropdownHeight = 400; 
    const margin = 10;
    
    let left = buttonRect.right - dropdownWidth;
    
    if (left < margin) {
      left = margin;
    }
    
    if (left + dropdownWidth > windowWidth - margin) {
      left = windowWidth - dropdownWidth - margin;
    }
    
    let top = buttonRect.bottom + 5;
    
    if (top + dropdownHeight > windowHeight - margin) {
      top = buttonRect.top - dropdownHeight - 5;
    }
    
    setDropdownStyle({
      position: 'fixed',
      top: top,
      left: left,
      width: `${dropdownWidth}px`,
      backgroundColor: currentTheme.colors.surface,
      border: `1px solid ${currentTheme.colors.border}`,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      maxHeight: '80vh',
      overflow: 'auto',
    });
  }, [currentTheme.colors]);

  const calculatePositionWithDelay = useCallback(() => {
    setTimeout(() => {
      calculateDropdownPosition();
    }, 10);
  }, [calculateDropdownPosition]);

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (actualIsOpen) {
      calculatePositionWithDelay();
      window.addEventListener('resize', calculateDropdownPosition);
      window.addEventListener('scroll', calculateDropdownPosition, true);
      return () => {
        window.removeEventListener('resize', calculateDropdownPosition);
        window.removeEventListener('scroll', calculateDropdownPosition, true);
      };
    }
  }, [actualIsOpen, calculateDropdownPosition, calculatePositionWithDelay]);

  useEffect(() => {
    if (actualIsOpen) {
      const timeoutId = setTimeout(() => {
        calculateDropdownPosition();
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [actualIsOpen, localFilters, tags, calculateDropdownPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (onClose) onClose();
        setIsOpen(false);
      }
    };
    if (actualIsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [actualIsOpen, onClose]);

  const loadTags = () => {
    setTags(tagApi.getTags());
  };

  const handleTagToggle = (tagId: string) => {
    const newTagIds = localFilters.tagIds.includes(tagId)
      ? localFilters.tagIds.filter(id => id !== tagId)
      : [...localFilters.tagIds, tagId];
    
    const newFilters = { ...localFilters, tagIds: newTagIds };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handlePriorityTypeChange = (type: PriorityFilterType) => {
    const newFilters = { ...localFilters, priorityFilterType: type };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handlePriorityValueChange = (value: number) => {
    const newFilters = { ...localFilters, priorityValue: value };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handlePriorityRangeChange = (min: number, max: number) => {
    const newFilters = { ...localFilters, priorityMin: min, priorityMax: max };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleClearAll = () => {
    const newFilters = { ...DEFAULT_FILTERS };
    setLocalFilters(newFilters);
    onChange(newFilters);
    if (onClose) onClose();
    setIsOpen(false);
  };

  const activeFilterCount = () => {
    let count = localFilters.tagIds.length;
    if (localFilters.priorityFilterType !== 'none') count++;
    return count;
  };

  const toggleOpen = () => {
    if (onClose && actualIsOpen) {
      onClose();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={containerRef}>
      <div ref={buttonRef} onClick={toggleOpen} style={{ cursor: 'pointer' }}>
        {triggerButton ? (
          triggerButton
        ) : (
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: activeFilterCount() > 0 
                ? currentTheme.colors.primary + '20' 
                : currentTheme.colors.background,
              border: `1px solid ${currentTheme.colors.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              color: currentTheme.colors.text,
            }}
          >
            <span>Фильтры</span>
            {activeFilterCount() > 0 && (
              <span style={{
                backgroundColor: currentTheme.colors.primary,
                color: 'white',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '11px',
              }}>
                {activeFilterCount()}
              </span>
            )}
            <span>▼</span>
          </button>
        )}
      </div>

      {actualIsOpen && (
        <div style={dropdownStyle}>
          {/* Заголовок */}
          <div style={{
            padding: '12px',
            borderBottom: `1px solid ${currentTheme.colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontWeight: '600', color: currentTheme.colors.text }}>Фильтрация задач</span>
            {activeFilterCount() > 0 && (
              <button
                onClick={handleClearAll}
                style={{
                  fontSize: '12px',
                  background: 'none',
                  border: 'none',
                  color: currentTheme.colors.error,
                  cursor: 'pointer',
                }}
              >
                Сбросить всё
              </button>
            )}
          </div>

          {/* Фильтр по тегам */}
          <div style={{ padding: '12px', borderBottom: `1px solid ${currentTheme.colors.border}` }}>
            <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: currentTheme.colors.text }}>
              Теги:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '150px', overflowY: 'auto' }}>
              {tags.length === 0 ? (
                <span style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>
                  Нет созданных тегов
                </span>
              ) : (
                tags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      border: `1px solid ${tag.color}`,
                      backgroundColor: localFilters.tagIds.includes(tag.id)
                        ? tag.color
                        : 'transparent',
                      color: localFilters.tagIds.includes(tag.id)
                        ? getContrastColor(tag.color)
                        : tag.color,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {tag.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Фильтр по приоритету */}
          <div style={{ padding: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: currentTheme.colors.text }}>
              Приоритет:
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handlePriorityTypeChange('none')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  backgroundColor: localFilters.priorityFilterType === 'none'
                    ? currentTheme.colors.primary
                    : 'transparent',
                  color: localFilters.priorityFilterType === 'none'
                    ? 'white'
                    : currentTheme.colors.textSecondary,
                  border: `1px solid ${currentTheme.colors.border}`,
                  cursor: 'pointer',
                }}
              >
                Не важно
              </button>
              <button
                onClick={() => handlePriorityTypeChange('exact')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  backgroundColor: localFilters.priorityFilterType === 'exact'
                    ? currentTheme.colors.primary
                    : 'transparent',
                  color: localFilters.priorityFilterType === 'exact'
                    ? 'white'
                    : currentTheme.colors.textSecondary,
                  border: `1px solid ${currentTheme.colors.border}`,
                  cursor: 'pointer',
                }}
              >
                Равен
              </button>
              <button
                onClick={() => handlePriorityTypeChange('above')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  backgroundColor: localFilters.priorityFilterType === 'above'
                    ? currentTheme.colors.primary
                    : 'transparent',
                  color: localFilters.priorityFilterType === 'above'
                    ? 'white'
                    : currentTheme.colors.textSecondary,
                  border: `1px solid ${currentTheme.colors.border}`,
                  cursor: 'pointer',
                }}
              >
                Выше чем
              </button>
              <button
                onClick={() => handlePriorityTypeChange('below')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  backgroundColor: localFilters.priorityFilterType === 'below'
                    ? currentTheme.colors.primary
                    : 'transparent',
                  color: localFilters.priorityFilterType === 'below'
                    ? 'white'
                    : currentTheme.colors.textSecondary,
                  border: `1px solid ${currentTheme.colors.border}`,
                  cursor: 'pointer',
                }}
              >
                Ниже чем
              </button>
              <button
                onClick={() => handlePriorityTypeChange('range')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  backgroundColor: localFilters.priorityFilterType === 'range'
                    ? currentTheme.colors.primary
                    : 'transparent',
                  color: localFilters.priorityFilterType === 'range'
                    ? 'white'
                    : currentTheme.colors.textSecondary,
                  border: `1px solid ${currentTheme.colors.border}`,
                  cursor: 'pointer',
                }}
              >
                Диапазон
              </button>
            </div>

            {(localFilters.priorityFilterType === 'exact' || 
              localFilters.priorityFilterType === 'above' || 
              localFilters.priorityFilterType === 'below') && (
              <div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={localFilters.priorityValue}
                  onChange={(e) => handlePriorityValueChange(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
                <div style={{ 
                  textAlign: 'center', 
                  fontSize: '14px', 
                  marginTop: '5px',
                  color: currentTheme.colors.text 
                }}>
                  {localFilters.priorityFilterType === 'exact' && 'Приоритет = '}
                  {localFilters.priorityFilterType === 'above' && 'Приоритет > '}
                  {localFilters.priorityFilterType === 'below' && 'Приоритет < '}
                  <strong>{localFilters.priorityValue}</strong>
                </div>
              </div>
            )}

            {localFilters.priorityFilterType === 'range' && (
              <div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>От:</span>
                  <input
                    type="range"
                    min="1"
                    max={localFilters.priorityMax}
                    value={localFilters.priorityMin}
                    onChange={(e) => handlePriorityRangeChange(parseInt(e.target.value), localFilters.priorityMax)}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontWeight: 'bold', minWidth: '30px' }}>{localFilters.priorityMin}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>До:</span>
                  <input
                    type="range"
                    min={localFilters.priorityMin}
                    max="10"
                    value={localFilters.priorityMax}
                    onChange={(e) => handlePriorityRangeChange(localFilters.priorityMin, parseInt(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontWeight: 'bold', minWidth: '30px' }}>{localFilters.priorityMax}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}