import heroEditorialImg from '../assets/images/hero_streetwear_editorial_1790471493756.jpg';
import lookbookOutfitImg from '../assets/images/lookbook_outfit_editorial_1790471509033.jpg';
import hoodieCharcoalImg from '../assets/images/hoodie_studio_charcoal_1790471524450.jpg';
import hoodieSandImg from '../assets/images/hoodie_studio_sand_1790471535098.jpg';
import hoodieOliveImg from '../assets/images/hoodie_studio_olive_1790471546302.jpg';
import brandCraftImg from '../assets/images/brand_craftsmanship_editorial_1790471557663.jpg';

export type CategoryId =
  | 'all'
  | 'hoodies'
  | 'camisetas'
  | 'pantalones'
  | 'chaquetas'
  | 'accesorios'
  | 'calzado';

export type SizeCode = 'S' | 'M' | 'L' | 'XL';

export interface ProductColorVariant {
  id: string;
  name: string;
  hex: string;
  imagePrimary: string;
  imageSecondary: string;
  /** Subtle CSS studio filter so each colorway looks distinct and realistic */
  imageFilter?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: Exclude<CategoryId, 'all'>;
  categoryLabel: string;
  collection: string;
  price: number;
  images: string[];
  colors: ProductColorVariant[];
  sizes: SizeCode[];
  description: string;
  specs: {
    gsm: string;
    fit: string;
    composition: string;
    origin: string;
    modelInfo: string;
  };
  stock: 'in_stock' | 'low_stock';
  stockLabel: string;
  featured: boolean;
  new: boolean;
  bestseller: boolean;
  salesRank: number;
  releaseOrder: number;
  tags: string[];
}

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  description: string;
  activeInNav: boolean;
}

export interface CollectionDrop {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  releaseDate: string;
  image: string;
  garmentCount: number;
}

export interface LookbookHotspot {
  id: string;
  label: string;
  categoryLabel: string;
  xPercent: number;
  yPercent: number;
  productId: string;
  fitNote: string;
}

export const EDITORIAL_ASSETS = {
  hero: heroEditorialImg,
  lookbook: lookbookOutfitImg,
  craftsmanship: brandCraftImg,
  hoodieCharcoal: hoodieCharcoalImg,
  hoodieSand: hoodieSandImg,
  hoodieOlive: hoodieOliveImg,
};

export const STORE_CONFIG = {
  brandName: 'KÓDICE',
  currency: 'COP',
  freeShippingThreshold: 250000,
  standardShippingCost: 14900,
  hero: {
    kicker: 'COLLECTION 01 · BOGOTÁ / MEDELLÍN',
    title: 'DEFINE YOUR EVERYDAY',
    subtitle: 'Streetwear diseñado para todos los días. Siluetas arquitectónicas en algodón pesado de 500 GSM.',
    ctaText: 'DESCUBRIR COLECCIÓN',
    secondaryCta: 'EXPLORAR LOOKBOOK',
  },
  brandIdentity: {
    kicker: 'FILOSOFÍA DE DISEÑO',
    title: 'MADE FOR THE EVERYDAY',
    body: 'Creemos que vestir bien no debería significar seguir reglas. Diseñamos prendas esenciales para construir tu propio estilo, priorizando gramajes densos, caídas estructuradas y una paleta atemporal que mejora con el uso.',
    metrics: [
      { label: 'Gramaje textil', value: '480–520 GSM' },
      { label: 'Algodón peinado', value: '100% Orgánico' },
      { label: 'Confección local', value: 'Bogotá, CO' },
    ],
  },
  newDrop: {
    tag: 'NEW DROP',
    title: 'Collection 01',
    subtitle: 'Explora el nuevo lanzamiento. Ocho siluetas de hoodies heavyweight y esenciales urbanos con acabado garment-dyed y hombros caídos.',
    ctaText: 'VER COLECCIÓN',
  },
};

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'all',
    label: 'Todos',
    description: 'Catálogo completo de esenciales urbanos y piezas de colección.',
    activeInNav: true,
  },
  {
    id: 'hoodies',
    label: 'Hoodies',
    description: 'Siluetas boxy y oversized en French Terry de 480 a 520 GSM.',
    activeInNav: true,
  },
  {
    id: 'camisetas',
    label: 'Camisetas',
    description: 'Camisetas estructuradas de cuello cerrado en jersey pesado de 280 GSM.',
    activeInNav: false,
  },
  {
    id: 'pantalones',
    label: 'Pantalones',
    description: 'Cortes wide-leg, cargos técnicos y sastrería relajada urbana.',
    activeInNav: false,
  },
  {
    id: 'chaquetas',
    label: 'Chaquetas',
    description: 'Outerwear minimalista, sobrecamisas y chaquetas técnicas.',
    activeInNav: false,
  },
  {
    id: 'calzado',
    label: 'Calzado',
    description: 'Siluetas low-top en cuero grano completo y suelas vulcanizadas.',
    activeInNav: false,
  },
  {
    id: 'accesorios',
    label: 'Accesorios',
    description: 'Bolsos cruzados, gorras desestructuradas y esenciales cotidianos.',
    activeInNav: false,
  },
];

