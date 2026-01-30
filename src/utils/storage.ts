/**
 * localStorage 工具函数
 */

const STORAGE_PREFIX = 'cover-generator:';

/**
 * 获取 localStorage 值
 */
export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * 设置 localStorage 值
 */
export function setStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * 删除 localStorage 值
 */
export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

/**
 * 清空所有 cover-generator 相关的 localStorage
 */
export function clearAllStorage(): void {
  try {
    const keys = Object.keys(window.localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        window.localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
