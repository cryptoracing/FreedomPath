
import React from 'react';
import { QuitPhase, Language } from './types';
import { Activity, Target, Brain, Wind, CheckCircle } from 'lucide-react';

export const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'RUB', symbol: '₽' },
  { code: 'EUR', symbol: '€' },
  { code: 'THB', symbol: '฿' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'CNY', symbol: '¥' },
  { code: 'IDR', symbol: 'Rp' },
  { code: 'TRY', symbol: '₺' },
  { code: 'KRW', symbol: '₩' },
  { code: 'INR', symbol: '₹' },
  { code: 'BRL', symbol: 'R$' }
];

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    appTitle: 'FreedomPath',
    todayCount: "Today's Cigarettes",
    doubles: 'Doubles (Urgent)',
    moneySaved: 'Money Saved',
    weeklyTrend: 'Weekly Trend',
    recentSessions: 'Recent Sessions',
    noLogs: 'No logs yet today. Stay strong!',
    logCigarette: 'Log Cigarette',
    craveButton: 'Help! Craving',
    confirmLog: 'Confirm Log',
    triggerQuestion: 'What triggered this?',
    contextPlaceholder: 'e.g. Busy morning, felt rushed',
    habitInsights: 'Habit Insights',
    refresh: 'Refresh',
    smartSummary: 'Smart Summary',
    topTriggers: 'Top Triggers',
    suggestedAction: 'Suggested Action',
    settings: 'Settings',
    language: 'Language',
    currency: 'Currency',
    quitPhase: 'Current Phase',
    breathingTitle: 'Focus on Breath',
    breathingSub: 'Inhale and exhale slowly...',
    breathingFinished: 'Great job! The craving will pass.',
    finish: 'Finish',
    nextPhase: 'Progress to next phase',
    resetProgress: 'Reset Progress',
    resetConfirm1: 'Are you sure?',
    resetConfirm2: 'Are you REALLY sure? (All logs will be lost)',
    guideTitle: 'How FreedomPath Works',
    guideIntro: 'FreedomPath is not about "cold turkey" quitting. It is a data-driven path to freedom.',
    guideSteps: [
      { title: 'Track Baseline', text: 'First, we observe. Don\'t change habits, just log everything for 3 days.' },
      { title: 'Identify Triggers', text: 'Awareness is 50% of the battle. We find out WHY you reach for a cigarette.' },
      { title: 'Active Reduction', text: 'We start cutting the "easy" ones first, like doubles smoked in a row.' },
      { title: 'The Four Rule', text: 'We stabilize at 4 cigarettes a day: Morning, Lunch, Dinner, Night.' },
      { title: 'Freedom', text: 'When you are ready, you jump from 4 to 0. You have already won.' }
    ],
    phaseConditions: {
      BASELINE: 'Log data for 3 days to start analysis.',
      TRIGGER_ID: 'Identify triggers for at least 10 cigarettes.',
      REDUCTION: 'Reduce average count below your baseline.',
      STABILIZE_4: 'Stay at 4 or fewer for 3 days.',
      FREEDOM: 'You are smoke free! Keep it up.'
    }
  },
  ru: {
    appTitle: 'Путь к Свободе',
    todayCount: 'Сигарет сегодня',
    doubles: 'Двойные (Срочно)',
    moneySaved: 'Экономия',
    weeklyTrend: 'График за неделю',
    recentSessions: 'Последние записи',
    noLogs: 'Сегодня еще нет записей. Держись!',
    logCigarette: 'Записать',
    craveButton: 'Тяга! Помощь',
    confirmLog: 'Подтвердить',
    triggerQuestion: 'Что вызвало тягу?',
    contextPlaceholder: 'например: Стресс на работе',
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
    guideTitle: 'Как это работает?',
    guideIntro: 'FreedomPath — это не резкий отказ, а осознанный путь к свободе.',
    guideSteps: [
      { title: 'База', text: 'Первые 3 дня мы просто наблюдаем за вашими привычками без ограничений.' },
      { title: 'Триггеры', text: 'Осознанность — половина успеха. Мы выясним, ПОЧЕМУ вы курите.' },
      { title: 'Снижение', text: 'Убираем самые ненужные сигареты, например «двойные» подряд.' },
      { title: 'Правило 4', text: 'Закрепляемся на 4 сигаретах в день: Утро, Обед, Ужин, Вечер.' },
      { title: 'Свобода', text: 'Когда вы готовы, переход с 4 на 0 проходит почти незаметно.' }
    ],
    phaseConditions: {
      BASELINE: 'Записывайте данные 3 дня для начала анализа.',
      TRIGGER_ID: 'Укажите триггеры для 10 сигарет.',
      REDUCTION: 'Снизьте среднее число ниже базового.',
      STABILIZE_4: 'Держитесь на 4 или меньше 3 дня.',
      FREEDOM: 'Вы свободны от курения! Так держать.'
    }
  },
  es: {
    appTitle: 'CaminoLibre',
    todayCount: 'Cigarrillos hoy',
    doubles: 'Dobles (Urgente)',
    moneySaved: 'Ahorros',
    weeklyTrend: 'Tendencia semanal',
    recentSessions: 'Sesiones recientes',
    noLogs: 'Sin registros hoy. ¡Mantente fuerte!',
    logCigarette: 'Registrar',
    craveButton: '¡Ayuda! Ansiedad',
    confirmLog: 'Confirmar',
    triggerQuestion: '¿Qué lo provocó?',
    contextPlaceholder: 'ej. Mañana ocupada, apurado',
    habitInsights: 'Análisis',
    refresh: 'Actualizar',
    smartSummary: 'Resumen IA',
    topTriggers: 'Principales disparadores',
    suggestedAction: 'Acción sugerida',
    settings: 'Ajustes',
    language: 'Idioma',
    currency: 'Moneda',
    quitPhase: 'Fase actual',
    breathingTitle: 'Enfoca tu respiración',
    breathingSub: 'Inhala y exhala lento...',
    breathingFinished: '¡Buen trabajo! La ansiedad pasará.',
    finish: 'Finalizar',
    nextPhase: 'Progreso a la siguiente fase',
    resetProgress: 'Reiniciar Progreso',
    resetConfirm1: '¿Estás seguro?',
    resetConfirm2: '¿ESTÁS SEGURO? (Se perderán todos los datos)',
    guideTitle: 'Cómo funciona CaminoLibre',
    guideIntro: 'CaminoLibre no se trata de dejarlo de golpe, sino de un camino guiado por datos.',
    guideSteps: [
      { title: 'Base', text: 'Primero observamos. No cambies nada, solo registra todo por 3 días.' },
      { title: 'Disparadores', text: 'La conciencia es la clave. Descubrimos POR QUÉ fumas.' },
      { title: 'Reducción', text: 'Empezamos eliminando los cigarrillos "dobles" innecesarios.' },
      { title: 'La Regla de Cuatro', text: 'Nos estabilizamos en 4 al día: Mañana, Almuerzo, Cena, Noche.' },
      { title: 'Libertad', text: 'Cuando estés listo, pasar de 4 a 0 es mucho más fácil.' }
    ],
    phaseConditions: {
      BASELINE: 'Registra datos por 3 días.',
      TRIGGER_ID: 'Identifica disparadores para 10 cigarrillos.',
      REDUCTION: 'Reduce el promedio por debajo de tu base.',
      STABILIZE_4: 'Mantente en 4 o menos por 3 días.',
      FREEDOM: '¡Eres libre de humo! Continúa así.'
    }
  }
};

