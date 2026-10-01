// Precios orientativos de mercado en España, revisados el 1 de octubre de 2026 con idealo.es (media de las 3 ofertas
// nuevas más baratas de cada modelo). Revísalos cada semana.
// Índice propio orientativo. Gráficas: RTX 4090 = 100 (1440p). Procesadores en juegos: Ryzen 7 9800X3D = 100; productividad: Ryzen 9 9950X = 100.
window.GPUS = [
  { id: 'rtx5090', name: 'RTX 5090', brand: 'NVIDIA', idx: 127, vram: 32, tdp: 575, year: 2025, buy: true, precio: 5990 },
  { id: 'rtx5080', name: 'RTX 5080', brand: 'NVIDIA', idx: 82, vram: 16, tdp: 360, year: 2025, buy: true, precio: 1440 },
  { id: 'rtx5070ti', name: 'RTX 5070 Ti', brand: 'NVIDIA', idx: 72, vram: 16, tdp: 300, year: 2025, buy: true, precio: 1140 },
  { id: 'rtx5070', name: 'RTX 5070', brand: 'NVIDIA', idx: 60, vram: 12, tdp: 250, year: 2025, buy: true, precio: 790 },
  { id: 'rtx5060ti16', name: 'RTX 5060 Ti 16 GB', brand: 'NVIDIA', idx: 42, vram: 16, tdp: 180, year: 2025, buy: true, precio: 730, x8: true },
  { id: 'rtx5060ti8', name: 'RTX 5060 Ti 8 GB', brand: 'NVIDIA', idx: 41, vram: 8, tdp: 180, year: 2025, buy: true, precio: 490, x8: true },
  { id: 'rtx5060', name: 'RTX 5060', brand: 'NVIDIA', idx: 34, vram: 8, tdp: 145, year: 2025, buy: true, precio: 420, x8: true },
  { id: 'rtx5050', name: 'RTX 5050', brand: 'NVIDIA', idx: 25, vram: 8, tdp: 130, year: 2025, buy: true, precio: 360, x8: true },
  { id: 'rtx4090', name: 'RTX 4090', brand: 'NVIDIA', idx: 100, vram: 24, tdp: 450, year: 2022 },
  { id: 'rtx4080s', name: 'RTX 4080 Super', brand: 'NVIDIA', idx: 78, vram: 16, tdp: 320, year: 2024 },
  { id: 'rtx4080', name: 'RTX 4080', brand: 'NVIDIA', idx: 76, vram: 16, tdp: 320, year: 2022 },
  { id: 'rtx4070tis', name: 'RTX 4070 Ti Super', brand: 'NVIDIA', idx: 66, vram: 16, tdp: 285, year: 2024 },
  { id: 'rtx4070ti', name: 'RTX 4070 Ti', brand: 'NVIDIA', idx: 62, vram: 12, tdp: 285, year: 2023 },
  { id: 'rtx4070s', name: 'RTX 4070 Super', brand: 'NVIDIA', idx: 59, vram: 12, tdp: 220, year: 2024 },
  { id: 'rtx4070', name: 'RTX 4070', brand: 'NVIDIA', idx: 51, vram: 12, tdp: 200, year: 2023 },
  { id: 'rtx4060ti', name: 'RTX 4060 Ti 8 GB', brand: 'NVIDIA', idx: 36, vram: 8, tdp: 160, year: 2023, x8: true },
  { id: 'rtx4060', name: 'RTX 4060', brand: 'NVIDIA', idx: 29, vram: 8, tdp: 115, year: 2023, x8: true },
  { id: 'rtx3090', name: 'RTX 3090', brand: 'NVIDIA', idx: 57, vram: 24, tdp: 350, year: 2020 },
  { id: 'rtx3080', name: 'RTX 3080', brand: 'NVIDIA', idx: 52, vram: 10, tdp: 320, year: 2020 },
  { id: 'rtx3070', name: 'RTX 3070', brand: 'NVIDIA', idx: 38, vram: 8, tdp: 220, year: 2020 },
  { id: 'rtx3060ti', name: 'RTX 3060 Ti', brand: 'NVIDIA', idx: 34, vram: 8, tdp: 200, year: 2020 },
  { id: 'rtx3060', name: 'RTX 3060 12 GB', brand: 'NVIDIA', idx: 26, vram: 12, tdp: 170, year: 2021 },
  { id: 'rtx3050', name: 'RTX 3050 8 GB', brand: 'NVIDIA', idx: 18, vram: 8, tdp: 130, year: 2022, x8: true },
  { id: 'rtx2070s', name: 'RTX 2070 Super', brand: 'NVIDIA', idx: 28, vram: 8, tdp: 215, year: 2019 },
  { id: 'rtx2060', name: 'RTX 2060', brand: 'NVIDIA', idx: 20, vram: 6, tdp: 160, year: 2019 },
  { id: 'gtx1660s', name: 'GTX 1660 Super', brand: 'NVIDIA', idx: 16, vram: 6, tdp: 125, year: 2019 },
  { id: 'gtx1060', name: 'GTX 1060 6 GB', brand: 'NVIDIA', idx: 13, vram: 6, tdp: 120, year: 2016 },
  { id: 'gtx1650', name: 'GTX 1650', brand: 'NVIDIA', idx: 12, vram: 4, tdp: 75, year: 2019 },

  { id: 'rx9070xt', name: 'RX 9070 XT', brand: 'AMD', idx: 74, vram: 16, tdp: 304, year: 2025, buy: true, precio: 810 },
  { id: 'rx9070', name: 'RX 9070', brand: 'AMD', idx: 66, vram: 16, tdp: 220, year: 2025, buy: true, precio: 710 },
  { id: 'rx9060xt16', name: 'RX 9060 XT 16 GB', brand: 'AMD', idx: 42, vram: 16, tdp: 160, year: 2025, buy: true, precio: 570, x8: true },
  { id: 'rx9060xt8', name: 'RX 9060 XT 8 GB', brand: 'AMD', idx: 41, vram: 8, tdp: 150, year: 2025, buy: true, precio: 480, x8: true },
  { id: 'rx7900xtx', name: 'RX 7900 XTX', brand: 'AMD', idx: 78, vram: 24, tdp: 355, year: 2022 },
  { id: 'rx7900xt', name: 'RX 7900 XT', brand: 'AMD', idx: 68, vram: 20, tdp: 315, year: 2022 },
  { id: 'rx7900gre', name: 'RX 7900 GRE', brand: 'AMD', idx: 58, vram: 16, tdp: 260, year: 2024 },
  { id: 'rx7800xt', name: 'RX 7800 XT', brand: 'AMD', idx: 55, vram: 16, tdp: 263, year: 2023 },
  { id: 'rx7700xt', name: 'RX 7700 XT', brand: 'AMD', idx: 44, vram: 12, tdp: 245, year: 2023 },
  { id: 'rx7600', name: 'RX 7600', brand: 'AMD', idx: 28, vram: 8, tdp: 165, year: 2023, buy: true, precio: 340, x8: true },
  { id: 'rx6800xt', name: 'RX 6800 XT', brand: 'AMD', idx: 53, vram: 16, tdp: 300, year: 2020 },
  { id: 'rx6800', name: 'RX 6800', brand: 'AMD', idx: 46, vram: 16, tdp: 250, year: 2020 },
  { id: 'rx6750xt', name: 'RX 6750 XT', brand: 'AMD', idx: 38, vram: 12, tdp: 250, year: 2022 },
  { id: 'rx6700xt', name: 'RX 6700 XT', brand: 'AMD', idx: 35, vram: 12, tdp: 230, year: 2021 },
  { id: 'rx6650xt', name: 'RX 6650 XT', brand: 'AMD', idx: 28, vram: 8, tdp: 180, year: 2022, x8: true },
  { id: 'rx6600', name: 'RX 6600', brand: 'AMD', idx: 23, vram: 8, tdp: 132, year: 2021, x8: true },
  { id: 'rx5700xt', name: 'RX 5700 XT', brand: 'AMD', idx: 25, vram: 8, tdp: 225, year: 2019 },
  { id: 'rx580', name: 'RX 580 8 GB', brand: 'AMD', idx: 12, vram: 8, tdp: 185, year: 2017 },

  { id: 'arcb580', name: 'Arc B580', brand: 'Intel', idx: 31, vram: 12, tdp: 190, year: 2024, buy: true, precio: 370, x8: true },
  { id: 'arcb570', name: 'Arc B570', brand: 'Intel', idx: 27, vram: 10, tdp: 150, year: 2025, buy: true, precio: 320, x8: true },
  { id: 'arca770', name: 'Arc A770 16 GB', brand: 'Intel', idx: 29, vram: 16, tdp: 225, year: 2022 },
  { id: 'arca750', name: 'Arc A750', brand: 'Intel', idx: 26, vram: 8, tdp: 225, year: 2022 }
];

