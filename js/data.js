// Precios orientativos de mercado en España (septiembre 2026): revísalos de vez en cuando.
// Índice propio orientativo. Gráficas: RTX 4090 = 100 (1440p). Procesadores en juegos: Ryzen 7 9800X3D = 100; productividad: Ryzen 9 9950X = 100.
window.GPUS = [
  { id: 'rtx5090', name: 'RTX 5090', brand: 'NVIDIA', idx: 127, vram: 32, tdp: 575, year: 2025, buy: true, precio: 2300 },
  { id: 'rtx5080', name: 'RTX 5080', brand: 'NVIDIA', idx: 82, vram: 16, tdp: 360, year: 2025, buy: true, precio: 1100 },
  { id: 'rtx5070ti', name: 'RTX 5070 Ti', brand: 'NVIDIA', idx: 72, vram: 16, tdp: 300, year: 2025, buy: true, precio: 800 },
  { id: 'rtx5070', name: 'RTX 5070', brand: 'NVIDIA', idx: 60, vram: 12, tdp: 250, year: 2025, buy: true, precio: 560 },
  { id: 'rtx5060ti16', name: 'RTX 5060 Ti 16 GB', brand: 'NVIDIA', idx: 42, vram: 16, tdp: 180, year: 2025, buy: true, precio: 430, x8: true },
  { id: 'rtx5060ti8', name: 'RTX 5060 Ti 8 GB', brand: 'NVIDIA', idx: 41, vram: 8, tdp: 180, year: 2025, buy: true, precio: 370, x8: true },
  { id: 'rtx5060', name: 'RTX 5060', brand: 'NVIDIA', idx: 34, vram: 8, tdp: 145, year: 2025, buy: true, precio: 300, x8: true },
  { id: 'rtx5050', name: 'RTX 5050', brand: 'NVIDIA', idx: 25, vram: 8, tdp: 130, year: 2025, buy: true, precio: 250, x8: true },
  { id: 'rtx4090', name: 'RTX 4090', brand: 'NVIDIA', idx: 100, vram: 24, tdp: 450, year: 2022 },
  { id: 'rtx4080s', name: 'RTX 4080 Super', brand: 'NVIDIA', idx: 78, vram: 16, tdp: 320, year: 2024 },
  { id: 'rtx4080', name: 'RTX 4080', brand: 'NVIDIA', idx: 76, vram: 16, tdp: 320, year: 2022 },
  { id: 'rtx4070tis', name: 'RTX 4070 Ti Super', brand: 'NVIDIA', idx: 66, vram: 16, tdp: 285, year: 2024 },
  { id: 'rtx4070ti', name: 'RTX 4070 Ti', brand: 'NVIDIA', idx: 62, vram: 12, tdp: 285, year: 2023 },
  { id: 'rtx4070s', name: 'RTX 4070 Super', brand: 'NVIDIA', idx: 59, vram: 12, tdp: 220, year: 2024 },
  { id: 'rtx4070', name: 'RTX 4070', brand: 'NVIDIA', idx: 51, vram: 12, tdp: 200, year: 2023 },
  { id: 'rtx4060ti', name: 'RTX 4060 Ti 8 GB', brand: 'NVIDIA', idx: 36, vram: 8, tdp: 160, year: 2023, x8: true },
  { id: 'rtx4060', name: 'RTX 4060', brand: 'NVIDIA', idx: 29, vram: 8, tdp: 115, year: 2023, buy: true, precio: 290, x8: true },
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

  { id: 'rx9070xt', name: 'RX 9070 XT', brand: 'AMD', idx: 74, vram: 16, tdp: 304, year: 2025, buy: true, precio: 680 },
  { id: 'rx9070', name: 'RX 9070', brand: 'AMD', idx: 66, vram: 16, tdp: 220, year: 2025, buy: true, precio: 590 },
  { id: 'rx9060xt16', name: 'RX 9060 XT 16 GB', brand: 'AMD', idx: 42, vram: 16, tdp: 160, year: 2025, buy: true, precio: 370, x8: true },
  { id: 'rx9060xt8', name: 'RX 9060 XT 8 GB', brand: 'AMD', idx: 41, vram: 8, tdp: 150, year: 2025, buy: true, precio: 310, x8: true },
  { id: 'rx7900xtx', name: 'RX 7900 XTX', brand: 'AMD', idx: 78, vram: 24, tdp: 355, year: 2022, buy: true, precio: 900 },
  { id: 'rx7900xt', name: 'RX 7900 XT', brand: 'AMD', idx: 68, vram: 20, tdp: 315, year: 2022 },
  { id: 'rx7900gre', name: 'RX 7900 GRE', brand: 'AMD', idx: 58, vram: 16, tdp: 260, year: 2024 },
  { id: 'rx7800xt', name: 'RX 7800 XT', brand: 'AMD', idx: 55, vram: 16, tdp: 263, year: 2023, buy: true, precio: 480 },
  { id: 'rx7700xt', name: 'RX 7700 XT', brand: 'AMD', idx: 44, vram: 12, tdp: 245, year: 2023, buy: true, precio: 400 },
  { id: 'rx7600', name: 'RX 7600', brand: 'AMD', idx: 28, vram: 8, tdp: 165, year: 2023, buy: true, precio: 260, x8: true },
  { id: 'rx6800xt', name: 'RX 6800 XT', brand: 'AMD', idx: 53, vram: 16, tdp: 300, year: 2020 },
  { id: 'rx6800', name: 'RX 6800', brand: 'AMD', idx: 46, vram: 16, tdp: 250, year: 2020 },
  { id: 'rx6750xt', name: 'RX 6750 XT', brand: 'AMD', idx: 38, vram: 12, tdp: 250, year: 2022 },
  { id: 'rx6700xt', name: 'RX 6700 XT', brand: 'AMD', idx: 35, vram: 12, tdp: 230, year: 2021 },
  { id: 'rx6650xt', name: 'RX 6650 XT', brand: 'AMD', idx: 28, vram: 8, tdp: 180, year: 2022, x8: true },
  { id: 'rx6600', name: 'RX 6600', brand: 'AMD', idx: 23, vram: 8, tdp: 132, year: 2021, buy: true, precio: 210, x8: true },
  { id: 'rx5700xt', name: 'RX 5700 XT', brand: 'AMD', idx: 25, vram: 8, tdp: 225, year: 2019 },
  { id: 'rx580', name: 'RX 580 8 GB', brand: 'AMD', idx: 12, vram: 8, tdp: 185, year: 2017 },

  { id: 'arcb580', name: 'Arc B580', brand: 'Intel', idx: 31, vram: 12, tdp: 190, year: 2024, buy: true, precio: 280, x8: true },
  { id: 'arcb570', name: 'Arc B570', brand: 'Intel', idx: 27, vram: 10, tdp: 150, year: 2025, buy: true, precio: 230, x8: true },
  { id: 'arca770', name: 'Arc A770 16 GB', brand: 'Intel', idx: 29, vram: 16, tdp: 225, year: 2022 },
  { id: 'arca750', name: 'Arc A750', brand: 'Intel', idx: 26, vram: 8, tdp: 225, year: 2022 }
];

