import { getRandomNumber } from './common';

const names = [
  'RE504836',
  'RE509672',
  'RE525523',
  'RE522878',
  'RE210857',
  'RE587793',
  'RE587794',
  'AL215054',
  'L214634',
  'SJ11792',
  'RE273801',
  'RE187966',
  'RE284091',
  'AL172780',
  'RE205726',
  'RE24619',
  '320/05764',
  '320/07382',
  '320/A7227',
  '320/B4420',
  '332/D5584A',
  '333/C6860',
  'P550520',
  'P550880',
  'P550588',
  'P569206',
  'P550428',
  'P164384',
  'P164375',
  'P550848',
  'P550778',
  'P621984',
  'P621983',
  'P551551',
  'LF16015',
  'FF5421',
  'FS19732',
  'FS1040',
  'FS1280',
  'FS1000',
  'LF3970',
  'FF5135',
  'FS1242',
  'LF9070',
  'AF4801',
  'LF14000NN',
  'FF5457',
  'AF25962',
  'FS20202',
  'HF6555',
  'FF5580',
  'WF2071',
  'HF29000',
  'FS19769',
  'AF25963',
  'AF25557',
  'HF6553',
  'LF3977',
  'AF4828',
  'FS19605',
  'WF2126',
  'HF6710',
  'FS1254',
]

export const products = [
  {
    id: 100,
    name: 'ТЕСТОВЫЙ РАЗДЕЛ',
    isGroup: true,
    idParent: null
  },
  {
    id: 2,
    name: 'Распределители и клапаны',
    isGroup: true,
    idParent: null,
  },
  {
    id: 3,
    name: 'Насосы и моторы',
    isGroup: true,
    idParent: null
  },
  {
    id: 4,
    name: 'Фильтры и элементы',
    isGroup: true,
    idParent: null
  },
  {
    id: 5,
    name: 'Комплекты уплотнений',
    isGroup: true,
    idParent: null,
  },
  {
    id: 8,
    name: 'Уплотнение гидроцилиндра H15643634634616161616',
    isGroup: false,
    idParent: 2,
    stats: [
      {
        idFirm: 1,
        linkProduct: 'https://eurotechspb.com/raspredelitel-1-p-40',
        price: null,
        count: null
      },
      {
        idFirm: 2,
        linkProduct: null,
        price: 11515.15,
        count: 9
      },
      {
        idFirm: 3,
        linkProduct: 'https://shop.pneumax.ru/raspredelitel-1-p-40',
        price: 113545.11,
        count: 1
      },
      {
        idFirm: 4,
        linkProduct: 'https://atmg.pro/raspredelitel-1-p-40',
        price: 15515.56,
        cont: 414
      }
    ]
  },
  {
    id: 9,
    name: 'Распределитель 1P40',
    isGroup: false,
    idParent: 2,
    stats: [
      {
        idFirm: 1,
        linkProduct: 'https://eurotechspb.com/raspredelitel-1-p-40',
        price: 14141,
        count: 7
      },
      {
        idFirm: 2,
        linkProduct: 'https://shop.spb-promsnab.ru/raspredelitel-1-p-40',
        price: 11515,
        count: 9
      },
      {
        idFirm: 3,
        linkProduct: 'https://shop.pneumax.ru/raspredelitel-1-p-40',
        price: 111445.11,
        count: 1
      },
      {
        idFirm: 4,
        linkProduct: 'https://atmg.pro/raspredelitel-1-p-40',
        price: 10515.56,
        cont: 414
      }
    ]
  }
]

export const productWithStats = {
  id: 8,
  name: 'Распределитель 1P40',
  isGroup: false,
  idParent: 2,
  stats: [
    {
      idFirm: 1,
      linkProduct: 'https://eurotechspb.com/raspredelitel-1-p-40',
      stats: [
        {
          date: '21.11.2024 10:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        },
        {
          date: '21.11.2024 11:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        },
        {
          date: '21.11.2024 12:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        },
        {
          date: '21.11.2024 13:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        }
      ],
    },
    {
      idFirm: 2,
      linkProduct: 'https://shop.spb-promsnab.ru/raspredelitel-1-p-40',
      stats: [
        {
          date: '21.11.2024 10:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        },
        {
          date: '21.11.2024 11:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        },
        {
          date: '21.11.2024 12:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        },
        {
          date: '21.11.2024 13:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        }
      ],
    },
    {
      idFirm: 3,
      linkProduct: 'https://shop.pneumax.ru/raspredelitel-1-p-40',
      stats: [
        {
          date: '21.11.2024 10:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        },
        {
          date: '21.11.2024 11:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        },
        {
          date: '21.11.2024 12:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        },
        {
          date: '21.11.2024 13:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        }
      ],
    },
    {
      idFirm: 4,
      linkProduct: 'https://atmg.pro/raspredelitel-1-p-40',
      stats: [
        {
          date: '21.11.2024 10:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        },
        {
          date: '21.11.2024 11:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        },
        {
          date: '21.11.2024 12:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        },
        {
          date: '21.11.2024 13:00',
          price: Math.random() * 0.5,
          count: Math.random() * 0.5
        }
      ],
    }
  ]
}

export const firms = [
  {
    id: 1,
    name: 'ЕВРОТЕК',
    site: 'eurotechspb.com',
    color: '#be1e2d',
    isMain: true,
    isSelect: true
  },
  {
    id: 2,
    name: 'ПРОМСНАБ',
    site: 'shop.spb-promsnab.ru',
    color: '#0053b0',
    isMain: false,
    isSelect: true
  },
  {
    id: 3,
    name: 'ПНЕВМАКС',
    site: 'shop.pneumax.ru',
    color: '#82468f',
    isMain: false,
    isSelect: true
  },
  {
    id: 4,
    name: 'АТМГ',
    site: 'atmg.pro',
    color: '#e09028',
    isMain: false,
    isSelect: true
  },
  {
    id: 5,
    name: 'АРКАИМ',
    site: 'arkaimspb.ru',
    color: '#4682d9',
    isMain: false,
    isSelect: false
  }
]

export const generateProductsMock = (count) => {
  const products = [];

  for (let i = 0; i < count; i++) {
    products.push({
      id: i,
      name: names[getRandomNumber(0, names.length - 1)],
      totalShow: getRandomNumber(1000, 100000),
      popularPhrase: generatePopularPhrase(10, 'Распределитель 1P40')
    });
  }

  return products;
}

const generatePopularPhrase = (count, product) => {
  const popularPhrase = [];

  for (let i = 0; i < count; i++) {
    popularPhrase.push({
      phrase: `Купить ${product}`,
      show: getRandomNumber(1000, 4000)
    })
  }

  return popularPhrase;
}