window.CPUS = [
  { id: 'r9800x3d', name: 'Ryzen 7 9800X3D', brand: 'AMD', game: 100, multi: 55, cores: 8, threads: 16, socket: 'AM5', year: 2024, buy: true, precio: 410, w: 120, disipador: 'aire' },
  { id: 'r9950x3d', name: 'Ryzen 9 9950X3D', brand: 'AMD', game: 99, multi: 98, cores: 16, threads: 32, socket: 'AM5', year: 2025, buy: true, precio: 620, w: 170, disipador: 'liquida' },
  { id: 'r7800x3d', name: 'Ryzen 7 7800X3D', brand: 'AMD', game: 89, multi: 43, cores: 8, threads: 16, socket: 'AM5', year: 2023, buy: true, precio: 320, w: 110, disipador: 'aire' },
  { id: 'r9900x3d', name: 'Ryzen 9 9900X3D', brand: 'AMD', game: 88, multi: 74, cores: 12, threads: 24, socket: 'AM5', year: 2025 },
  { id: 'r7950x3d', name: 'Ryzen 9 7950X3D', brand: 'AMD', game: 88, multi: 82, cores: 16, threads: 32, socket: 'AM5', year: 2023 },
  { id: 'r9950x', name: 'Ryzen 9 9950X', brand: 'AMD', game: 80, multi: 100, cores: 16, threads: 32, socket: 'AM5', year: 2024, buy: true, precio: 500, w: 200, disipador: 'liquida' },
  { id: 'r9900x', name: 'Ryzen 9 9900X', brand: 'AMD', game: 79, multi: 78, cores: 12, threads: 24, socket: 'AM5', year: 2024, buy: true, precio: 320, w: 160, disipador: 'aire' },
  { id: 'r9700x', name: 'Ryzen 7 9700X', brand: 'AMD', game: 79, multi: 49, cores: 8, threads: 16, socket: 'AM5', year: 2024, buy: true, precio: 280, w: 90, disipador: 'aire' },
  { id: 'r9600x', name: 'Ryzen 5 9600X', brand: 'AMD', game: 76, multi: 39, cores: 6, threads: 12, socket: 'AM5', year: 2024, buy: true, precio: 175, w: 90, disipador: 'aire' },
  { id: 'r7700x', name: 'Ryzen 7 7700X', brand: 'AMD', game: 76, multi: 47, cores: 8, threads: 16, socket: 'AM5', year: 2022 },
  { id: 'r7600x', name: 'Ryzen 5 7600X', brand: 'AMD', game: 73, multi: 36, cores: 6, threads: 12, socket: 'AM5', year: 2022, buy: true, precio: 145, w: 100, disipador: 'aire' },
  { id: 'r7600', name: 'Ryzen 5 7600', brand: 'AMD', game: 71, multi: 34, cores: 6, threads: 12, socket: 'AM5', year: 2023, buy: true, precio: 155, w: 90, disipador: 'incluido' },
  { id: 'r5800x3d', name: 'Ryzen 7 5800X3D', brand: 'AMD', game: 72, multi: 34, cores: 8, threads: 16, socket: 'AM4', year: 2022 },
  { id: 'r5700x3d', name: 'Ryzen 7 5700X3D', brand: 'AMD', game: 69, multi: 32, cores: 8, threads: 16, socket: 'AM4', year: 2024 },
  { id: 'r5800x', name: 'Ryzen 7 5800X', brand: 'AMD', game: 62, multi: 36, cores: 8, threads: 16, socket: 'AM4', year: 2020 },
  { id: 'r5700x', name: 'Ryzen 7 5700X', brand: 'AMD', game: 60, multi: 33, cores: 8, threads: 16, socket: 'AM4', year: 2022, buy: true, precio: 180, w: 90, disipador: 'aire' },
  { id: 'r5600x', name: 'Ryzen 5 5600X', brand: 'AMD', game: 59, multi: 26, cores: 6, threads: 12, socket: 'AM4', year: 2020 },
  { id: 'r5600', name: 'Ryzen 5 5600', brand: 'AMD', game: 57, multi: 25, cores: 6, threads: 12, socket: 'AM4', year: 2022, buy: true, precio: 125, w: 80, disipador: 'incluido' },
  { id: 'r5500', name: 'Ryzen 5 5500', brand: 'AMD', game: 50, multi: 23, cores: 6, threads: 12, socket: 'AM4', year: 2022, buy: true, precio: 90, w: 70, disipador: 'incluido', pcie3: true },
  { id: 'r3600', name: 'Ryzen 5 3600', brand: 'AMD', game: 47, multi: 21, cores: 6, threads: 12, socket: 'AM4', year: 2019 },
  { id: 'r2600', name: 'Ryzen 5 2600', brand: 'AMD', game: 36, multi: 18, cores: 6, threads: 12, socket: 'AM4', year: 2018, pcie3: true },

  { id: 'u9285k', name: 'Core Ultra 9 285K', brand: 'Intel', game: 78, multi: 99, cores: 24, threads: 24, socket: 'LGA1851', year: 2024, buy: true, precio: 570, w: 250, disipador: 'liquida' },
  { id: 'u7265k', name: 'Core Ultra 7 265K', brand: 'Intel', game: 76, multi: 85, cores: 20, threads: 20, socket: 'LGA1851', year: 2024, buy: true, precio: 330, w: 220, disipador: 'liquida' },
  { id: 'u5245k', name: 'Core Ultra 5 245K', brand: 'Intel', game: 70, multi: 60, cores: 14, threads: 14, socket: 'LGA1851', year: 2024, buy: true, precio: 195, w: 160, disipador: 'aire' },
  { id: 'i914900k', name: 'Core i9-14900K', brand: 'Intel', game: 82, multi: 92, cores: 24, threads: 32, socket: 'LGA1700', year: 2023, buy: true, precio: 470, w: 250, disipador: 'liquida' },
  { id: 'i714700k', name: 'Core i7-14700K', brand: 'Intel', game: 80, multi: 83, cores: 20, threads: 28, socket: 'LGA1700', year: 2023, buy: true, precio: 380, w: 240, disipador: 'liquida' },
  { id: 'i514600k', name: 'Core i5-14600K', brand: 'Intel', game: 76, multi: 57, cores: 14, threads: 20, socket: 'LGA1700', year: 2023, buy: true, precio: 250, w: 180, disipador: 'aire' },
  { id: 'i514400f', name: 'Core i5-14400F', brand: 'Intel', game: 65, multi: 41, cores: 10, threads: 16, socket: 'LGA1700', year: 2024, buy: true, precio: 160, w: 140, disipador: 'incluido' },
  { id: 'i513400f', name: 'Core i5-13400F', brand: 'Intel', game: 64, multi: 39, cores: 10, threads: 16, socket: 'LGA1700', year: 2023 },
  { id: 'i512400f', name: 'Core i5-12400F', brand: 'Intel', game: 60, multi: 30, cores: 6, threads: 12, socket: 'LGA1700', year: 2022, buy: true, precio: 130, w: 110, disipador: 'incluido' },
  { id: 'i312100f', name: 'Core i3-12100F', brand: 'Intel', game: 52, multi: 20, cores: 4, threads: 8, socket: 'LGA1700', year: 2022, buy: true, precio: 95, w: 80, disipador: 'incluido' },
  { id: 'i510400f', name: 'Core i5-10400F', brand: 'Intel', game: 45, multi: 22, cores: 6, threads: 12, socket: 'LGA1200', year: 2020, pcie3: true },
  { id: 'i79700k', name: 'Core i7-9700K', brand: 'Intel', game: 50, multi: 22, cores: 8, threads: 8, socket: 'LGA1151', year: 2018, pcie3: true },
  { id: 'i59400f', name: 'Core i5-9400F', brand: 'Intel', game: 42, multi: 14, cores: 6, threads: 6, socket: 'LGA1151', year: 2019, pcie3: true }
];

