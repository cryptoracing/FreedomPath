
import React from 'react';
import { QuitPhase, Language } from './types';
import { Activity, Target, Brain, Wind, CheckCircle } from 'lucide-react';

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
    quitPhase: 'Current Phase',
    currency: '$',
    breathingTitle: 'Focus on Breath',
    breathingSub: 'Inhale and exhale slowly...',
    breathingFinished: 'Great job! The craving will pass.',
    finish: 'Finish',
    nextPhase: 'Progress to next phase',
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
    quitPhase: 'Текущая фаза',
    currency: '₽',
    breathingTitle: 'Дышите глубоко',
    breathingSub: 'Медленный вдох и выдох...',
    breathingFinished: 'Отлично! Тяга скоро пройдет.',
    finish: 'Завершить',
    nextPhase: 'Прогресс до след. фазы',
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
    quitPhase: 'Fase actual',
    currency: '€',
    breathingTitle: 'Enfoca tu respiración',
    breathingSub: 'Inhala y exhala lento...',
    breathingFinished: '¡Buen trabajo! La ansiedad pasará.',
    finish: 'Finalizar',
    nextPhase: 'Progreso a la siguiente fase',
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
