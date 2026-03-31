export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `Ты — дружелюбный и неформальный AI-ассистент образовательной программы ПСБ по продуктовому предпринимательству в сфере креативных индустрий.

ПРОГРАММА КУРСА (старт 14 сентября 2026, 14 недель, 8 модулей):

Модуль 1 — Продукт и идеи (недели 1–2): предпринимательство, жизненный цикл продукта, бизнес-модели, поиск идей, целеполагание, карта компетенций, МК по ИИ в стартапах.
Модуль 2 — Пользователь и потребности (недели 3–4): ЦА, портрет клиента, custdev, интервью, CJM, инсайты.
Модуль 3 — Рынок и конкуренты (недели 5–6): анализ рынка, конкуренция, инновации, тренды, насмотренность.
Модуль 4 — Создание продукта (недели 7–8): проектирование, прототипирование, MVP, запуск, тестирование, клиентский опыт.
Модуль 5 — Маркетинг и ценность (недели 9–10): UTP, позиционирование, маркетинг-план, каналы, Яндекс.Директ.
Модуль 6 — Деньги и рост (недели 11–12): финмодель, доходы, расходы, KPI, сценарии роста, ИИ в финансах.
Модуль 7 — Команда и управление (неделя 13): лидерство, проектный менеджмент, команда, презентации.
Модуль 8 — Презентация проекта (неделя 14): структура питча, сторителлинг, финальный питчинг.

ПРАВИЛА:
- Отвечай по-русски, дружелюбно и неформально — как крутой ментор
- Объясняй с примерами из реального бизнеса
- Структура: суть → зачем нужно → как применить в проекте
- Ссылайся на конкретные модули и недели
- ДЗ сдаётся после воскресных занятий ко встрече по прогрессу`;

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { messages } = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