// gpu: FPS de una RTX 4090 a 1440p Ultra. cpu: FPS máximos con un 9800X3D. low: cuánto sube de Ultra a Baja. vram: GB a 1080p Ultra.
window.JUEGOS = [
  { id: 'cs2', name: 'Counter-Strike 2', year: 2023, gpu: 600, cpu: 700, low: 1.7, vram: 4, alias: ['cs', 'cs2', 'csgo', 'counter strike'] },
  { id: 'valorant', name: 'Valorant', year: 2020, gpu: 900, cpu: 800, low: 1.5, vram: 2, alias: ['valo'] },
  { id: 'lol', name: 'League of Legends', year: 2009, gpu: 900, cpu: 550, low: 1.4, vram: 2, alias: ['lol', 'league'] },
  { id: 'fortnite', name: 'Fortnite', year: 2017, gpu: 150, cpu: 300, low: 3.2, vram: 6 },
  { id: 'apex', name: 'Apex Legends', year: 2019, gpu: 300, cpu: 350, low: 1.9, vram: 6, cap: 300, alias: ['apex'] },
  { id: 'rivals', name: 'Marvel Rivals', year: 2024, gpu: 150, cpu: 200, low: 2.3, vram: 7, alias: ['marvel', 'rivals'] },
  { id: 'bo6', name: 'Call of Duty: Black Ops 6', year: 2024, gpu: 220, cpu: 280, low: 2.2, vram: 8, alias: ['cod', 'call of duty', 'black ops', 'bo6'] },
  { id: 'bf6', name: 'Battlefield 6', year: 2025, gpu: 150, cpu: 190, low: 2.2, vram: 8, alias: ['bf', 'bf6', 'battlefield'] },
  { id: 'gtav', name: 'GTA V', year: 2015, gpu: 250, cpu: 200, low: 2.4, vram: 4, cap: 187, alias: ['gta', 'gta 5', 'gta v', 'grand theft auto'] },
  { id: 'rdr2', name: 'Red Dead Redemption 2', year: 2019, gpu: 140, cpu: 190, low: 2.3, vram: 7, alias: ['rdr', 'rdr2', 'red dead'] },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', year: 2020, gpu: 160, cpu: 210, low: 2.3, vram: 8, alias: ['cyber', 'cp2077'] },
  { id: 'eldenring', name: 'Elden Ring', year: 2022, gpu: 140, cpu: 150, low: 1.8, vram: 6, cap: 60, alias: ['elden'] },
  { id: 'bg3', name: "Baldur's Gate 3", year: 2023, gpu: 170, cpu: 140, low: 2.0, vram: 8, alias: ['bg3', 'baldur', 'baldurs'] },
  { id: 'hogwarts', name: 'Hogwarts Legacy', year: 2023, gpu: 150, cpu: 150, low: 2.2, vram: 10, alias: ['harry potter'] },
  { id: 'starfield', name: 'Starfield', year: 2023, gpu: 105, cpu: 130, low: 1.9, vram: 8 },
  { id: 'alanwake2', name: 'Alan Wake 2', year: 2023, gpu: 100, cpu: 190, low: 2.0, vram: 10, alias: ['alan wake'] },
  { id: 'wukong', name: 'Black Myth: Wukong', year: 2024, gpu: 95, cpu: 180, low: 2.2, vram: 8, alias: ['black myth', 'wukong'] },
  { id: 'mhwilds', name: 'Monster Hunter Wilds', year: 2025, gpu: 90, cpu: 110, low: 2.0, vram: 10, alias: ['mh', 'mhw', 'monster hunter'] },
  { id: 'acshadows', name: "Assassin's Creed Shadows", year: 2025, gpu: 85, cpu: 150, low: 2.2, vram: 10, alias: ['ac', 'assassin', 'assassins'] },
  { id: 'helldivers2', name: 'Helldivers 2', year: 2024, gpu: 150, cpu: 130, low: 2.0, vram: 8, alias: ['helldivers'] },
  { id: 'minecraft', name: 'Minecraft', year: 2011, gpu: 500, cpu: 350, low: 1.6, vram: 3, alias: ['mc'] },
  { id: 'rust', name: 'Rust', year: 2018, gpu: 180, cpu: 140, low: 2.0, vram: 8 },
  { id: 'fc26', name: 'EA Sports FC 26', year: 2025, gpu: 300, cpu: 260, low: 1.6, vram: 5, alias: ['fifa', 'fc', 'ea fc', 'fc 26', 'fifa 26', 'ea sports fc'] },
  { id: 'diablo4', name: 'Diablo IV', year: 2023, gpu: 220, cpu: 240, low: 2.0, vram: 8, alias: ['diablo', 'd4'] },
  { id: 'palworld', name: 'Palworld', year: 2024, gpu: 150, cpu: 150, low: 2.4, vram: 7 },
  { id: 'gen-ligero', name: 'Otro juego ligero (eSports)', perfil: 'un juego ligero, tipo eSports', generic: true, gpu: 500, cpu: 450, low: 1.6, vram: 3 },
  { id: 'gen-medio', name: 'Otro juego de exigencia media', perfil: 'un juego de exigencia media', generic: true, gpu: 220, cpu: 240, low: 2.0, vram: 6 },
  { id: 'gen-exigente', name: 'Otro juego exigente (AAA reciente)', perfil: 'un juego exigente, tipo AAA reciente', generic: true, gpu: 110, cpu: 170, low: 2.1, vram: 10 }
];

