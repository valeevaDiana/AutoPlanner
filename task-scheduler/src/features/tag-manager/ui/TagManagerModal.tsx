import React, { useState, useEffect } from "react";
import { useTheme } from "../../../shared/lib/contexts";
import { useEscapeKey } from "../../../shared/lib/hooks/useEscapeKey";
import { tagApi } from "../../../shared/api/tagApi";
import type { Tag } from "../../../entities/tag/model/types";

interface TagManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTagsChange?: () => void;
}

export const TagManagerModal: React.FC<TagManagerModalProps> = ({
  isOpen,
  onClose,
  onTagsChange,
}) => {
  const { currentTheme } = useTheme();
  const [tags, setTags] = useState<Tag[]>([]);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#4CAF50");

  useEscapeKey(onClose, isOpen);

  useEffect(() => {
    if (isOpen) {
      loadTags();
    }
  }, [isOpen]);

  const loadTags = () => {
    setTags(tagApi.getTags());
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      tagApi.addTag(newTagName, newTagColor);
      setNewTagName("");
      setNewTagColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
      loadTags();
      onTagsChange?.();
    }
  };

  const handleUpdateTag = () => {
    if (editingTag && editingTag.name.trim()) {
      tagApi.updateTag(editingTag.id, {
        name: editingTag.name,
        color: editingTag.color,
      });
      setEditingTag(null);
      loadTags();
      onTagsChange?.();
    }
  };

  const handleDeleteTag = (id: string) => {
    if (window.confirm("Удалить этот тег? Он отвяжется от всех задач.")) {
      tagApi.deleteTag(id);
      loadTags();
      onTagsChange?.();
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackgroundClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: currentTheme.colors.surface,
          padding: "25px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflow: "auto",
          border: `1px solid ${currentTheme.colors.border}`,
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            textAlign: "center",
            color: currentTheme.colors.text,
          }}
        >
          Управление тегами
        </h2>

        {/* Добавление нового тега */}
        <div
          style={{
            marginBottom: "25px",
            padding: "15px",
            backgroundColor: currentTheme.colors.background,
            borderRadius: "8px",
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              fontSize: "16px",
              color: currentTheme.colors.text,
            }}
          >
            Новый тег
          </h3>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Название тега"
              style={{
                flex: 2,
                padding: "10px",
                border: `1px solid ${currentTheme.colors.border}`,
                borderRadius: "6px",
                backgroundColor: currentTheme.colors.surface,
                color: currentTheme.colors.text,
              }}
            />
            <input
              type="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              style={{
                width: "50px",
                height: "40px",
                border: `1px solid ${currentTheme.colors.border}`,
                borderRadius: "6px",
                cursor: "pointer",
              }}
            />
            <button
              onClick={handleAddTag}
              style={{
                padding: "10px 20px",
                backgroundColor: currentTheme.colors.success,
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Добавить
            </button>
          </div>
        </div>

        {/* Список тегов */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {tags.map((tag) => (
            <div
              key={tag.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                backgroundColor: currentTheme.colors.background,
                borderRadius: "8px",
                border: `1px solid ${currentTheme.colors.border}`,
              }}
            >
              {editingTag?.id === tag.id ? (
                // Режим редактирования
                <>
                  <input
                    type="text"
                    value={editingTag.name}
                    onChange={(e) =>
                      setEditingTag({ ...editingTag, name: e.target.value })
                    }
                    style={{
                      flex: 2,
                      padding: "8px",
                      border: `1px solid ${currentTheme.colors.border}`,
                      borderRadius: "4px",
                      backgroundColor: currentTheme.colors.surface,
                      color: currentTheme.colors.text,
                    }}
                  />
                  <input
                    type="color"
                    value={editingTag.color}
                    onChange={(e) =>
                      setEditingTag({ ...editingTag, color: e.target.value })
                    }
                    style={{
                      width: "40px",
                      height: "35px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  />
                  <button
                    onClick={handleUpdateTag}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: currentTheme.colors.success,
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => setEditingTag(null)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: currentTheme.colors.error,
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Отмена
                  </button>
                </>
              ) : (
                // Режим просмотра
                <>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "4px",
                      backgroundColor: tag.color,
                      border: `1px solid ${currentTheme.colors.border}`,
                    }}
                  />
                  <span
                    style={{
                      flex: 2,
                      color: currentTheme.colors.text,
                      fontWeight: "500",
                    }}
                  >
                    {tag.name}
                  </span>
                  <button
                    onClick={() => setEditingTag(tag)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: currentTheme.colors.edit,
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: currentTheme.colors.error,
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Удалить
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "25px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "12px 24px",
              backgroundColor: currentTheme.colors.primary,
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