window.CPUS = [
  { id: 'r9800x3d', name: 'Ryzen 7 9800X3D', brand: 'AMD', game: 100, multi: 55, cores: 8, threads: 16, socket: 'AM5', year: 2024, buy: true, precio: 470, w: 120, disipador: 'aire' },
  { id: 'r9950x3d', name: 'Ryzen 9 9950X3D', brand: 'AMD', game: 99, multi: 98, cores: 16, threads: 32, socket: 'AM5', year: 2025, buy: true, precio: 700, w: 170, disipador: 'liquida' },
  { id: 'r7800x3d', name: 'Ryzen 7 7800X3D', brand: 'AMD', game: 89, multi: 43, cores: 8, threads: 16, socket: 'AM5', year: 2023, buy: true, precio: 360, w: 110, disipador: 'aire' },
  { id: 'r9900x3d', name: 'Ryzen 9 9900X3D', brand: 'AMD', game: 88, multi: 74, cores: 12, threads: 24, socket: 'AM5', year: 2025 },
  { id: 'r7950x3d', name: 'Ryzen 9 7950X3D', brand: 'AMD', game: 88, multi: 82, cores: 16, threads: 32, socket: 'AM5', year: 2023 },
  { id: 'r9950x', name: 'Ryzen 9 9950X', brand: 'AMD', game: 80, multi: 100, cores: 16, threads: 32, socket: 'AM5', year: 2024, buy: true, precio: 540, w: 200, disipador: 'liquida' },
  { id: 'r9900x', name: 'Ryzen 9 9900X', brand: 'AMD', game: 79, multi: 78, cores: 12, threads: 24, socket: 'AM5', year: 2024, buy: true, precio: 380, w: 160, disipador: 'aire' },
  { id: 'r9700x', name: 'Ryzen 7 9700X', brand: 'AMD', game: 79, multi: 49, cores: 8, threads: 16, socket: 'AM5', year: 2024, buy: true, precio: 300, w: 90, disipador: 'aire' },
  { id: 'r9600x', name: 'Ryzen 5 9600X', brand: 'AMD', game: 76, multi: 39, cores: 6, threads: 12, socket: 'AM5', year: 2024, buy: true, precio: 210, w: 90, disipador: 'aire' },
  { id: 'r7700x', name: 'Ryzen 7 7700X', brand: 'AMD', game: 76, multi: 47, cores: 8, threads: 16, socket: 'AM5', year: 2022 },
  { id: 'r7600x', name: 'Ryzen 5 7600X', brand: 'AMD', game: 73, multi: 36, cores: 6, threads: 12, socket: 'AM5', year: 2022, buy: true, precio: 190, w: 100, disipador: 'aire' },
  { id: 'r7600', name: 'Ryzen 5 7600', brand: 'AMD', game: 71, multi: 34, cores: 6, threads: 12, socket: 'AM5', year: 2023, buy: true, precio: 170, w: 90, disipador: 'incluido' },
  { id: 'r5800x3d', name: 'Ryzen 7 5800X3D', brand: 'AMD', game: 72, multi: 34, cores: 8, threads: 16, socket: 'AM4', year: 2022 },
  { id: 'r5700x3d', name: 'Ryzen 7 5700X3D', brand: 'AMD', game: 69, multi: 32, cores: 8, threads: 16, socket: 'AM4', year: 2024, buy: true, precio: 220, w: 100, disipador: 'aire' },
  { id: 'r5800x', name: 'Ryzen 7 5800X', brand: 'AMD', game: 62, multi: 36, cores: 8, threads: 16, socket: 'AM4', year: 2020 },
  { id: 'r5700x', name: 'Ryzen 7 5700X', brand: 'AMD', game: 60, multi: 33, cores: 8, threads: 16, socket: 'AM4', year: 2022, buy: true, precio: 140, w: 90, disipador: 'aire' },
  { id: 'r5600x', name: 'Ryzen 5 5600X', brand: 'AMD', game: 59, multi: 26, cores: 6, threads: 12, socket: 'AM4', year: 2020 },
  { id: 'r5600', name: 'Ryzen 5 5600', brand: 'AMD', game: 57, multi: 25, cores: 6, threads: 12, socket: 'AM4', year: 2022, buy: true, precio: 100, w: 80, disipador: 'incluido' },
  { id: 'r5500', name: 'Ryzen 5 5500', brand: 'AMD', game: 50, multi: 23, cores: 6, threads: 12, socket: 'AM4', year: 2022, buy: true, precio: 80, w: 70, disipador: 'incluido', pcie3: true },
  { id: 'r3600', name: 'Ryzen 5 3600', brand: 'AMD', game: 47, multi: 21, cores: 6, threads: 12, socket: 'AM4', year: 2019 },
  { id: 'r2600', name: 'Ryzen 5 2600', brand: 'AMD', game: 36, multi: 18, cores: 6, threads: 12, socket: 'AM4', year: 2018, pcie3: true },

  { id: 'u9285k', name: 'Core Ultra 9 285K', brand: 'Intel', game: 78, multi: 99, cores: 24, threads: 24, socket: 'LGA1851', year: 2024, buy: true, precio: 580, w: 250, disipador: 'liquida' },
  { id: 'u7265k', name: 'Core Ultra 7 265K', brand: 'Intel', game: 76, multi: 85, cores: 20, threads: 20, socket: 'LGA1851', year: 2024, buy: true, precio: 330, w: 220, disipador: 'liquida' },
  { id: 'u5245k', name: 'Core Ultra 5 245K', brand: 'Intel', game: 70, multi: 60, cores: 14, threads: 14, socket: 'LGA1851', year: 2024, buy: true, precio: 240, w: 160, disipador: 'aire' },
  { id: 'i914900k', name: 'Core i9-14900K', brand: 'Intel', game: 82, multi: 92, cores: 24, threads: 32, socket: 'LGA1700', year: 2023, buy: true, precio: 460, w: 250, disipador: 'liquida' },
  { id: 'i714700k', name: 'Core i7-14700K', brand: 'Intel', game: 80, multi: 83, cores: 20, threads: 28, socket: 'LGA1700', year: 2023, buy: true, precio: 360, w: 240, disipador: 'liquida' },
  { id: 'i514600k', name: 'Core i5-14600K', brand: 'Intel', game: 76, multi: 57, cores: 14, threads: 20, socket: 'LGA1700', year: 2023, buy: true, precio: 240, w: 180, disipador: 'aire' },
  { id: 'i514400f', name: 'Core i5-14400F', brand: 'Intel', game: 65, multi: 41, cores: 10, threads: 16, socket: 'LGA1700', year: 2024, buy: true, precio: 170, w: 140, disipador: 'incluido' },
  { id: 'i513400f', name: 'Core i5-13400F', brand: 'Intel', game: 64, multi: 39, cores: 10, threads: 16, socket: 'LGA1700', year: 2023 },
  { id: 'i512400f', name: 'Core i5-12400F', brand: 'Intel', game: 60, multi: 30, cores: 6, threads: 12, socket: 'LGA1700', year: 2022, buy: true, precio: 110, w: 110, disipador: 'incluido' },
  { id: 'i312100f', name: 'Core i3-12100F', brand: 'Intel', game: 52, multi: 20, cores: 4, threads: 8, socket: 'LGA1700', year: 2022, buy: true, precio: 80, w: 80, disipador: 'incluido' },
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
    AM4: { chipset: 'Placa base B550', ram: 'DDR4', precio: 95, q: 'placa base B550 AM4' },
    AM5: { chipset: 'Placa base B650', ram: 'DDR5', precio: 150, q: 'placa base B650 AM5' },
    LGA1700: { chipset: 'Placa base B760', ram: 'DDR5', precio: 130, q: 'placa base B760 DDR5' },
    LGA1851: { chipset: 'Placa base B860', ram: 'DDR5', precio: 170, q: 'placa base B860 LGA1851' }
  },
  ram: {
    DDR4: { 16: { precio: 75, q: 'memoria RAM DDR4 16GB 3200 2x8GB' }, 32: { precio: 140, q: 'memoria RAM DDR4 32GB 3600 2x16GB' } },
    DDR5: { 16: { precio: 130, q: 'memoria RAM DDR5 16GB 6000' }, 32: { precio: 230, q: 'memoria RAM DDR5 32GB 6000 CL30 2x16GB' } }
  },
  ssd: { nombre: 'SSD NVMe 1 TB', precio: 90, q: 'SSD NVMe 1TB PCIe 4.0' },
  fuentes: [
    { w: 550, precio: 55 }, { w: 650, precio: 70 }, { w: 750, precio: 90 },
    { w: 850, precio: 115 }, { w: 1000, precio: 160 }, { w: 1200, precio: 230 }
  ],
  cajas: {
    basica: { nombre: 'Caja ATX básica', precio: 50, q: 'caja PC ATX' },
    buena: { nombre: 'Caja ATX con buena ventilación', precio: 75, q: 'caja PC ATX airflow' }
  },
  disipadores: {
    incluido: { nombre: 'Incluido con el procesador', precio: 0, q: null },
    aire: { nombre: 'Disipador por aire de torre', precio: 35, q: 'disipador CPU torre' },
    liquida: { nombre: 'Refrigeración líquida 360 mm', precio: 90, q: 'refrigeración líquida 360mm' }
  }
};