// Resto de piezas para "Tu PC ideal". Precios orientativos.
window.PIEZAS = {
  plataformas: {
    AM4: { chipset: 'Placa base B550', ram: 'DDR4', precio: 70, q: { es: 'placa base B550 AM4', en: 'B550 AM4 motherboard' } },
    AM5: { chipset: 'Placa base B650', ram: 'DDR5', precio: 90, q: { es: 'placa base B650 AM5', en: 'B650 AM5 motherboard' } },
    LGA1700: { chipset: 'Placa base B760', ram: 'DDR5', precio: 70, q: { es: 'placa base B760 DDR5', en: 'B760 DDR5 motherboard' } },
    LGA1851: { chipset: 'Placa base B860', ram: 'DDR5', precio: 95, q: { es: 'placa base B860 LGA1851', en: 'B860 LGA1851 motherboard' } }
  },
  ram: {
    DDR4: { 16: { precio: 120, q: { es: 'memoria RAM DDR4 16GB 3200 2x8GB', en: 'DDR4 16GB 3200 RAM 2x8GB' } }, 32: { precio: 225, q: { es: 'memoria RAM DDR4 32GB 3600 2x16GB', en: 'DDR4 32GB 3600 RAM 2x16GB' } } },
    DDR5: { 16: { precio: 255, q: { es: 'memoria RAM DDR5 16GB 6000', en: 'DDR5 16GB 6000 RAM' } }, 32: { precio: 475, q: { es: 'memoria RAM DDR5 32GB 6000 CL30 2x16GB', en: 'DDR5 32GB 6000 CL30 RAM 2x16GB' } } }
  },
  ssd: { nombre: 'SSD NVMe 1 TB', precio: 145, q: { es: 'SSD NVMe 1TB PCIe 4.0', en: '1TB NVMe SSD PCIe 4.0' } },
  fuentes: [
    { w: 550, precio: 60 }, { w: 650, precio: 85 }, { w: 750, precio: 95 },
    { w: 850, precio: 100 }, { w: 1000, precio: 120 }, { w: 1200, precio: 190 }
  ],
  cajas: {
    basica: { nombre: 'Caja ATX básica', precio: 25, q: { es: 'caja PC ATX', en: 'ATX PC case' } },
    buena: { nombre: 'Caja ATX con buena ventilación', precio: 60, q: { es: 'caja PC ATX airflow', en: 'ATX airflow PC case' } }
  },
  disipadores: {
    incluido: { nombre: 'Incluido con el procesador', precio: 0, q: null },
    aire: { nombre: 'Disipador por aire de torre', precio: 30, q: { es: 'disipador CPU torre', en: 'CPU tower air cooler' } },
    liquida: { nombre: 'Refrigeración líquida 360 mm', precio: 65, q: { es: 'refrigeración líquida 360mm', en: '360mm AIO liquid cooler' } }
  }
};

