# Карты

> Приложение для отображения объектов на карте с возможностью поиска и масштабирования.  

![Скрин главного экрана](https://github.com/kreoniz/mir-omsk-map/raw/main/images/main-page-screenshot.png)

## Оглавление

1. [Краткое описание](#краткое-описание)
2. [Структура проекта](#структура-проекта)
3. [Зависимости](#зависимости)
4. [Установка и запуск](#установка-и-запуск)

## Краткое описание

Используется менеджер пакетов [`pnpm`](https://pnpm.io/), корректные `.csv` файлы находятся в папке `/public/`


## Структура проекта

```
src/
│
├── assets/                  # Статичные файлы
│   ├── icons/               # Иконки
│   └── style/               # Конфиг scss
│       ├── _imports.scss    # Импорты других scss файлов
│       ├── _reset.scss      # Обнуление браузерных стилей
│       ├── _variables.scss  # Переменные (цвета, тени)
│       └── index.scss       # Глобальные стили
│
├── components/              # UI компоненты
│   ├── ...                  # Компоненты
│   ├── ui/                  # Атомарные UI компонент
│   └── index.ts             # Экспорты
│
├── hooks/                   # Кастомные хуки
│   ├── ...
│   └── index.ts
│
├── layouts/                 # Лэйауты
│   └── ...
│
├── pages/                   # Страницы приложения
│   └── ...
│
├── routes/                  # Маршрутизация
│   └── index.tsx            # Конфигурация роутера
│
├── types/                   # Типы TypeScript
│   ├── ...
│   └── index.ts             # Экспорт типов
│
├── index.css                # Глобальные стили (+ Tailwind/shadcn)
└── main.tsx                 # Точка входа
```

## Зависимости

- [React 19](https://react.dev)
- [React Router](https://reactrouter.com/start/declarative/installation)
- [TypeScript](https://www.typescriptlang.org) - суперсет JavaScript (компилятор), предоставляющий статическую типизацию. С ним работать и быстрее, и приятнее.
- [Vite](https://vitejs.dev) - Наилучший инструмент для настройки среды разработки, удобно начинать проект, намного быстрее чем webpack.
]
- [ESLint](https://eslint.org/) - Помогает ловить ошибки в коде на этапах компиляции/написания кода.
- [Prettier](https://prettier.io/) - Помогает соблюдать consistency в написании кода.
- [React Leaflet](https://react-leaflet.js.org/) - Интерактивные карты, обертка Leaflet для React.
- [dayjs](https://day.js.org/) - JavaScript библиотека для операций с датами и временем.
- [React Hot Toast](https://react-hot-toast.com/) - Кастомные оповещения-тостеры для React

## Установка и запуск

1. **Клонировать репозиторий**
   ```bash
   git clone git@github.com:Kreoniz/mir-omsk-map.git
   cd mir-omsk-map
   ```

2. **Установить зависимости**
   ```bash
   pnpm install
   ```

3. **Запустить в режиме разработки**
   ```bash
   pnpm dev
   ```

4. **Доступные npm-скрипты**
   - Запуск в режиме разработки: `pnpm dev`
   - Сборка для production и предосмотр: `pnpm build` и `pnpm preview`
   - Линтинг кода: `pnpm lint`
   - Форматирование кода: `pnpm format`
