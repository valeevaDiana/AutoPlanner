import type { Tag } from '../../entities/tag/model/types';

const STORAGE_KEY_TAGS = 'autoplanner_tags';

const DEFAULT_TAGS: Tag[] = [];

export const tagApi = {
  // Получить все теги
  getTags: (): Tag[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TAGS);
      if (data) {
        return JSON.parse(data);
      }
      // Если тегов нет, сохраняем дефолтные
      tagApi.saveTags(DEFAULT_TAGS);
      return DEFAULT_TAGS;
    } catch (error) {
      console.error('Error reading tags from localStorage:', error);
      return DEFAULT_TAGS;
    }
  },

  // Сохранить все теги
  saveTags: (tags: Tag[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(tags));
    } catch (error) {
      console.error('Error saving tags to localStorage:', error);
    }
  },

  // Добавить новый тег
  addTag: (tagName: string, color?: string): Tag => {
    const tags = tagApi.getTags();
    const newTag: Tag = {
      id: Date.now().toString(),
      name: tagName.trim(),
      color: color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      createdAt: new Date().toISOString(),
    };
    tags.push(newTag);
    tagApi.saveTags(tags);
    return newTag;
  },

  // Обновить тег
  updateTag: (id: string, updates: Partial<Omit<Tag, 'id' | 'createdAt'>>): Tag | null => {
    const tags = tagApi.getTags();
    const index = tags.findIndex(t => t.id === id);
    if (index !== -1) {
      tags[index] = { ...tags[index], ...updates };
      tagApi.saveTags(tags);
      return tags[index];
    }
    return null;
  },

  // Удалить тег
  deleteTag: (id: string): boolean => {
    const tags = tagApi.getTags();
    const filtered = tags.filter(t => t.id !== id);
    if (filtered.length !== tags.length) {
      tagApi.saveTags(filtered);
      return true;
    }
    return false;
  },

  // Получить тег по id
  getTagById: (id: string): Tag | undefined => {
    const tags = tagApi.getTags();
    return tags.find(t => t.id === id);
  },
};