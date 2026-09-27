import React, { useState } from 'react';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import {
  EDITORIAL_ASSETS,
  LOOKBOOK_HOTSPOTS,
  Product,
  SizeCode,
  formatCOP,
} from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface ShopTheLookProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (
    product: Product,
    colorId: string,
    size: SizeCode,
    quantity: number
  ) => void;
}

export const ShopTheLook: React.FC<ShopTheLookProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [activeSpotId, setActiveSpotId] = useState<string>(
    LOOKBOOK_HOTSPOTS[0].id
  );
  const [addedId, setAddedId] = useState<string | null>(null);

  const activeSpot =
    LOOKBOOK_HOTSPOTS.find((s) => s.id === activeSpotId) ||
    LOOKBOOK_HOTSPOTS[0];

  const handleQuickAdd = (product: Product) => {
    const defaultColor = product.colors[0]?.id || 'negro';
    const defaultSize: SizeCode = product.sizes.includes('L')
      ? 'L'
      : product.sizes[0];
    onAddToCart(product, defaultColor, defaultSize, 1);
    setAddedId(product.id);
    window.setTimeout(() => setAddedId(null), 1400);
  };

  return (
    <section
      id="shop-the-look"
      className="py-20 sm:py-28 border-t border-[#141413]/10 bg-[#EFECE6]/55"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Encabezado de sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#65635E] mb-2">
              STYLING & ARQUITECTURA DE PRENDAS
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#141413]">
              SHOP THE LOOK · OUTFIT 01
            </h2>
          </div>
          <p className="text-sm text-[#65635E] max-w-md">
            Haz clic en cada punto sobre la fotografía para explorar cómo
            nuestros hoodies interactúan con pantalones, calzado y accesorios de
            la colección.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Fotografía interactiva del outfit completo */}
          <div className="lg:col-span-7 relative aspect-[3/4] sm:aspect-[4/5] w-full bg-[#E5E0D8] overflow-hidden border border-[#141413]/10">
            <ResilientImage
              src={EDITORIAL_ASSETS.lookbook}
              alt="Outfit completo KÓDICE: Hoodie verde oliva, pantalón cargo, sneakers minimalistas y bolso cruzado"
              className="w-full h-full object-cover object-center"
            />

            {/* Hotspots interactivos sobre cada prenda */}
            {LOOKBOOK_HOTSPOTS.map((spot, idx) => {
              const isSelected = spot.id === activeSpot.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setActiveSpotId(spot.id)}
                  style={{
                    left: `${spot.xPercent}%`,
                    top: `${spot.yPercent}%`,
                  }}
                  className={`-translate-x-1/2 -translate-y-1/2 absolute z-10 w-9 h-9 rounded-full flex items-center justify-center font-mono-tabular text-xs font-medium transition-transform duration-150 ${
                    isSelected
                      ? 'bg-[#141413] text-[#F7F6F2] scale-115 ring-4 ring-[#F7F6F2]/80'
                      : 'bg-[#F7F6F2]/95 text-[#141413] hover:scale-110 ring-2 ring-[#141413]/20'
                  }`}
                  aria-label={`Ver prenda ${spot.label}`}
                  aria-pressed={isSelected}
                >
                  0{idx + 1}
                </button>
              );
            })}

            {/* Leyenda discreta inferior en la imagen */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black/75 via-black/35 to-transparent text-[#F7F6F2] flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#F7F6F2]/75">
                  SELECCIONADO · {activeSpot.categoryLabel}
                </p>
                <p className="text-sm sm:text-base font-semibold mt-0.5">
                  {activeSpot.label}
                </p>
                <p className="text-xs text-[#F7F6F2]/80 mt-0.5">
                  {activeSpot.fitNote}
                </p>
              </div>
            </div>
          </div>

          {/* Lista interactiva de prendas que componen el outfit */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="border-b border-[#141413]/10 pb-4">
              <p className="text-xs font-mono-tabular text-[#65635E]">
                04 PIEZAS EN ESTE OUTFIT · MULTICATEGORÍA
              </p>
            </div>

            <div className="divide-y divide-[#141413]/10">
              {LOOKBOOK_HOTSPOTS.map((spot, idx) => {
                const item = products.find((p) => p.id === spot.productId);
                if (!item) return null;
                const isSelected = spot.id === activeSpot.id;
                const isAdded = addedId === item.id;

                return (
                  <div
                    key={spot.id}
                    onClick={() => setActiveSpotId(spot.id)}
                    className={`py-4 px-3 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#F7F6F2]' : 'hover:bg-[#F7F6F2]/60'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-mono-tabular text-xs font-medium text-[#65635E] pt-1">
                        0{idx + 1}
                      </span>

                      <div className="w-16 h-20 bg-[#EFECE6] shrink-0 overflow-hidden border border-[#141413]/10">
                        <ResilientImage
                          src={item.colors[0].imagePrimary}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-[#65635E]">
                          <span>{item.categoryLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.stockLabel}</span>
                        </div>

                        <h3 className="text-sm sm:text-base font-semibold text-[#141413] truncate mt-0.5">
                          {item.name}
                        </h3>

                        <p className="text-xs text-[#65635E] mt-0.5">
                          {spot.fitNote}
                        </p>

                        <div className="flex items-center justify-between gap-3 mt-3">
                          <span className="text-sm font-mono-tabular font-medium text-[#141413]">
                            {formatCOP(item.price)}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectProduct(item);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#141413] hover:underline underline-offset-4 whitespace-nowrap"
                            >
                              <span>Ver prenda</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickAdd(item);
                              }}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                                isAdded
                                  ? 'bg-[#1F3A2E] text-[#F7F6F2]'
                                  : 'bg-[#141413] text-[#F7F6F2] hover:bg-[#2B2B29]'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Agregado</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Agregar</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
