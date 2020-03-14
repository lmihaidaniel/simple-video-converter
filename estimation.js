let a = [
  {
    title: 'Sapphire 21260-00-20G Carte Graphique AMD Radeon RX 480 1085 MHz 8 Go PCI Express',
    url: 'https://www.amazon.fr/gp/product/B01H01E4CQ/ref=ppx_yo_dt_b_asin_title_o05_s00?ie=UTF8&psc=1',
    price: 204.99,
  },
  {
    title: 'Thermaltake - Core P5',
    url: 'https://www.amazon.fr/gp/product/B015U7LXO4/ref=ppx_od_dt_b_asin_title_s03?ie=UTF8&psc=1',
    price: 153.33,
  },
  {
    title: 'Samsung SSD 850 EVO,  120 Go - SSD Interne SATA III 2.5inch - MZ-75E120B/EU',
    url: 'https://www.amazon.fr/gp/product/B00P738Z8O/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1',
    price: 98.00,
  },
  {
    title: 'G.Skill F4-3200C16D-16GVK Mémoire RAM D4 3200 C16 16 Go',
    url: 'https://www.amazon.fr/gp/product/B013J7FLO0/ref=ppx_yo_dt_b_asin_title_o00_s01?ie=UTF8&psc=1',
    price: 142.00,
  },
  {
    title: 'Intel Skylake Processeur Core i5-6500 3.2 GHz 6Mo Cache Socket 1151 Boîte (BX80662I56500)',
    url: 'https://www.amazon.fr/gp/product/B010T6CWI2/ref=ppx_yo_dt_b_asin_title_o00_s01?ie=UTF8&psc=1',
    price: 215,
  },
  {
    title: 'Western digital - WD Caviar Blue Disque Dur Interne 3,5inch - SATA - 1000 TB',
    url: 'https://www.amazon.fr/gp/product/B0088PUEPK/ref=ppx_od_dt_b_asin_title_s01?ie=UTF8&psc=1',
    price: 56,
  },
  {
    title: 'Western Digital Green 120GB M.2 120Go M.2 Série ATA III - Disques SSD (120 Go, M.2, Série ATA III, 545 Mo/s, 6 Gbit/s)',
    url: 'https://www.amazon.fr/gp/product/B078WYRR9S/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&psc=1',
    price: 32,
  },
  {
    title: 'Cooler Master Seidon 120V Refroidisseur Noir',
    url: 'https://www.amazon.fr/gp/product/B00N93KIES/ref=ppx_yo_dt_b_asin_title_o00_s02?ie=UTF8&psc=1',
    price: 55,
  },
  {
    title: 'Thermaltake - Smart SE - Alimentation PC (530W) Noir',
    url: 'https://www.amazon.fr/gp/product/B00BDB28HS/ref=ppx_yo_dt_b_asin_title_o00_s02?ie=UTF8&psc=1',
    price: 60,
  },
  {
    title: 'Asus Z170 Pro Gaming Carte MÃ¨re Intel Z170 ATX Socket 1151',
    url: 'https://www.amazon.fr/gp/product/B0126R3QPA/ref=ppx_yo_dt_b_asin_title_o00_s02?ie=UTF8&psc=1',
    price: 150,
  },
  {
    title: 'ASUS - Carte Réseau ASUS PCE-AC58BT AC 2100 + Bluetooth 5.0',
    url: 'https://www.amazon.fr/gp/product/B07HRBNP5C/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1',
    price: 55,
  },
];
a.reduce((a, b) => a + b.price, 0) / 2; // 610.6600000000001

const sellPrice = 700 + 6;