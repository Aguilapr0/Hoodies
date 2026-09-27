import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Minus,
  Plus,
  Ruler,
  ZoomIn,
  X,
} from 'lucide-react';
import {
  Product,
  SizeCode,
  formatCOP,
  STORE_CONFIG,
} from '../data/catalog';
import { ResilientImage } from './ResilientImage';
import { ProductCard } from './ProductCard';

interface ProductDetailViewProps {
  product: Product;
  initialColorId?: string;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product, colorId?: string) => void;
  onAddToCart: (
    product: Product,
    colorId: string,
    size: SizeCode,
    quantity: number
  ) => void;
  onBuyNow: (
    product: Product,
    colorId: string,
    size: SizeCode,
    quantity: number
  ) => void;
}

const SIZE_CHART_CM: Record<
  SizeCode,
  { chest: string; length: string; shoulder: string; heightRec: string }
> = {
  S: {
    chest: '58 cm',
    length: '66 cm',
    shoulder: '56 cm',
    heightRec: '1.60m – 1.71m',
  },
  M: {
    chest: '61 cm',
    length: '69 cm',
    shoulder: '58 cm',
    heightRec: '1.72m – 1.78m',
  },
  L: {
    chest: '64 cm',
    length: '72 cm',
    shoulder: '61 cm',
    heightRec: '1.79m – 1.85m',
  },
  XL: {
    chest: '67 cm',
    length: '75 cm',
    shoulder: '64 cm',
    heightRec: '1.86m+',
  },
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  initialColorId,
  allProducts,
  onBack,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedColorId, setSelectedColorId] = useState<string>(
    initialColorId || product.colors[0]?.id || 'negro'
  );
  const [selectedSize, setSelectedSize] = useState<SizeCode>(
    product.sizes.includes('L') ? 'L' : product.sizes[0]
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomCoords, setZoomCoords] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<
    'specs' | 'shipping' | 'returns' | null
  >('shipping');
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  useEffect(() => {
    setSelectedColorId(initialColorId || product.colors[0]?.id || 'negro');
    setSelectedSize(product.sizes.includes('L') ? 'L' : product.sizes[0]);
    setQuantity(1);
    setActiveImageIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product, initialColorId]);

  const activeColor =
    product.colors.find((c) => c.id === selectedColorId) || product.colors[0];

  // Build gallery array starting with selected color's primary & secondary images
  const galleryImages = [
    {
      src: activeColor.imagePrimary,
      label: `${product.name} — Frente (${activeColor.name})`,
      filter: activeColor.imageFilter,
    },
    {
      src: activeColor.imageSecondary,
      label: `${product.name} — Fit Editorial`,
    },
    ...product.images
      .filter(
        (img) =>
          img !== activeColor.imagePrimary && img !== activeColor.imageSecondary
      )
      .map((img, i) => ({
        src: img,
        label: `${product.name} — Detalle Textil 0${i + 3}`,
      })),
  ];

  const currentGalleryItem =
    galleryImages[activeImageIndex] || galleryImages[0];

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const sameCategoryA = a.category === product.category ? 1 : 0;
      const sameCategoryB = b.category === product.category ? 1 : 0;
      return sameCategoryB - sameCategoryA || a.salesRank - b.salesRank;
    })
    .slice(0, 4);

  const handleMouseMoveZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({ x, y });
  };

  const handleAdd = () => {
    onAddToCart(product, activeColor.id, selectedSize, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1600);
  };

  // Structured data JSON-LD for Product SEO
  const productSchemaJson = JSON.stringify({
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: STORE_CONFIG.brandName,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'COP',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  });

  return (
    <div className="py-8 sm:py-14 pb-28 md:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: productSchemaJson }}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Breadcrumb y regreso */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#141413] hover:underline underline-offset-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la tienda</span>
          </button>

          <nav
            aria-label="Ruta de navegación"
            className="hidden sm:flex items-center gap-2 text-xs text-[#65635E]"
          >
            <span>Inicio</span>
            <span aria-hidden="true">/</span>
            <span>{product.categoryLabel}</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#141413] font-medium">{product.name}</span>
          </nav>
        </div>

        {/* Módulo principal de producto: Galería izquierda + Módulo de compra contiguo derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Galería de fotografías con zoom */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24">
            {/* Miniaturas */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(index);
                    setIsZoomed(false);
                  }}
                  className={`w-16 h-20 sm:w-20 sm:h-24 bg-[#EFECE6] overflow-hidden border transition-all shrink-0 ${
                    activeImageIndex === index
                      ? 'border-[#141413] ring-1 ring-[#141413]'
                      : 'border-[#141413]/10 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <ResilientImage
                    src={img.src}
                    alt={img.label}
                    style={img.filter ? { filter: img.filter } : undefined}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Visor principal con zoom interactivo */}
            <div
              onClick={() => setIsZoomed((prev) => !prev)}
              onMouseMove={handleMouseMoveZoom}
              onMouseLeave={() => setIsZoomed(false)}
              className={`relative flex-1 aspect-[3/4] bg-[#EFECE6] overflow-hidden border border-[#141413]/10 select-none ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
            >
              <ResilientImage
                src={currentGalleryItem.src}
                alt={currentGalleryItem.label}
                eager
                style={{
                  ...(currentGalleryItem.filter
                    ? { filter: currentGalleryItem.filter }
                    : {}),
                  transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                  transform: isZoomed ? 'scale(1.85)' : 'scale(1)',
                }}
                className="w-full h-full object-cover object-center transition-transform duration-150 ease-out"
              />

              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  className="bg-[#F7F6F2]/90 backdrop-blur-sm px-3 py-1.5 text-[11px] font-medium text-[#141413] inline-flex items-center gap-1.5 border border-[#141413]/10 hover:bg-[#141413] hover:text-[#F7F6F2] transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{isZoomed ? 'Alejar' : 'Ampliar detalle'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Módulo de compra contiguo (Derecha) */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Metadatos superiores sin pills */}
            <div className="flex items-center gap-2 text-xs text-[#65635E] mb-2">
              <span>{product.collection}</span>
              <span aria-hidden="true">·</span>
              <span>{product.specs.gsm}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#141413] font-medium">
                {product.stockLabel}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#141413]">
              {product.name}
            </h1>

            <p className="text-xl sm:text-2xl font-mono-tabular font-semibold text-[#141413] mt-2">
              {formatCOP(product.price)}
            </p>
            <p className="text-xs text-[#65635E] mt-1">
              IVA incluido · Envío gratis en pedidos superiores a{' '}
              {formatCOP(STORE_CONFIG.freeShippingThreshold)}
            </p>

            {/* Descripción */}
            <p className="text-sm sm:text-[15px] leading-relaxed text-[#383734] mt-5 pb-6 border-b border-[#141413]/10">
              {product.description}
            </p>

            {/* Selección de color */}
            <div className="py-5 border-b border-[#141413]/10">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="uppercase tracking-wider text-[#65635E] font-medium">
                  Color seleccionado
                </span>
                <span className="font-semibold text-[#141413]">
                  {activeColor.name}
                </span>
              </div>

              <div className="flex items-center flex-wrap gap-3">
                {product.colors.map((color) => {
                  const isSelected = color.id === activeColor.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        setSelectedColorId(color.id);
                        setActiveImageIndex(0);
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-2 text-xs border transition-colors whitespace-nowrap ${
                        isSelected
                          ? 'border-[#141413] bg-[#EFECE6] text-[#141413] font-semibold'
                          : 'border-[#141413]/15 text-[#65635E] hover:border-[#141413]/40'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selección de talla + Guía de tallas */}
            <div className="py-5 border-b border-[#141413]/10">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="uppercase tracking-wider text-[#65635E] font-medium">
                  Seleccionar talla
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#141413] underline underline-offset-4 hover:text-[#65635E]"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Guía de tallas</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {(['S', 'M', 'L', 'XL'] as SizeCode[]).map((size) => {
                  const available = product.sizes.includes(size);
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!available}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-xs font-mono-tabular font-semibold border transition-colors ${
                        !available
                          ? 'border-[#141413]/10 text-[#65635E]/40 line-through cursor-not-allowed'
                          : isSelected
                          ? 'border-[#141413] bg-[#141413] text-[#F7F6F2]'
                          : 'border-[#141413]/20 bg-transparent text-[#141413] hover:border-[#141413]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-[#65635E] mt-2.5">
                {product.specs.modelInfo} · Recomendamos tu talla habitual para
                caída Boxy/Oversized.
              </p>
            </div>

            {/* Cantidad + Botones de compra */}
            <div className="py-6 space-y-3">
              <div className="flex items-center gap-3">
                {/* Selector de cantidad */}
                <div className="inline-flex items-center border border-[#141413]/20 bg-[#F7F6F2] h-12">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-full inline-flex items-center justify-center text-[#141413] hover:bg-[#EFECE6]"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-mono-tabular font-medium">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-full inline-flex items-center justify-center text-[#141413] hover:bg-[#EFECE6]"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Botón AGREGAR AL CARRITO */}
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 h-12 px-6 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                    addedFeedback
                      ? 'bg-[#1F3A2E] text-[#F7F6F2]'
                      : 'bg-[#141413] text-[#F7F6F2] hover:bg-[#2B2B29]'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>AGREGADO AL CARRITO</span>
                    </>
                  ) : (
                    <span>AGREGAR AL CARRITO</span>
                  )}
                </button>
              </div>

              {/* Botón COMPRAR AHORA */}
              <button
                type="button"
                onClick={() =>
                  onBuyNow(product, activeColor.id, selectedSize, quantity)
                }
                className="w-full h-12 px-6 border border-[#141413] bg-transparent text-[#141413] hover:bg-[#EFECE6] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors whitespace-nowrap"
              >
                COMPRAR AHORA · {formatCOP(product.price * quantity)}
              </button>
            </div>

            {/* Acordeones de Especificaciones, Envío y Cambios */}
            <div className="border-t border-[#141413]/10 divide-y divide-[#141413]/10">
              {/* Detalles y Gramaje */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenAccordion(
                      openAccordion === 'specs' ? null : 'specs'
                    )
                  }
                  className="w-full py-4 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#141413]"
                >
                  <span>Especificaciones y Construcción</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'specs' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'specs' && (
                  <div className="pb-4 text-xs sm:text-sm text-[#65635E] space-y-2">
                    <p>
                      <strong className="text-[#141413]">Tejido:</strong>{' '}
                      {product.specs.gsm}
                    </p>
                    <p>
                      <strong className="text-[#141413]">Silueta:</strong>{' '}
                      {product.specs.fit}
                    </p>
                    <p>
                      <strong className="text-[#141413]">Composición:</strong>{' '}
                      {product.specs.composition}
                    </p>
                    <p>
                      <strong className="text-[#141413]">Origen:</strong>{' '}
                      {product.specs.origin}
                    </p>
                  </div>
                )}
              </div>

              {/* Información de envío */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenAccordion(
                      openAccordion === 'shipping' ? null : 'shipping'
                    )
                  }
                  className="w-full py-4 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#141413]"
                >
                  <span>Información de envío en Colombia</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'shipping' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pb-4 text-xs sm:text-sm text-[#65635E] space-y-1.5">
                    <p>
                      · <strong className="text-[#141413]">Bogotá y Sabana:</strong>{' '}
                      Entrega en 24 a 48 horas hábiles.
                    </p>
                    <p>
                      · <strong className="text-[#141413]">Medellín, Cali, Barranquilla y principales:</strong>{' '}
                      2 a 3 días hábiles.
                    </p>
                    <p>
                      · Envío estándar nacional:{' '}
                      <span className="font-mono-tabular">
                        {formatCOP(STORE_CONFIG.standardShippingCost)}
                      </span>{' '}
                      (Gratis desde{' '}
                      <span className="font-mono-tabular">
                        {formatCOP(STORE_CONFIG.freeShippingThreshold)}
                      </span>
                      ).
                    </p>
                  </div>
                )}
              </div>

              {/* Cambios y devoluciones */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setOpenAccordion(
                      openAccordion === 'returns' ? null : 'returns'
                    )
                  }
                  className="w-full py-4 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#141413]"
                >
                  <span>Cambios y devoluciones</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === 'returns' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'returns' && (
                  <div className="pb-4 text-xs sm:text-sm text-[#65635E] space-y-1.5">
                    <p>
                      Tienes hasta <strong className="text-[#141413]">30 días calendario</strong>{' '}
                      desde la recepción de tu pedido para solicitar cambio de
                      talla o color sin costo adicional en tu primer cambio.
                    </p>
                    <p>
                      Las prendas deben conservar sus etiquetas originales y no
                      presentar señales de lavado o uso.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* También te puede interesar */}
        <div className="mt-24 pt-16 border-t border-[#141413]/10">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#65635E] mb-1.5">
                SELECCIÓN RELACIONADA
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
                También te puede interesar
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Barra fija inferior de compra rápida en móvil (cumpliendo límite < 15% viewport) */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-30 bg-[#F7F6F2]/95 backdrop-blur-md border-t border-[#141413]/15 px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#141413] truncate">
            {product.name}
          </p>
          <p className="text-xs font-mono-tabular text-[#65635E]">
            {formatCOP(product.price)} · Talla {selectedSize}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 bg-[#141413] text-[#F7F6F2] text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0"
        >
          {addedFeedback ? 'Agregado ✓' : 'Agregar'}
        </button>
      </div>

      {/* Modal Guía de Tallas */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F7F6F2] border border-[#141413]/15 max-w-lg w-full p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-[#141413]/10 pb-4 mb-5">
              <div>
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#65635E]">
                  MEDIDAS DE LA PRENDA EN PLANO
                </p>
                <h3 className="font-display text-xl font-bold text-[#141413]">
                  Guía de Tallas · {product.categoryLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className="p-1.5 text-[#65635E] hover:text-[#141413]"
                aria-label="Cerrar guía de tallas"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#65635E] mb-4">
              Nuestras siluetas tienen corte <strong className="text-[#141413]">Boxy / Oversized</strong>.
              Elige tu talla habitual para el fit relajado de las fotografías o
              una talla menos para un ajuste más estándar.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono-tabular">
                <thead>
                  <tr className="border-b border-[#141413]/20 text-[#141413]">
                    <th className="py-2.5 pr-3">Talla</th>
                    <th className="py-2.5 px-3">Ancho Pecho</th>
                    <th className="py-2.5 px-3">Largo Total</th>
                    <th className="py-2.5 px-3">Hombro</th>
                    <th className="py-2.5 pl-3">Estatura sug.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141413]/10 text-[#383734]">
                  {(['S', 'M', 'L', 'XL'] as SizeCode[]).map((sz) => (
                    <tr key={sz}>
                      <td className="py-2.5 pr-3 font-semibold text-[#141413]">
                        {sz}
                      </td>
                      <td className="py-2.5 px-3">{SIZE_CHART_CM[sz].chest}</td>
                      <td className="py-2.5 px-3">{SIZE_CHART_CM[sz].length}</td>
                      <td className="py-2.5 px-3">
                        {SIZE_CHART_CM[sz].shoulder}
                      </td>
                      <td className="py-2.5 pl-3">
                        {SIZE_CHART_CM[sz].heightRec}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-[#141413]/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                className="px-5 py-2.5 bg-[#141413] text-[#F7F6F2] text-xs font-medium uppercase tracking-wider"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Zoom de Imagen en pantalla completa */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[90vh] bg-[#EFECE6] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#F7F6F2] text-[#141413] flex items-center justify-center"
              aria-label="Cerrar vista ampliada"
            >
              <X className="w-5 h-5" />
            </button>
            <ResilientImage
              src={currentGalleryItem.src}
              alt={currentGalleryItem.label}
              className="w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