export const COLLECTIONS: CollectionDrop[] = [
  {
    id: 'Collection 01',
    code: 'DROP 01',
    title: 'Collection 01 — Essential Form',
    subtitle: 'La base de nuestro archivo urbano. Tonos minerales, sin cordones visibles y capucha de doble capa.',
    description: 'Desarrollada durante seis meses en nuestro taller de Bogotá. Cada prenda pasa por un lavado enzimático que suaviza la fibra sin perder estructura.',
    releaseDate: 'Otoño / Invierno',
    image: heroEditorialImg,
    garmentCount: 5,
  },
  {
    id: 'Drop 02 — Monolith',
    code: 'DROP 02',
    title: 'Drop 02 — Monolith Concrete',
    subtitle: 'Inspirado en el brutalismo arquitectónico. Costuras expuestas, teñido en prenda y volúmenes amplios.',
    description: 'Edición numerada con bordados tonales de alta densidad y bolsillos laterales ocultos en costura.',
    releaseDate: 'Edición Limitada',
    image: lookbookOutfitImg,
    garmentCount: 4,
  },
  {
    id: 'Atelier Heavyweight',
    code: 'ARCHIVE',
    title: 'Atelier 520 GSM Series',
    subtitle: 'Nuestra línea de máximo gramaje. Construcción térmica pero respirable para climas de altura.',
    description: 'Tejido French Terry diagonal de 520 gramos por metro cuadrado con puños acanalados de alta recuperación.',
    releaseDate: 'Línea Permanente',
    image: brandCraftImg,
    garmentCount: 3,
  },
];

