import { useState, useEffect, useCallback } from 'react';
import { HistoryItem, HistoryFilters } from '../types/history';

const HISTORY_STORAGE_KEY = 'secretvoicer_history';
const MAX_HISTORY_ITEMS = 100;

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filters, setFilters] = useState<HistoryFilters>({ search: '' });

  // Загружаем историю из localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, []);

  // Сохраняем историю в localStorage
  const saveHistory = useCallback((newHistory: HistoryItem[]) => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }, []);

  // Добавляем новый элемент в историю
  const addToHistory = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    setHistory(prevHistory => {
      const updatedHistory = [newItem, ...prevHistory].slice(0, MAX_HISTORY_ITEMS);
      saveHistory(updatedHistory);
      return updatedHistory;
    });
  }, [saveHistory]);

  // Удаляем элемент из истории
  const removeFromHistory = useCallback((id: string) => {
    setHistory(prevHistory => {
      const updatedHistory = prevHistory.filter(item => item.id !== id);
      saveHistory(updatedHistory);
      return updatedHistory;
    });
  }, [saveHistory]);

  // Очищаем всю историю
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }, []);

  // Фильтруем историю
  const filteredHistory = history.filter(item => {
    if (filters.search && !item.text.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.language && item.language !== filters.language) {
      return false;
    }
    if (filters.voiceType) {
      if (filters.voiceType === 'bark' && !item.useBark) return false;
      if (filters.voiceType === 'elevenlabs' && !item.useElevenLabs) return false;
      if (filters.voiceType === 'browser' && (item.useBark || item.useElevenLabs)) return false;
    }
    if (filters.dateFrom && item.timestamp < filters.dateFrom.getTime()) {
      return false;
    }
    if (filters.dateTo && item.timestamp > filters.dateTo.getTime()) {
      return false;
    }
    return true;
  });

  // Экспорт истории в JSON
  const exportHistory = useCallback(() => {
    const dataStr = JSON.stringify(filteredHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `secretvoicer_history_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredHistory]);

  return {
    history: filteredHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    exportHistory,
    filters,
    setFilters,
  };
}; 