export const PHASE_METADATA = {
  [QuitPhase.BASELINE]: {
    title: { en: 'Baseline Tracking', ru: 'Сбор данных', es: 'Seguimiento Base' },
    description: { 
      en: 'We are learning your habits. Just log normally.', 
      ru: 'Изучаем ваши привычки. Просто записывайте как обычно.', 
      es: 'Aprendiendo tus hábitos. Registra normalmente.' 
    },
    icon: <Activity className="w-5 h-5" />,
    color: 'blue'
  },
  [QuitPhase.TRIGGER_ID]: {
    title: { en: 'Trigger Discovery', ru: 'Поиск триггеров', es: 'Descubrimiento' },
    description: { 
      en: 'Focus on WHY you smoke. Awareness is key.', 
      ru: 'Сосредоточьтесь на ПРИЧИНАХ. Осознанность — это ключ.', 
      es: 'Enfócate en POR QUÉ fumas. La conciencia es clave.' 
    },
    icon: <Brain className="w-5 h-5" />,
    color: 'purple'
  },
  [QuitPhase.REDUCTION]: {
    title: { en: 'Active Reduction', ru: 'Активное снижение', es: 'Reducción Activa' },
    description: { 
      en: 'Time to cut back. Aim for 10% less each day.', 
      ru: 'Пора снижать. Цель — на 10% меньше каждый день.', 
      es: 'Hora de reducir. Apunta a un 10% menos cada día.' 
    },
    icon: <Target className="w-5 h-5" />,
    color: 'orange'
  },
  [QuitPhase.STABILIZE_4]: {
    title: { en: 'The Final Four', ru: 'Последние четыре', es: 'Los Cuatro Finales' },
    description: { 
      en: 'One for morning, lunch, dinner, and night.', 
      ru: 'По одной на утро, обед, ужин и вечер.', 
      es: 'Uno para mañana, almuerzo, cena y noche.' 
    },
    icon: <Wind className="w-5 h-5" />,
    color: 'teal'
  },
  [QuitPhase.FREEDOM]: {
    title: { en: 'Pure Freedom', ru: 'Чистая свобода', es: 'Libertad Pura' },
    description: { 
      en: 'You are no longer a smoker. Protect this peace.', 
      ru: 'Вы больше не курильщик. Берегите этот покой.', 
      es: 'Ya no eres fumador. Protege esta paz.' 
    },
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'green'
  }
};

export const TRIGGERS_TRANS: Record<Language, string[]> = {
  en: ['Stress', 'Coffee', 'After Meal', 'Boredom', 'Alcohol', 'Socializing', 'Driving', 'Morning'],
  ru: ['Стресс', 'Кофе', 'После еды', 'Скука', 'Алкоголь', 'Общение', 'За рулем', 'Утро'],
  es: ['Estrés', 'Café', 'Después de comer', 'Aburrimiento', 'Alcohol', 'Socializar', 'Conducir', 'Mañana']
};
