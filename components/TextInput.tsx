import { useState, useRef, useEffect } from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSpeak: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onSpeak,
  placeholder = "Введи текст, система сама распознает язык и озвучит его...",
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      onSpeak();
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-dark-text">Текст для озвучки</h2>
        <span className="text-sm text-dark-text-secondary">
          {charCount} символов
        </span>
      </div>
      
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full h-48 p-4 bg-dark-card border border-gray-600 rounded-lg text-dark-text placeholder-gray-400 resize-none focus:outline-none focus:border-accent-yellow transition-colors disabled:opacity-50"
      />
      
      <button
        onClick={onSpeak}
        disabled={disabled || !value.trim()}
        className="w-full mt-4 py-4 bg-accent-yellow text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Озвучить
      </button>
      
      <div className="mt-2 text-xs text-dark-text-secondary">
        Нажмите Ctrl+Enter для быстрого озвучивания
      </div>
    </div>
  );
}; 