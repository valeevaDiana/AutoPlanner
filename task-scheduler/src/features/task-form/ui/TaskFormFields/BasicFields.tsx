import React from 'react';
import { useTheme } from '../../../../shared/lib/contexts';

interface BasicFieldsProps {
  title: string;
  description: string;
  isViewMode: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const BasicFields: React.FC<BasicFieldsProps> = ({
  title,
  description,
  isViewMode,
  onTitleChange,
  onDescriptionChange,
}) => {
  const { currentTheme } = useTheme();

  return (
    <>
      {/* Название задачи */}
      <div>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: '500',
          color: currentTheme.colors.text
        }}>
          Задача:
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="введите название задачи"
          disabled={isViewMode}
          style={{
            width: '100%',
            padding: '12px',
            border: `1px solid ${currentTheme.colors.border}`,
            borderRadius: '6px',
            fontSize: '16px',
            fontStyle: title ? 'normal' : 'italic',
            color: title ? currentTheme.colors.text : currentTheme.colors.textSecondary,
            backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
            cursor: isViewMode ? 'not-allowed' : 'text'
          }}
        />
      </div>

      {/* Описание задачи */}
      <div>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: '500',
          color: currentTheme.colors.text
        }}>
          Описание задачи:
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Опишите подробности вашей задачи..."
          disabled={isViewMode}
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            border: `1px solid ${currentTheme.colors.border}`,
            borderRadius: '6px',
            fontSize: '16px',
            fontStyle: description ? 'normal' : 'italic',
            color: description ? currentTheme.colors.text : currentTheme.colors.textSecondary,
            backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
            cursor: isViewMode ? 'not-allowed' : 'text',
            resize: 'vertical',
            minHeight: '100px'
          }}
        />
      </div>
    </>
  );
};