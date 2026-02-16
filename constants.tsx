
import React from 'react';
import { QuitPhase, Language } from './types';
import { Activity, Target, Brain, Wind, CheckCircle } from 'lucide-react';

export const CURRENCIES = [
  { code: 'RUB', symbol: '₽' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'THB', symbol: '฿' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'CNY', symbol: '¥' }
];

export const TRANSLATIONS: Record<Language, any> = {
  en: {},
  es: {},
  ru: {
    appTitle: 'FreedomPath',
    welcomeTitle: 'Революционный способ бросить курить',
    welcomeSubtitle: 'Или уменьшить количество сигарет в день без тяжелой работы',
    welcomeDescription: 'FreedomPath — это не метод "силы воли", а осознанный путь к свободе через данные.',
    welcomeQuote: '"FreedomPath — это не про запреты, а про контроль над собой."',
    todayCount: 'Сигарет сегодня',
    doubles: 'Двойные (Срочно)',
    moneySaved: 'Экономия',
    weeklyTrend: 'График за неделю',
    recentSessions: 'Последние записи',
    noLogs: 'Сегодня еще нет записей. Держись!',
    logCigarette: 'Записать сигарету',
    craveButton: 'Тяга! Помощь',
    confirmLog: 'Подтвердить запись',
    triggerQuestion: 'Что вызвало тягу?',
    addTrigger: '+ Свой триггер',
    saveTrigger: 'Сохранить',
    contextPlaceholder: 'например: Стресс на работе, скука...',
    habitInsights: 'Анализ привычек',
    refresh: 'Обновить',
    smartSummary: 'ИИ Анализ',
    topTriggers: 'Частые триггеры',
    suggestedAction: 'Рекомендация',
    settings: 'Настройки',
    language: 'Язык',
    currency: 'Валюта',
    quitPhase: 'Текущая фаза',
    breathingTitle: 'Дышите глубоко',
    breathingSub: 'Медленный вдох и выдох...',
    breathingFinished: 'Отлично! Тяга скоро пройдет.',
    finish: 'Завершить',
    nextPhase: 'Прогресс до след. фазы',
    resetProgress: 'Сбросить прогресс',
    resetConfirm1: 'Вы уверены?',
    resetConfirm2: 'Вы ТОЧНО уверены? (Все данные будут удалены)',
    guideTitle: 'Как работает FreedomPath',
    guideIntro: 'FreedomPath — это не метод "силы воли", а осознанный путь к свободе через данные.',
    guideSteps: [
      { 
        title: 'Сбор данных (Baseline)', 
        text: 'Первые 3-7 дней мы просто наблюдаем. Курите как обычно, но честно записывайте каждую сигарету. Это поможет ИИ понять ваш график.' 
      },
      { 
        title: 'Поиск триггеров', 
        text: 'Осознанность — половина успеха. Мы выясним, какие ситуации (кофе, стресс, скука) заставляют вас тянуться за пачкой.' 
      },
      { 
        title: 'Активное снижение', 
        text: 'Убираем "лишние" сигареты. Начинаем с двойных сигарет (вторая подряд) и постепенно снижаем общее количество.' 
      },
      { 
        title: 'Правило Четырех', 
        text: 'Первая сигарета только через 6 часов после пробуждения. Никакого курения утром. Минимум для организма.' 
      },
      { 
        title: 'Полная Свобода', 
        text: 'Снизив дозу до минимума, вы сами решаете — отказаться полностью или оставить осознанный минимум под полным контролем.' 
      }
    ],
    phaseConditions: {
      BASELINE: 'Записывайте данные 3 дня для начала анализа.',
      TRIGGER_ID: 'Укажите триггеры для 10 сигарет.',
      REDUCTION: 'Снизьте среднее число ниже базового.',
      STABILIZE_4: 'Держитесь на 4 или меньше 3 дня.',
      FREEDOM: 'Вы контролируете ситуацию! Выбирайте свой путь.'
    },
    nav: {
      track: 'Трекер',
      insights: 'Анализ',
      coach: 'Коуч',
      guide: 'Инфо',
      settings: 'Настройки'
    }
  }
};

export const PHASE_METADATA = {
  [QuitPhase.BASELINE]: {
    title: { ru: 'Сбор данных', en: 'Baseline', es: 'Base' },
    description: { 
      ru: 'Изучаем ваши привычки. Просто записывайте сигареты как обычно.', 
      en: 'Learning habits.', 
      es: 'Aprendiendo.' 
    },
    icon: <Activity className="w-5 h-5" />,
    color: 'blue'
  },
  [QuitPhase.TRIGGER_ID]: {
    title: { ru: 'Поиск триггеров', en: 'Triggers', es: 'Disparadores' },
    description: { 
      ru: 'Сосредоточьтесь на ПРИЧИНАХ. Осознанность — это ключ.', 
      en: 'Focus on WHY.', 
      es: 'Enfócate en POR QUÉ.' 
    },
    icon: <Brain className="w-5 h-5" />,
    color: 'purple'
  },
  [QuitPhase.REDUCTION]: {
    title: { ru: 'Активное снижение', en: 'Reduction', es: 'Reducción' },
    description: { 
      ru: 'Пора снижать. Цель — на 10% меньше каждый день.', 
      en: 'Time to cut back.', 
      es: 'Hora de reducir.' 
    },
    icon: <Target className="w-5 h-5" />,
    color: 'orange'
  },
  [QuitPhase.STABILIZE_4]: {
    title: { ru: 'Правило четырех', en: 'Final Four', es: 'Cuatro Finales' },
    description: { 
      ru: 'Утро без сигарет. Первая — спустя 6 часов после пробуждения.', 
      en: 'Morning free. First one 6h after wake up.', 
      es: 'Mañana libre. Primero 6h después de despertar.' 
    },
    icon: <Wind className="w-5 h-5" />,
    color: 'teal'
  },
  [QuitPhase.FREEDOM]: {
    title: { ru: 'Полная свобода', en: 'Freedom', es: 'Libertad' },
    description: { 
      ru: 'Привычка побеждена. Вы сами решаете, оставить ли минимум или бросить совсем.', 
      en: 'Pure Freedom.', 
      es: 'Libertad Pura.' 
    },
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'green'
  }
};

export const TRIGGERS_TRANS: Record<Language, string[]> = {
  en: [],
  es: [],
  ru: ['Стресс', 'Кофе', 'После еды', 'Скука', 'Алкоголь', 'Общение', 'За рулем', 'Утро', 'Работа', 'Прогулка']
};
