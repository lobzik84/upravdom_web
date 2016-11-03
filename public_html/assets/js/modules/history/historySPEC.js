const historySPEC = {
  history: [
    {
      type: 'watermeter',
      importance: 'actions',
      date: '01:54 - 01:57',
      message: 'Превышена влажность',
    },
    {
      type: 'temperature',
      importance: 'warning',
      date: '01:54 - 01:57',
      message: 'Превышена температура',
    },
    {
      type: 'flash',
      importance: 'critical',
      date: '01:54 - 01:57',
      message: 'Короткое замыкание',
    },
    {
      type: 'fire',
      importance: 'warning',
      date: '01:54 - 01:57',
      message: 'Пожар',
    },
    {
      type: 'crane',
      importance: 'critical',
      date: '01:54 - 01:57',
      message: 'Потоп',
    },
    {
      type: 'door',
      importance: 'critical',
      date: '01:54 - 01:57',
      message: 'Кто-то хлопал дверью (100)',
    },
    {
      type: 'peoples',
      importance: 'warning',
      date: '01:54 - 01:57',
      message: 'Зафиксировано движение (24)',
    },
    {
      type: 'ear',
      importance: 'actions',
      date: '01:54 - 01:57',
      message: 'Соседи немного шумели',
    },
    {
      type: 'control-lamp-off',
      importance: 'warning',
      date: '01:54',
      message: 'Выключена лампа',
    },
    {
      type: 'control-lamp-on',
      importance: 'warning',
      date: '01:57',
      message: 'Включена лампа',
    },
    {
      type: 'control-outlet',
      importance: 'actions',
      date: '02:00',
      message: 'Выключена розетка',
    },
    {
      type: 'control-lamp-on',
      importance: 'critical',
      date: '02:00',
      message: 'Опять включена лампа',
    },
    {
      type: 'control-lamp-off',
      importance: 'actions',
      date: '05:00',
      message: 'Лампа выключена',
    },
  ],
};

export default historySPEC;