// Resto de categorías de "Todas las piezas" (las gráficas y los procesadores salen de GPUS y CPUS).
// Las piezas que también usa "Tu PC ideal" reutilizan su precio; el resto va sin precio.
(() => {
  const P = window.PIEZAS;
  const q = (es, en) => ({ es, en });
  window.TIENDA = [
    { id: 'placas', nombre: 'Placas base', items: [
      { name: 'Placa base B550', sub: 'AM4 · DDR4 · para Ryzen 5000', precio: P.plataformas.AM4.precio, det: { Socket: 'AM4', Procesadores: 'Ryzen 3000 y 5000', Memoria: 'DDR4', 'Gráfica': 'PCIe 4.0' }, q: P.plataformas.AM4.q },
      { name: 'Placa base X570', sub: 'AM4 · DDR4 · gama alta', precio: 140, det: { Socket: 'AM4', Procesadores: 'Ryzen 3000 y 5000', Memoria: 'DDR4', 'Gráfica': 'PCIe 4.0', Extra: 'Más conexiones y mejor para overclock' }, q: q('placa base X570 AM4', 'X570 AM4 motherboard') },
      { name: 'Placa base B650', sub: 'AM5 · DDR5 · para Ryzen 7000 y 9000', precio: P.plataformas.AM5.precio, det: { Socket: 'AM5', Procesadores: 'Ryzen 7000, 8000 y 9000', Memoria: 'DDR5', 'Gráfica': 'PCIe 4.0' }, q: P.plataformas.AM5.q },
      { name: 'Placa base B850', sub: 'AM5 · DDR5 · PCIe 5.0', precio: 115, det: { Socket: 'AM5', Procesadores: 'Ryzen 7000, 8000 y 9000', Memoria: 'DDR5', Extra: 'SSD PCIe 5.0' }, q: q('placa base B850 AM5', 'B850 AM5 motherboard') },
      { name: 'Placa base X870', sub: 'AM5 · DDR5 · gama alta', precio: 180, det: { Socket: 'AM5', Procesadores: 'Ryzen 7000, 8000 y 9000', Memoria: 'DDR5', 'Gráfica': 'PCIe 5.0', Extra: 'USB4 y SSD PCIe 5.0' }, q: q('placa base X870 AM5', 'X870 AM5 motherboard') },
      { name: 'Placa base B760', sub: 'LGA1700 · DDR5 · Intel 12.ª a 14.ª gen.', precio: P.plataformas.LGA1700.precio, det: { Socket: 'LGA1700', Procesadores: 'Intel Core 12.ª, 13.ª y 14.ª gen.', Memoria: 'DDR5 (también hay versiones DDR4)', 'Gráfica': 'PCIe 4.0' }, q: P.plataformas.LGA1700.q },
      { name: 'Placa base Z790', sub: 'LGA1700 · DDR5 · para overclock', precio: 150, det: { Socket: 'LGA1700', Procesadores: 'Intel Core 12.ª, 13.ª y 14.ª gen.', Memoria: 'DDR5', 'Gráfica': 'PCIe 5.0', Extra: 'Permite overclock (procesadores K)' }, q: q('placa base Z790 DDR5', 'Z790 DDR5 motherboard') },
      { name: 'Placa base B860', sub: 'LGA1851 · DDR5 · Core Ultra', precio: P.plataformas.LGA1851.precio, det: { Socket: 'LGA1851', Procesadores: 'Intel Core Ultra 200S', Memoria: 'DDR5', 'Gráfica': 'PCIe 5.0' }, q: P.plataformas.LGA1851.q },
      { name: 'Placa base Z890', sub: 'LGA1851 · DDR5 · gama alta', precio: 180, det: { Socket: 'LGA1851', Procesadores: 'Intel Core Ultra 200S', Memoria: 'DDR5', 'Gráfica': 'PCIe 5.0', Extra: 'Permite overclock (procesadores K)' }, q: q('placa base Z890 LGA1851', 'Z890 LGA1851 motherboard') }
    ] },
    { id: 'ram', nombre: 'Memoria RAM', items: [
      { name: '16 GB DDR4 3200', sub: '2 × 8 GB · para AM4', precio: P.ram.DDR4[16].precio, det: { Tipo: 'DDR4', Capacidad: '16 GB', Velocidad: '3200 MT/s', 'Compatible con': 'Placas AM4 e Intel con DDR4' }, q: P.ram.DDR4[16].q },
      { name: '32 GB DDR4 3600', sub: '2 × 16 GB · para AM4', precio: P.ram.DDR4[32].precio, det: { Tipo: 'DDR4', Capacidad: '32 GB (2 × 16 GB)', Velocidad: '3600 MT/s', 'Compatible con': 'Placas AM4 e Intel con DDR4' }, q: P.ram.DDR4[32].q },
      { name: '16 GB DDR5 6000', sub: 'Para AM5 e Intel actuales', precio: P.ram.DDR5[16].precio, det: { Tipo: 'DDR5', Capacidad: '16 GB', Velocidad: '6000 MT/s', 'Compatible con': 'Placas AM5, LGA1700 DDR5 y LGA1851' }, q: P.ram.DDR5[16].q },
      { name: '32 GB DDR5 6000 CL30', sub: '2 × 16 GB · la más recomendada para jugar', precio: P.ram.DDR5[32].precio, det: { Tipo: 'DDR5', Capacidad: '32 GB (2 × 16 GB)', Velocidad: '6000 MT/s CL30', 'Compatible con': 'Placas AM5, LGA1700 DDR5 y LGA1851', Nota: 'La velocidad ideal para los Ryzen 7000 y 9000' }, q: P.ram.DDR5[32].q },
      { name: '64 GB DDR5 6000', sub: '2 × 32 GB · edición y streaming', precio: 870, det: { Tipo: 'DDR5', Capacidad: '64 GB (2 × 32 GB)', Velocidad: '6000 MT/s', 'Compatible con': 'Placas AM5, LGA1700 DDR5 y LGA1851', Para: 'Edición de vídeo, streaming y muchos programas a la vez' }, q: q('memoria RAM DDR5 64GB 6000 2x32GB', 'DDR5 64GB 6000 RAM 2x32GB') }
    ] },
    { id: 'ssd', nombre: 'Almacenamiento', items: [
      { name: 'SSD NVMe 500 GB', sub: 'PCIe 4.0 · para el sistema', precio: 70, det: { Formato: 'M.2 2280 NVMe', Interfaz: 'PCIe 4.0', Lectura: 'hasta ~5.000 MB/s', Caben: '2–3 juegos grandes y el sistema' }, q: q('SSD NVMe 500GB PCIe 4.0', '500GB NVMe SSD PCIe 4.0') },
      { name: 'SSD NVMe 1 TB', sub: 'PCIe 4.0 · el punto justo', precio: P.ssd.precio, det: { Formato: 'M.2 2280 NVMe', Interfaz: 'PCIe 4.0', Lectura: 'hasta ~6.000 MB/s', Caben: '~6–8 juegos grandes' }, q: P.ssd.q },
      { name: 'SSD NVMe 2 TB', sub: 'PCIe 4.0 · para muchos juegos', precio: 265, det: { Formato: 'M.2 2280 NVMe', Interfaz: 'PCIe 4.0', Lectura: 'hasta ~6.000 MB/s', Caben: '~15 juegos grandes' }, q: q('SSD NVMe 2TB PCIe 4.0', '2TB NVMe SSD PCIe 4.0') },
      { name: 'SSD NVMe 4 TB', sub: 'PCIe 4.0 · biblioteca enorme', precio: 505, det: { Formato: 'M.2 2280 NVMe', Interfaz: 'PCIe 4.0', Lectura: 'hasta ~6.000 MB/s', Caben: '~30 juegos grandes' }, q: q('SSD NVMe 4TB PCIe 4.0', '4TB NVMe SSD PCIe 4.0') },
      { name: 'Disco duro 4 TB', sub: 'HDD · copias y archivos', det: { Formato: '3,5" SATA', Velocidad: '~200 MB/s', Para: 'Copias, fotos y vídeos; para juegos mejor un SSD' }, q: q('disco duro interno 4TB 3.5', '4TB internal hard drive 3.5') }
    ] },
    { id: 'fuentes', nombre: 'Fuentes', items: P.fuentes.map(f => ({
      name: `Fuente ${f.w} W`, sub: '80 Plus Gold', precio: f.precio, w: f.w,
      q: q(`fuente alimentación ${f.w}W 80 Plus Gold`, `${f.w}W 80 Plus Gold power supply`)
    })) },
    { id: 'cajas', nombre: 'Cajas', items: [
      { name: P.cajas.basica.nombre, sub: 'Sencilla y barata', precio: P.cajas.basica.precio, det: { Formato: 'ATX (también Micro-ATX)', Ventiladores: 'Normalmente 1 incluido', Para: 'PCs de gama baja y media' }, q: P.cajas.basica.q },
      { name: P.cajas.buena.nombre, sub: 'Frontal de malla, buena temperatura', precio: P.cajas.buena.precio, det: { Formato: 'ATX (también Micro-ATX)', Frontal: 'De malla: entra más aire', Ventiladores: '2–3 incluidos según modelo', Para: 'Gráficas y procesadores potentes' }, q: P.cajas.buena.q },
      { name: 'Caja con cristal templado RGB', sub: 'Ventiladores RGB incluidos', precio: 45, det: { Formato: 'ATX (también Micro-ATX)', Laterales: 'Cristal templado', Ventiladores: 'RGB incluidos' }, q: q('caja PC ATX cristal templado ventiladores RGB', 'ATX PC case tempered glass RGB fans') },
      { name: 'Caja Micro-ATX compacta', sub: 'Para PCs pequeños', precio: 30, det: { Formato: 'Micro-ATX y Mini-ITX', Para: 'PCs pequeños; comprueba que quepa la gráfica' }, q: q('caja PC Micro ATX', 'Micro ATX PC case') }
    ] },
    { id: 'refri', nombre: 'Refrigeración', items: [
      { name: P.disipadores.aire.nombre, sub: 'Para procesadores de gama media', precio: P.disipadores.aire.precio, det: { Tipo: 'Torre con 1 ventilador', Disipa: 'hasta ~150–200 W', Para: 'Ryzen 5 y 7, Core i5' }, q: P.disipadores.aire.q },
      { name: 'Disipador de doble torre', sub: 'Para procesadores potentes', precio: 45, det: { Tipo: 'Doble torre con 2 ventiladores', Disipa: 'hasta ~250 W', Para: 'Ryzen 9, Core i7 e i9' }, q: q('disipador CPU doble torre', 'dual tower CPU air cooler') },
      { name: 'Refrigeración líquida 240 mm', sub: 'AIO · cabe en casi cualquier caja', precio: 50, det: { Tipo: 'Líquida AIO, radiador de 240 mm', Disipa: '~200–250 W', Necesita: 'Hueco para radiador de 240 mm en la caja' }, q: q('refrigeración líquida 240mm', '240mm AIO liquid cooler') },
      { name: P.disipadores.liquida.nombre, sub: 'AIO · para gama alta', precio: P.disipadores.liquida.precio, det: { Tipo: 'Líquida AIO, radiador de 360 mm', Disipa: '250 W o más', Para: 'Core i9, Core Ultra 9, Ryzen 9', Necesita: 'Hueco para radiador de 360 mm en la caja' }, q: P.disipadores.liquida.q },
      { name: 'Ventiladores de caja 120 mm', sub: 'Pack de 3 · más flujo de aire', det: { 'Tamaño': '120 mm', Cantidad: '3', Para: 'Mejorar la temperatura de la caja' }, q: q('ventiladores PC 120mm pack 3', '120mm PC case fans 3 pack') },
      { name: 'Pasta térmica', sub: 'Para cambiar la del procesador', det: { 'Cuándo': 'Al cambiar el disipador o cada 2–3 años', Cantidad: 'Una gota del tamaño de un guisante' }, q: q('pasta térmica CPU', 'CPU thermal paste') }
    ] },
    { id: 'monitores', nombre: 'Monitores', items: [
      { name: 'Monitor 24" 1080p 165 Hz', sub: 'Para eSports y presupuestos ajustados', det: { 'Resolución': '1920 × 1080', Frecuencia: '165 Hz', 'Gráfica recomendada': 'RTX 5060 / RX 9060 XT o superior' }, q: q('monitor gaming 24 pulgadas 1080p 165Hz', '24 inch 1080p 165Hz gaming monitor') },
      { name: 'Monitor 27" 1440p 180 Hz', sub: 'El más equilibrado para jugar', det: { 'Resolución': '2560 × 1440', Frecuencia: '180 Hz', 'Gráfica recomendada': 'RTX 5070 / RX 9070 o superior' }, q: q('monitor gaming 27 pulgadas 1440p 180Hz', '27 inch 1440p 180Hz gaming monitor') },
      { name: 'Monitor 27" 1440p OLED', sub: 'Colores y respuesta brutales', det: { 'Resolución': '2560 × 1440', Panel: 'OLED: negros perfectos y respuesta casi instantánea', 'Gráfica recomendada': 'RTX 5070 Ti / RX 9070 XT o superior' }, q: q('monitor gaming OLED 27 pulgadas 1440p', '27 inch 1440p OLED gaming monitor') },
      { name: 'Monitor 27" 4K 144 Hz', sub: 'Para gráficas de gama alta', det: { 'Resolución': '3840 × 2160', Frecuencia: '144 Hz', 'Gráfica recomendada': 'RTX 5080 o superior' }, q: q('monitor gaming 27 pulgadas 4K 144Hz', '27 inch 4K 144Hz gaming monitor') },
      { name: 'Monitor ultrapanorámico 34"', sub: '3440 × 1440 · inmersión total', det: { 'Resolución': '3440 × 1440', Formato: '21:9', 'Gráfica recomendada': 'RTX 5070 Ti / RX 9070 XT o superior' }, q: q('monitor gaming ultrapanorámico 34 pulgadas', '34 inch ultrawide gaming monitor') }
    ] },
    { id: 'perifericos', nombre: 'Periféricos', items: [
      { name: 'Teclado mecánico gaming', sub: 'Interruptores mecánicos y RGB', det: { Tipo: 'Mecánico', 'Iluminación': 'RGB', Consejo: 'Interruptores rojos para jugar, marrones si también escribes mucho' }, q: q('teclado mecánico gaming', 'mechanical gaming keyboard') },
      { name: 'Ratón gaming ligero', sub: 'Inalámbrico, para shooters', det: { 'Conexión': 'Inalámbrico', Peso: 'Menos de ~70 g', Para: 'Shooters (CS2, Valorant, Fortnite)' }, q: q('ratón gaming inalámbrico ligero', 'lightweight wireless gaming mouse') },
      { name: 'Auriculares gaming', sub: 'Con micrófono', det: { 'Micrófono': 'Sí', 'Conexión': 'USB, jack o inalámbricos según modelo' }, q: q('auriculares gaming con micrófono', 'gaming headset with microphone') },
      { name: 'Alfombrilla XXL', sub: 'Para teclado y ratón', det: { 'Tamaño': '~90 × 40 cm', Para: 'Teclado y ratón a la vez' }, q: q('alfombrilla ratón XXL gaming', 'XXL gaming mouse pad') },
      { name: 'Mando para PC', sub: 'Inalámbrico', det: { 'Conexión': 'Inalámbrico (Bluetooth o receptor USB)', Para: 'Juegos de coches, deportes y aventuras' }, q: q('mando inalámbrico PC', 'wireless PC controller') },
      { name: 'Micrófono para streaming', sub: 'USB', det: { 'Conexión': 'USB', Para: 'Streaming, vídeos y chats de voz' }, q: q('micrófono USB streaming', 'USB streaming microphone') },
      { name: 'Webcam 1080p', sub: 'Para streaming y llamadas', det: { 'Resolución': '1920 × 1080', Para: 'Streaming y videollamadas' }, q: q('webcam 1080p streaming', '1080p streaming webcam') }
    ] }
  ];
})();
