# Secret Voicer

Клон сервиса озвучивания текста, созданный на Next.js с TypeScript и TailwindCSS.

## Возможности

- 🎤 Озвучивание текста с помощью браузерного SpeechSynthesis API
- 🤖 Интеграция с ElevenLabs API для профессиональных голосов
- 🐕 **Интеграция с Bark AI (бесплатные AI голоса)**
- 🎛️ Расширенные настройки голоса (стабильность, схожесть, стиль)
- 🔊 Настройки воспроизведения (скорость, высота, громкость)
- 🎵 Аудио эффекты (эхо, реверберация)
- 🌍 Поддержка множества языков через Bark
- 🎨 Современный темный дизайн
- 📱 Адаптивный интерфейс
- ⚡ Быстрое озвучивание по Ctrl+Enter
- 📊 Отображение статуса задачи в реальном времени

## Технологии

- **Next.js 14** - React фреймворк
- **TypeScript** - типизированный JavaScript
- **TailwindCSS** - утилитарный CSS фреймворк
- **SpeechSynthesis API** - браузерный API для синтеза речи

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Настройте API ключи (опционально):
   
   **Для Bark (рекомендуется - бесплатно):**
   - Зарегистрируйтесь на [HuggingFace](https://huggingface.co/)
   - Получите API ключ в [настройках](https://huggingface.co/settings/tokens)
   - Добавьте в `.env.local`:
   ```
   HUGGINGFACE_API_KEY=your_huggingface_key_here
   ```
   
   **Для ElevenLabs:**
   - Зарегистрируйтесь на [ElevenLabs](https://elevenlabs.io/)
   - Получите API ключ в настройках аккаунта
   - Добавьте в `.env.local`:
   ```
   ELEVENLABS_API_KEY=your_api_key_here
   ```

3. Запустите проект в режиме разработки:
```bash
npm run dev
```

4. Откройте [http://localhost:3000](http://localhost:3000) в браузере

## Структура проекта

```
├── components/          # React компоненты
│   ├── LanguageSelector.tsx
│   ├── TextInput.tsx
│   ├── StatusBlock.tsx
│   ├── VoiceSelector.tsx
│   ├── VoiceSettings.tsx
│   ├── BarkVoiceSelector.tsx
│   └── BarkSettings.tsx
├── hooks/              # Пользовательские хуки
│   └── useTTS.ts
├── pages/              # Страницы Next.js
│   ├── api/            # API роуты
│   │   ├── tts.ts
│   │   ├── voices.ts
│   │   └── bark-tts.ts
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx
├── types/              # TypeScript типы
│   ├── elevenlabs.ts
│   └── bark.ts
├── styles/             # Глобальные стили
│   └── globals.css
└── public/             # Статические файлы
```

## API

### POST /api/tts

Заготовка для будущей интеграции с ElevenLabs API.

**Запрос:**
```json
{
  "text": "Текст для озвучивания",
  "language": "ru-RU",
  "voice": "voice_id",
  "rate": 1.0,
  "pitch": 1.0
}
```

**Ответ:**
```json
{
  "success": true,
  "audioUrl": "data:audio/wav;base64,..."
}
```

## Планы развития

- [ ] Интеграция с ElevenLabs API
- [ ] Сохранение истории озвучиваний
- [ ] Настройки голоса (скорость, высота)
- [ ] Экспорт аудио файлов
- [ ] Аутентификация пользователей
- [ ] Система подписок

## Лицензия

MIT 