export const PRODUCTS: Product[] = [
  // ================= 8 HOODIES PRINCIPALES =================
  {
    id: 'kdc-h01',
    slug: 'hoodie-essential-500g',
    name: 'HOODIE ESSENTIAL',
    subtitle: 'Boxy Fit · 500 GSM French Terry',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    collection: 'Collection 01',
    price: 189900,
    images: [hoodieCharcoalImg, heroEditorialImg, brandCraftImg],
    colors: [
      {
        id: 'negro',
        name: 'Negro Carbón',
        hex: '#1C1C1B',
        imagePrimary: hoodieCharcoalImg,
        imageSecondary: heroEditorialImg,
        imageFilter: 'contrast(1.03) brightness(0.98)',
      },
      {
        id: 'gris',
        name: 'Gris Piedra',
        hex: '#8C8B85',
        imagePrimary: hoodieSandImg,
        imageSecondary: hoodieCharcoalImg,
        imageFilter: 'grayscale(0.85) brightness(0.93) contrast(1.05)',
      },
      {
        id: 'oliva',
        name: 'Verde Oliva',
        hex: '#555E4B',
        imagePrimary: hoodieOliveImg,
        imageSecondary: lookbookOutfitImg,
        imageFilter: ' saturate(0.95)',
      },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Nuestra silueta insignia. Confeccionado en algodón pesado de 500 GSM con caída estructurada, hombros caídos y capucha de doble panel sin cordones para una estética limpia y atemporal.',
    specs: {
      gsm: '500 GSM Heavyweight French Terry',
      fit: 'Boxy Fit — Hombro caído y largo ligeramente recortado en cintura',
      composition: '100% Algodón Peinado Pre-encogido',
      origin: 'Diseñado y confeccionado en Bogotá, Colombia',
      modelInfo: 'El modelo mide 1.83m y usa talla L',
    },
    stock: 'in_stock',
    stockLabel: 'En stock',
    featured: true,
    new: true,
    bestseller: true,
    salesRank: 1,
    releaseOrder: 1,
    tags: ['essential', '500gsm', 'boxy', 'bestseller'],
  },
  {
    id: 'kdc-h02',
    slug: 'hoodie-monolith-washed',
    name: 'HOODIE MONOLITH WASHED',
    subtitle: 'Garment Dyed · 520 GSM',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    collection: 'Drop 02 — Monolith',
    price: 219900,
    images: [hoodieOliveImg, lookbookOutfitImg, hoodieCharcoalImg],
    colors: [
      {
        id: 'oliva',
        name: 'Verde Oliva',
        hex: '#555E4B',
        imagePrimary: hoodieOliveImg,
        imageSecondary: lookbookOutfitImg,
      },
      {
        id: 'arena',
        name: 'Arena / Bone',
        hex: '#DFD9CE',
        imagePrimary: hoodieSandImg,
        imageSecondary: brandCraftImg,
      },
      {
        id: 'negro',
        name: 'Negro Carbón',
        hex: '#1C1C1B',
        imagePrimary: hoodieCharcoalImg,
        imageSecondary: heroEditorialImg,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Teñido en prenda mediante procesos minerales para lograr un matiz lavado único en cada unidad. Costuras inversas en hombros y bolsillo canguro de perfil arquitectónico.',
    specs: {
      gsm: '520 GSM Lavado Enzimático',
      fit: 'Oversized Fit — Volumen amplio en pecho y mangas',
      composition: '100% Algodón Orgánico de Fibra Larga',
      origin: 'Bogotá, Colombia',
      modelInfo: 'El modelo mide 1.81m y usa talla L',
    },
    stock: 'in_stock',
    stockLabel: 'En stock',
    featured: true,
    new: true,
    bestseller: true,
    salesRank: 2,
    releaseOrder: 2,
    tags: ['garment-dyed', 'oversized', 'new-drop'],
  },
  {
    id: 'kdc-h03',
    slug: 'hoodie-alabaster-studio',
    name: 'HOODIE STUDIO BONE',
    subtitle: 'Minimal Seam · 480 GSM',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    collection: 'Collection 01',
    price: 199900,
    images: [hoodieSandImg, brandCraftImg, hoodieOliveImg],
    colors: [
      {
        id: 'arena',
        name: 'Arena / Bone',
        hex: '#DFD9CE',
        imagePrimary: hoodieSandImg,
        imageSecondary: brandCraftImg,
      },
      {
        id: 'taupe',
        name: 'Taupe Cálido',
        hex: '#9E9384',
        imagePrimary: hoodieSandImg,
        imageSecondary: hoodieOliveImg,
        imageFilter: 'sepia(0.18) brightness(0.92) contrast(1.04)',
      },
      {
        id: 'negro',
        name: 'Negro Carbón',
        hex: '#1C1C1B',
        imagePrimary: hoodieCharcoalImg,
        imageSecondary: heroEditorialImg,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Tono hueso crudo sin blanqueadores ópticos. Diseñado con bolsillos laterales invisibles integrados en las costuras estructurales para mantener el frente completamente limpio.',
    specs: {
      gsm: '480 GSM Unbleached Terry',
      fit: 'Relaxed Boxy — Caída limpia sin bolsillo frontal',
      composition: '100% Algodón Crudo',
      origin: 'Medellín & Bogotá, Colombia',
      modelInfo: 'La modelo mide 1.74m y usa talla M',
    },
    stock: 'in_stock',
    stockLabel: 'En stock',
    featured: true,
    new: false,
    bestseller: true,
    salesRank: 3,
    releaseOrder: 4,
    tags: ['minimal', 'bone', 'side-pockets'],
  },
  {
    id: 'kdc-h04',
    slug: 'hoodie-atelier-zip-heavy',
    name: 'HOODIE ATELIER FULL-ZIP',
    subtitle: 'Cremallera Metálica YKK · 520 GSM',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    collection: 'Atelier Heavyweight',
    price: 239900,
    images: [hoodieCharcoalImg, brandCraftImg, heroEditorialImg],
    colors: [
      {
        id: 'negro',
        name: 'Negro Carbón',
        hex: '#1C1C1B',
        imagePrimary: hoodieCharcoalImg,
        imageSecondary: brandCraftImg,
        imageFilter: 'contrast(1.08) brightness(0.95)',
      },
      {
        id: 'gris',
        name: 'Gris Piedra',
        hex: '#8C8B85',
        imagePrimary: hoodieSandImg,
        imageSecondary: hoodieCharcoalImg,
        imageFilter: 'grayscale(0.9) brightness(0.9)',
      },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Versatilidad de sobrecamisa y confort de hoodie pesado. Incorpora cremallera metálica de doble vía en acabado níquel cepillado para modular la silueta al caminar o sentarse.',
    specs: {
      gsm: '520 GSM Diagonal Fleece',
      fit: 'Boxy Cropped — Ideal para layering sobre camisetas largas',
      composition: '100% Algodón + Herrajes YKK Excella',
      origin: 'Bogotá, Colombia',
      modelInfo: 'El modelo mide 1.85m y usa talla L',
    },
    stock: 'low_stock',
    stockLabel: 'Últimas unidades',
    featured: true,
    new: true,
    bestseller: false,
    salesRank: 5,
    releaseOrder: 3,
    tags: ['zip-up', 'atelier', 'layering'],
  },
  {
    id: 'kdc-h05',
    slug: 'hoodie-raw-seam-graphite',
    name: 'HOODIE RAW SEAM GRAPHITE',
    subtitle: 'Costura Expuesta · 500 GSM',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    collection: 'Drop 02 — Monolith',
    price: 209900,
    images: [hoodieCharcoalImg, lookbookOutfitImg, hoodieOliveImg],
    colors: [
      {
        id: 'gris',
        name: 'Gris Piedra',
        hex: '#8C8B85',
        imagePrimary: hoodieCharcoalImg,
        imageSecondary: lookbookOutfitImg,
        imageFilter: 'brightness(1.12) contrast(0.92)',
      },
      {
        id: 'negro',
        name: 'Negro Carbón',
        hex: '#1C1C1B',
        imagePrimary: hoodieCharcoalImg,
        imageSecondary: heroEditorialImg,
      },
      {
        id: 'oliva',
        name: 'Verde Oliva',
        hex: '#555E4B',
        imagePrimary: hoodieOliveImg,
        imageSecondary: brandCraftImg,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Construcción con puntada overlock externa en sisas y espalda central. El acabado en grafito mineral se logra mediante teñido en frío de bajo impacto hídrico.',
    specs: {
      gsm: '500 GSM Mineral Wash',
      fit: 'Oversized Drop-Shoulder',
      composition: '100% Algodón Peinado',
      origin: 'Bogotá, Colombia',
      modelInfo: 'El modelo mide 1.79m y usa talla M',
    },
    stock: 'in_stock',
    stockLabel: 'En stock',
    featured: false,
    new: true,
    bestseller: false,
    salesRank: 6,
    releaseOrder: 5,
    tags: ['raw-seam', 'graphite', 'drop-02'],
  },
  {
    id: 'kdc-h06',
    slug: 'hoodie-thermal-waffle-lined',
    name: 'HOODIE THERMAL ARCHIVE',
    subtitle: 'Doble Capa · 560 GSM Total',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    collection: 'Atelier Heavyweight',
    price: 249900,
    images: [hoodieOliveImg, brandCraftImg, hoodieCharcoalImg],
    colors: [
      {
        id: 'oliva',
        name: 'Verde Oliva',
        hex: '#555E4B',
        imagePrimary: hoodieOliveImg,
        imageSecondary: brandCraftImg,
        imageFilter: 'contrast(1.06) brightness(0.94)',
      },
      {
        id: 'espresso',
        name: 'Espresso',
        hex: '#3A302A',
        imagePrimary: hoodieCharcoalImg,
        imageSecondary: heroEditorialImg,
        imageFilter: 'sepia(0.28) brightness(0.92) contrast(1.06)',
      },
      {
        id: 'arena',
        name: 'Arena / Bone',
        hex: '#DFD9CE',
        imagePrimary: hoodieSandImg,
        imageSecondary: lookbookOutfitImg,
      },
    ],
    sizes: ['M', 'L', 'XL'],
    description:
      'Diseñado para noches frías de sabana y montaña. Exterior en jersey pesado e interior forrado en tejido waffle térmico que conserva el calor corporal manteniendo una caída impecable.',
    specs: {
      gsm: '560 GSM Dual-Layer Waffle Lined',
      fit: 'Structured Oversized — Actúa como chaqueta ligera',
      composition: '100% Algodón de Doble Punto',
      origin: 'Bogotá, Colombia',
      modelInfo: 'El modelo mide 1.84m y usa talla L',
    },
    stock: 'low_stock',
    stockLabel: 'Últimas unidades',
    featured: false,
    new: false,
    bestseller: true,
    salesRank: 4,
    releaseOrder: 6,
    tags: ['thermal', 'heavyweight', 'archive'],
  },
  {
    id: 'kdc-h07',
    slug: 'hoodie-core-relaxed-sand',
    name: 'HOODIE CORE DAILY',
    subtitle: 'Everyday Weight · 460 GSM',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    collection: 'Collection 01',
    price: 179900,
    images: [hoodieSandImg, hoodieOliveImg, heroEditorialImg],
    colors: [
      {
        id: 'arena',
        name: 'Arena / Bone',
        hex: '#DFD9CE',
        imagePrimary: hoodieSandImg,
        imageSecondary: heroEditorialImg,
      },
      {
        id: 'negro',
        name: 'Negro Carbón',
        hex: '#1C1C1B',
        imagePrimary: hoodieCharcoalImg,
        imageSecondary: lookbookOutfitImg,
      },
      {
        id: 'gris',
        name: 'Gris Piedra',
        hex: '#8C8B85',
        imagePrimary: hoodieSandImg,
        imageSecondary: brandCraftImg,
        imageFilter: 'grayscale(0.85) brightness(0.94)',
      },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'El punto de entrada perfecto al universo KÓDICE. Gramaje equilibrado de 460 GSM pensado para usarse durante todo el año en cualquier clima urbano colombiano.',
    specs: {
      gsm: '460 GSM All-Season French Terry',
      fit: 'Relaxed Standard — Ajuste cómodo y versátil',
      composition: '100% Algodón Suavizado',
      origin: 'Colombia',
      modelInfo: 'El modelo mide 1.78m y usa talla M',
    },
    stock: 'in_stock',
    stockLabel: 'En stock',
    featured: false,
    new: false,
    bestseller: false,
    salesRank: 7,
    releaseOrder: 7,
    tags: ['daily', 'essential', 'core'],
  },
  {
    id: 'kdc-h08',
    slug: 'hoodie-cobalt-edition-01',
    name: 'HOODIE EDITION COBALT',
    subtitle: 'Tonal Stitch · 500 GSM',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    collection: 'Drop 02 — Monolith',
    price: 224900,
    images: [brandCraftImg, hoodieCharcoalImg, hoodieSandImg],
    colors: [
      {
        id: 'cobalto',
        name: 'Azul Cobalto',
        hex: '#243B67',
        imagePrimary: brandCraftImg,
        imageSecondary: hoodieCharcoalImg,
      },
      {
        id: 'negro',
        name: 'Negro Carbón',
        hex: '#1C1C1B',
        imagePrimary: hoodieCharcoalImg,
        imageSecondary: heroEditorialImg,
      },
      {
        id: 'arena',
        name: 'Arena / Bone',
        hex: '#DFD9CE',
        imagePrimary: hoodieSandImg,
        imageSecondary: brandCraftImg,
      },
    ],
    sizes: ['S', 'M', 'L'],
    description:
      'Pieza acento de la colección Monolith. Teñido profundo con micro-bordado tonal en el puño izquierdo y ribetes reforzados de 7cm.',
    specs: {
      gsm: '500 GSM Deep-Dye Terry',
      fit: 'Boxy Fit',
      composition: '100% Algodón Peinado',
      origin: 'Bogotá, Colombia',
      modelInfo: 'El modelo mide 1.82m y usa talla L',
    },
    stock: 'low_stock',
    stockLabel: 'Últimas unidades',
    featured: false,
    new: true,
    bestseller: false,
    salesRank: 8,
    releaseOrder: 8,
    tags: ['limited', 'cobalt', 'drop-02'],
  },

  // ================= CATEGORÍAS ESCALABLES (SHOP THE LOOK & EXPANSIÓN) =================
  {
    id: 'kdc-p01',
    slug: 'pantalon-cargo-wide-slate',
    name: 'PANTALÓN CARGO ARCHITECT',
    subtitle: 'Wide-Leg · Sarga Pesada 380 GSM',
    category: 'pantalones',
    categoryLabel: 'Pantalones',
    collection: 'Drop 02 — Monolith',
    price: 249900,
    images: [lookbookOutfitImg, heroEditorialImg],
    colors: [
      {
        id: 'negro',
        name: 'Negro Carbón',
        hex: '#1C1C1B',
        imagePrimary: lookbookOutfitImg,
        imageSecondary: heroEditorialImg,
      },
      {
        id: 'oliva',
        name: 'Verde Oliva',
        hex: '#555E4B',
        imagePrimary: lookbookOutfitImg,
        imageSecondary: hoodieOliveImg,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Pantalón de corte amplio en sarga de algodón de alto gramaje con pliegues en rodilla y ajustadores ocultos en el ruedo para modular la caída sobre el calzado.',
    specs: {
      gsm: '380 GSM Brushed Cotton Twill',
      fit: 'Wide-Leg Relaxed',
      composition: '100% Algodón Estructurado',
      origin: 'Bogotá, Colombia',
      modelInfo: 'El modelo mide 1.81m y usa talla M (32)',
    },
    stock: 'in_stock',
    stockLabel: 'En stock',
    featured: false,
    new: true,
    bestseller: false,
    salesRank: 9,
    releaseOrder: 9,
    tags: ['lookbook', 'cargo', 'pantalones'],
  },
  {
    id: 'kdc-c01',
    slug: 'camiseta-heavy-boxy-tee',
    name: 'CAMISETA HEAVYWEIGHT 280G',
    subtitle: 'Cuello Cerrado · 280 GSM Jersey',
    category: 'camisetas',
    categoryLabel: 'Camisetas',
    collection: 'Collection 01',
    price: 119900,
    images: [hoodieSandImg, brandCraftImg],
    colors: [
      {
        id: 'arena',
        name: 'Arena / Bone',
        hex: '#DFD9CE',
        imagePrimary: hoodieSandImg,
        imageSecondary: brandCraftImg,
      },
      {
        id: 'negro',
        name: 'Negro Carbón',
        hex: '#1C1C1B',
        imagePrimary: hoodieCharcoalImg,
        imageSecondary: heroEditorialImg,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Camiseta base diseñada para llevar sola o en layering bajo nuestros hoodies. Cuello acanalado de 2.8cm que no pierde su forma.',
    specs: {
      gsm: '280 GSM Heavy Jersey',
      fit: 'Boxy Drop-Shoulder',
      composition: '100% Algodón Peruano',
      origin: 'Colombia',
      modelInfo: 'El modelo mide 1.81m y usa talla L',
    },
    stock: 'in_stock',
    stockLabel: 'En stock',
    featured: false,
    new: true,
    bestseller: false,
    salesRank: 10,
    releaseOrder: 10,
    tags: ['camisetas', 'layering', 'essential'],
  },
  {
    id: 'kdc-s01',
    slug: 'sneaker-low-minimal-stone',
    name: 'SNEAKER MONO LOW 01',
    subtitle: 'Cuero Grano Completo · Suela Margom',
    category: 'calzado',
    categoryLabel: 'Calzado',
    collection: 'Atelier Heavyweight',
    price: 349900,
    images: [lookbookOutfitImg, brandCraftImg],
    colors: [
      {
        id: 'arena',
        name: 'Arena / Bone',
        hex: '#DFD9CE',
        imagePrimary: lookbookOutfitImg,
        imageSecondary: brandCraftImg,
      },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Silueta minimalista de perfil bajo diseñada para complementar pantalones de caída amplia. Forro interior en piel suave y suela cosida.',
    specs: {
      gsm: 'Cuero Napa + Suela de Caucho Natural',
      fit: 'Horma Estándar (S=39, M=40-41, L=42, XL=43)',
      composition: '100% Cuero Vacuno',
      origin: 'Hecho a mano en Colombia',
      modelInfo: 'Talla fiel a la numeración nacional',
    },
    stock: 'low_stock',
    stockLabel: 'Últimas unidades',
    featured: false,
    new: true,
    bestseller: false,
    salesRank: 11,
    releaseOrder: 11,
    tags: ['lookbook', 'calzado'],
  },
  {
    id: 'kdc-a01',
    slug: 'bolso-crossbody-nylon-matte',
    name: 'CROSSBODY UTILITY BAG',
    subtitle: 'Cordura Ballistic · Herrajes Mate',
    category: 'accesorios',
    categoryLabel: 'Accesorios',
    collection: 'Drop 02 — Monolith',
    price: 149900,
    images: [lookbookOutfitImg, heroEditorialImg],
    colors: [
      {
        id: 'negro',
        name: 'Negro Carbón',
        hex: '#1C1C1B',
        imagePrimary: lookbookOutfitImg,
        imageSecondary: heroEditorialImg,
      },
    ],
    sizes: ['M', 'L'],
    description:
      'Bolso cruzado de perfil estructurado con compartimento acolchado y correa ajustable con hebilla de liberación rápida.',
    specs: {
      gsm: 'Nylon Repelente al Agua 1000D',
      fit: 'Capacidad 4.5 Litros',
      composition: '100% Nylon Técnico',
      origin: 'Bogotá, Colombia',
      modelInfo: 'Unitalla ajustable',
    },
    stock: 'in_stock',
    stockLabel: 'En stock',
    featured: false,
    new: true,
    bestseller: false,
    salesRank: 12,
    releaseOrder: 12,
    tags: ['lookbook', 'accesorios'],
  },
];

export const LOOKBOOK_HOTSPOTS: LookbookHotspot[] = [
  {
    id: 'spot-hoodie',
    label: '01 · Hoodie Monolith Washed',
    categoryLabel: 'Hoodies',
    xPercent: 48,
    yPercent: 34,
    productId: 'kdc-h02',
    fitNote: 'Talla L · Caída boxy sobre cintura con acabado lavado oliva.',
  },
  {
    id: 'spot-bag',
    label: '02 · Crossbody Utility Bag',
    categoryLabel: 'Accesorios',
    xPercent: 56,
    yPercent: 47,
    productId: 'kdc-a01',
    fitNote: 'Correa cruzada en nylon mate que contrasta con el tejido de algodón.',
  },
  {
    id: 'spot-pants',
    label: '03 · Pantalón Cargo Architect',
    categoryLabel: 'Pantalones',
    xPercent: 46,
    yPercent: 66,
    productId: 'kdc-p01',
    fitNote: 'Corte wide-leg en sarga pesada con caída recta sobre el calzado.',
  },
  {
    id: 'spot-shoes',
    label: '04 · Sneaker Mono Low 01',
    categoryLabel: 'Calzado',
    xPercent: 49,
    yPercent: 89,
    productId: 'kdc-s01',
    fitNote: 'Cuero color hueso que equilibra los tonos oscuros del outfit.',
  },
];

export function formatCOP(amount: number): string {
  return `$${amount.toLocaleString('es-CO')} COP`;
}
