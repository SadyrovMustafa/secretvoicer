# 🚀 Инструкция по деплою на хостинг

## ✅ Что уже готово для продакшена:

- ❌ Демо-аккаунты удалены
- ❌ Тестовые данные убраны
- ✅ Админ-панель защищена (только для пользователей с `isAdmin: true`)
- ✅ Переменные окружения настроены

## 🔧 Настройка перед деплоем:

### 1. Создайте файл `.env.production`:
```bash
# ElevenLabs API Key
ELEVENLABS_API_KEY=ваш_реальный_ключ

# HuggingFace API Key (для Bark)
HUGGINGFACE_API_KEY=ваш_реальный_ключ

# NODE_ENV
NODE_ENV=production
```

### 2. Создайте первого админа:
После регистрации первого пользователя, отредактируйте его в localStorage:
```javascript
// В консоли браузера
const users = JSON.parse(localStorage.getItem('secretvoicer_users') || '[]');
const adminUser = users.find(u => u.email === 'ваш_email');
if (adminUser) {
  adminUser.isAdmin = true;
  localStorage.setItem('secretvoicer_users', JSON.stringify(users));
}
```

## 🌐 Варианты деплоя:

### Vercel (рекомендуется):
```bash
npm install -g vercel
vercel --prod
```

### Netlify:
```bash
npm run build
npm run export
# Загрузите папку out/
```

### VPS/Shared Hosting:
```bash
npm run build
# Загрузите папку .next/ и package.json
npm install --production
npm start
```

## 🔒 Безопасность:

- ✅ Демо-аккаунты удалены
- ✅ Админ-доступ только через `isAdmin: true`
- ✅ Переменные окружения в `.env.production`
- ✅ TypeScript компилируется в продакшен

## 📝 Примечания:

- Приложение использует localStorage для данных пользователей
- Для продакшена рекомендуется подключить базу данных
- API ключи должны быть действительными и активными
