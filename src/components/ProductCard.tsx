import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Product, SizeCode, formatCOP } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product, selectedColorId?: string) => void;
  onAddToCart: (product: Product, colorId: string, size: SizeCode, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedColorId, setSelectedColorId] = useState<string>(
    product.colors[0]?.id || 'negro'
  );
  const [selectedSize, setSelectedSize] = useState<SizeCode>(
    product.sizes.includes('L') ? 'L' : product.sizes[0]
  );
  const [justAdded, setJustAdded] = useState(false);

  const activeColor =
    product.colors.find((c) => c.id === selectedColorId) || product.colors[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, activeColor.id, selectedSize, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article className="group flex flex-col">
      {/* Fotografía principal con protagonismo editorial y cambio suave en hover */}
      <div
        onClick={() => onSelectProduct(product, activeColor.id)}
        className="relative aspect-[3/4] w-full bg-[#EFECE6] overflow-hidden cursor-pointer mb-3.5 border border-[#141413]/[0.06]"
      >
        {/* Imagen primaria */}
        <ResilientImage
          src={activeColor.imagePrimary}
          alt={`${product.name} en color ${activeColor.name}`}
          style={activeColor.imageFilter ? { filter: activeColor.imageFilter } : undefined}
          className="w-full h-full object-cover object-center transition-transform duration-200 ease-out group-hover:scale-[1.02]"
          fallbackLabel={product.name}
        />

        {/* Segunda fotografía al pasar el cursor en desktop */}
        <div className="hidden md:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none bg-[#EFECE6]">
          <ResilientImage
            src={activeColor.imageSecondary}
            alt={`${product.name} vista editorial secundaria`}
            className="w-full h-full object-cover object-center scale-[1.01] group-hover:scale-100 transition-transform duration-200 ease-out"
            fallbackLabel={product.name}
          />
        </div>

        {/* Barra inferior de acción rápida en desktop y móvil */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 bg-gradient-to-t from-black/65 via-black/30 to-transparent opacity-100 md:opacity-0 md: translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-150 ease-out flex items-center justify-between gap-1.5"
        >
          {/* Selector rápido de talla */}
          <div className="hidden sm:flex items-center gap-1 bg-[#F7F6F2]/95 px-1.5 py-1">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`w-6 h-6 text-[11px] font-mono-tabular font-medium transition-colors whitespace-nowrap ${
                  selectedSize === size
                    ? 'bg-[#141413] text-[#F7F6F2]'
                    : 'text-[#141413]/70 hover:text-[#141413]'
                }`}
                aria-label={`Seleccionar talla ${size}`}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium tracking-wide whitespace-nowrap transition-colors duration-150 ${
              justAdded
                ? 'bg-[#1F3A2E] text-[#F7F6F2]'
                : 'bg-[#F7F6F2] text-[#141413] hover:bg-[#141413] hover:text-[#F7F6F2]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>AGREGADO · {selectedSize}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>AGREGAR</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metadatos limpios sin bordes pesados ni cápsulas (Zero-Pill Discipline) */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2 text-[12px] text-[#65635E]">
          <span className="truncate">{product.categoryLabel}</span>
          <span className="shrink-0 flex items-center gap-1.5">
            <span aria-hidden="true">·</span>
            <span
              className={
                product.stock === 'low_stock'
                  ? 'text-[#7A4B2A] font-medium'
                  : 'text-[#65635E]'
              }
            >
              {product.stockLabel}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelectProduct(product, activeColor.id)}
          className="text-left group/title focus:outline-none"
        >
          <h3 className="text-[15px] sm:text-[16px] font-semibold tracking-tight text-[#141413] group-hover/title:underline underline-offset-4 truncate">
            {product.name}
          </h3>
        </button>

        <p className="text-[14px] sm:text-[15px] font-mono-tabular font-medium text-[#141413]">
          {formatCOP(product.price)}
        </p>

        {/* Selección interactiva de colores disponibles */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 pt-1.5">
          {product.colors.map((color) => {
            const isSelected = color.id === activeColor.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => setSelectedColorId(color.id)}
                className={`inline-flex items-center gap-1.5 text-[12px] transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'text-[#141413] font-medium'
                    : 'text-[#65635E] hover:text-[#141413]'
                }`}
                aria-label={`Color ${color.name}`}
                aria-pressed={isSelected}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform ${
                    isSelected
                      ? 'ring-1 ring-offset-2 ring-offset-[#F7F6F2] ring-[#141413] scale-110'
                      : 'border border-black/20'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
                <span className="truncate max-w-[10ch] sm:max-w-none">
                  {color.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
};
