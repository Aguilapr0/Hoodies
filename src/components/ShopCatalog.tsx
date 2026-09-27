import React, { useMemo, useState } from 'react';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import {
  CATEGORIES,
  COLLECTIONS,
  CategoryId,
  Product,
  SizeCode,
} from '../data/catalog';
import { ProductCard } from './ProductCard';

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'bestsellers';

interface ShopCatalogProps {
  products: Product[];
  selectedCategory: CategoryId;
  selectedCollectionFilter?: string;
  onlyNew?: boolean;
  onChangeCategory: (category: CategoryId) => void;
  onSelectProduct: (product: Product, colorId?: string) => void;
  onAddToCart: (
    product: Product,
    colorId: string,
    size: SizeCode,
    quantity: number
  ) => void;
}

export const ShopCatalog: React.FC<ShopCatalogProps> = ({
  products,
  selectedCategory,
  selectedCollectionFilter = 'all',
  onlyNew = false,
  onChangeCategory,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<SizeCode | 'all'>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    'all' | 'under_195' | '195_225' | 'over_225'
  >('all');
  const [selectedStock, setSelectedStock] = useState<
    'all' | 'in_stock' | 'low_stock'
  >('all');
  const [selectedCollection, setSelectedCollection] = useState<string>(
    selectedCollectionFilter
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    onlyNew ? 'newest' : 'featured'
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync collection prop if navigated from Collections
  React.useEffect(() => {
    setSelectedCollection(selectedCollectionFilter);
  }, [selectedCollectionFilter]);

  React.useEffect(() => {
    if (onlyNew) {
      setSortBy('newest');
    }
  }, [onlyNew]);

  const availableColors = useMemo(() => {
    const map = new Map<string, { id: string; name: string; hex: string }>();
    products.forEach((p) => {
      p.colors.forEach((c) => {
        if (!map.has(c.id)) {
          map.set(c.id, { id: c.id, name: c.name, hex: c.hex });
        }
      });
    });
    return Array.from(map.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (
          selectedCategory !== 'all' &&
          product.category !== selectedCategory
        ) {
          return false;
        }
        if (onlyNew && !product.new) {
          return false;
        }
        if (
          selectedCollection !== 'all' &&
          product.collection !== selectedCollection
        ) {
          return false;
        }
        if (selectedSize !== 'all' && !product.sizes.includes(selectedSize)) {
          return false;
        }
        if (
          selectedColor !== 'all' &&
          !product.colors.some((c) => c.id === selectedColor)
        ) {
          return false;
        }
        if (selectedStock !== 'all' && product.stock !== selectedStock) {
          return false;
        }
        if (selectedPriceRange === 'under_195' && product.price > 195000) {
          return false;
        }
        if (
          selectedPriceRange === '195_225' &&
          (product.price < 195000 || product.price > 225000)
        ) {
          return false;
        }
        if (selectedPriceRange === 'over_225' && product.price <= 225000) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'newest':
            return Number(b.new) - Number(a.new) || a.releaseOrder - b.releaseOrder;
          case 'bestsellers':
            return a.salesRank - b.salesRank;
          case 'featured':
          default:
            return Number(b.featured) - Number(a.featured) || a.salesRank - b.salesRank;
        }
      });
  }, [
    products,
    selectedCategory,
    onlyNew,
    selectedCollection,
    selectedSize,
    selectedColor,
    selectedStock,
    selectedPriceRange,
    sortBy,
  ]);

  const activeCategoryMeta =
    CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  const resetAllFilters = () => {
    onChangeCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setSelectedPriceRange('all');
    setSelectedStock('all');
    setSelectedCollection('all');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSize !== 'all' ||
    selectedColor !== 'all' ||
    selectedPriceRange !== 'all' ||
    selectedStock !== 'all' ||
    selectedCollection !== 'all';

  return (
    <section className="py-12 sm:py-16 min-h-[75vh]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Encabezado editorial de la tienda */}
        <div className="border-b border-[#141413]/10 pb-8 mb-8">
          <div className="flex items-center gap-2 text-xs text-[#65635E] mb-2">
            <span>TIENDA</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#141413] font-medium uppercase">
              {onlyNew ? 'NUEVOS LANZAMIENTOS' : activeCategoryMeta.label}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#141413]">
                {onlyNew
                  ? 'NUEVOS LANZAMIENTOS'
                  : selectedCategory === 'hoodies'
                  ? 'HOODIES HEAVYWEIGHT'
                  : selectedCategory === 'all'
                  ? 'CATÁLOGO COMPLETO'
                  : activeCategoryMeta.label.toUpperCase()}
              </h1>
              <p className="text-sm sm:text-base text-[#65635E] mt-2 max-w-2xl">
                {activeCategoryMeta.description}
              </p>
            </div>
            <p className="text-xs font-mono-tabular text-[#65635E] shrink-0">
              MOSTRANDO {filteredProducts.length} DE {products.length} PRENDAS
            </p>
          </div>

          {/* Barra de pestañas de categorías escalables (Funcional, permite filtrar al clic) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-6 pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? products.length
                  : products.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onChangeCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#141413] text-[#F7F6F2]'
                      : 'bg-[#EFECE6] text-[#141413] hover:bg-[#E3DFD7]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="font-mono-tabular text-[11px] opacity-70">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Barra de controles de filtrado y ordenamiento */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-[#141413]/20 text-[#141413] hover:bg-[#EFECE6] transition-colors whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>
                {mobileFiltersOpen ? 'Ocultar filtros' : 'Filtrar prendas'}
              </span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-[#65635E] hover:text-[#141413] transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>

          {/* Ordenar por */}
          <div className="flex items-center gap-2.5">
            <label
              htmlFor="sort-select"
              className="text-xs text-[#65635E] whitespace-nowrap"
            >
              Ordenar por:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#EFECE6] text-xs font-medium text-[#141413] px-3.5 py-2.5 border border-[#141413]/15 focus:outline-none focus:border-[#141413]"
            >
              <option value="featured">Destacados</option>
              <option value="newest">Más recientes</option>
              <option value="price_asc">Precio menor</option>
              <option value="price_desc">Precio mayor</option>
              <option value="bestsellers">Más vendidos</option>
            </select>
          </div>
        </div>

        {/* Panel de filtros avanzados (Talla, Color, Precio, Disponibilidad, Colección) */}
        {mobileFiltersOpen && (
          <div className="bg-[#EFECE6] border border-[#141413]/10 p-6 mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Filtro por Talla */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#141413] mb-3">
                Talla
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(['all', 'S', 'M', 'L', 'XL'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 text-xs font-mono-tabular font-medium transition-colors whitespace-nowrap ${
                      selectedSize === size
                        ? 'bg-[#141413] text-[#F7F6F2]'
                        : 'bg-[#F7F6F2] text-[#141413] hover:bg-[#E2DDD4]'
                    }`}
                  >
                    {size === 'all' ? 'Todas' : size}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por Color */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#141413] mb-3">
                Color
              </p>
              <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedColor('all')}
                  className={`text-left text-xs py-1 ${
                    selectedColor === 'all'
                      ? 'font-semibold text-[#141413] underline underline-offset-4'
                      : 'text-[#65635E] hover:text-[#141413]'
                  }`}
                >
                  Todos los colores
                </button>
                {availableColors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color.id)}
                    className={`inline-flex items-center gap-2 text-xs py-1 text-left ${
                      selectedColor === color.id
                        ? 'font-semibold text-[#141413]'
                        : 'text-[#65635E] hover:text-[#141413]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="truncate">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por Precio */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#141413] mb-3">
                Precio (COP)
              </p>
              <div className="flex flex-col gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'Todos los precios' },
                  { id: 'under_195', label: 'Hasta $195.000 COP' },
                  { id: '195_225', label: '$195.000 – $225.000 COP' },
                  { id: 'over_225', label: 'Más de $225.000 COP' },
                ].map((range) => (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() =>
                      setSelectedPriceRange(
                        range.id as typeof selectedPriceRange
                      )
                    }
                    className={`text-left py-1 font-mono-tabular ${
                      selectedPriceRange === range.id
                        ? 'font-semibold text-[#141413] underline underline-offset-4'
                        : 'text-[#65635E] hover:text-[#141413]'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por Disponibilidad */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#141413] mb-3">
                Disponibilidad
              </p>
              <div className="flex flex-col gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'Todas las prendas' },
                  { id: 'in_stock', label: 'En stock inmediato' },
                  { id: 'low_stock', label: 'Últimas unidades' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() =>
                      setSelectedStock(st.id as typeof selectedStock)
                    }
                    className={`text-left py-1 ${
                      selectedStock === st.id
                        ? 'font-semibold text-[#141413] underline underline-offset-4'
                        : 'text-[#65635E] hover:text-[#141413]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por Colección */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#141413]">
                  Colección
                </p>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-[#65635E] hover:text-[#141413]"
                  aria-label="Cerrar panel de filtros"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCollection('all')}
                  className={`text-left py-1 ${
                    selectedCollection === 'all'
                      ? 'font-semibold text-[#141413] underline underline-offset-4'
                      : 'text-[#65635E] hover:text-[#141413]'
                  }`}
                >
                  Todas las colecciones
                </button>
                {COLLECTIONS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedCollection(col.id)}
                    className={`text-left py-1 truncate ${
                      selectedCollection === col.id
                        ? 'font-semibold text-[#141413] underline underline-offset-4'
                        : 'text-[#65635E] hover:text-[#141413]'
                    }`}
                  >
                    {col.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cuadrícula de productos: 4 columnas en desktop, 2 en tablet, 2 en móvil */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#EFECE6] border border-[#141413]/10 p-8">
            <p className="font-display text-xl font-bold text-[#141413]">
              No encontramos prendas con esa combinación de filtros
            </p>
            <p className="text-sm text-[#65635E] mt-2 max-w-md mx-auto">
              Intenta ampliar tu búsqueda o explorar otra categoría de nuestra
              colección urbana.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-6 px-6 py-3 bg-[#141413] text-[#F7F6F2] text-xs font-medium uppercase tracking-wider hover:bg-[#2B2B29] transition-colors"
            >
              Ver todas las prendas
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
