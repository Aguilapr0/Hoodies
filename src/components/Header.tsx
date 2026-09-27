import React, { useState } from 'react';
import { Search, User, ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { CATEGORIES, CategoryId, Product, formatCOP } from '../data/catalog';
import { ResilientImage } from './ResilientImage';

export type NavSection = 'home' | 'shop' | 'hoodies' | 'new' | 'collections' | 'product';

interface HeaderProps {
  activeNav: NavSection;
  activeCategory: CategoryId;
  cartCount: number;
  products: Product[];
  onNavigate: (section: NavSection, category?: CategoryId) => void;
  onSelectProduct: (product: Product) => void;
  onOpenCart: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  activeCategory,
  cartCount,
  products,
  onNavigate,
  onSelectProduct,
  onOpenCart,
  onOpenAccount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems: { id: NavSection; label: string; category?: CategoryId }[] = [
    { id: 'home', label: 'Inicio' },
    { id: 'shop', label: 'Tienda', category: 'all' },
    { id: 'hoodies', label: 'Hoodies', category: 'hoodies' },
    { id: 'new', label: 'Nuevos' },
    { id: 'collections', label: 'Colecciones' },
  ];

  const searchResults = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.colors.some((c) => c.name.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : products.slice(0, 4);

  return (
    <>
      <header className="sticky top-0 z-40 h-16 w-full bg-[#F7F6F2]/95 backdrop-blur-md border-b border-[#141413]/10 transition-colors">
        <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="font-display text-xl sm:text-2xl font-bold tracking-[-0.03em] text-[#141413] whitespace-nowrap shrink-0 focus:outline-none"
          >
            KÓDICE
          </a>

          {/* Zone 2: Centered Navigation (Desktop) */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#65635E]"
          >
            {navItems.map((item) => {
              const isActive =
                activeNav === item.id ||
                (item.id === 'hoodies' &&
                  activeNav === 'shop' &&
                  activeCategory === 'hoodies');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id, item.category)}
                  className={`relative py-1 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-[#141413] font-semibold after:content-[""] after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:bg-[#141413]'
                      : 'hover:text-[#141413]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions (Search, Account, Cart, Mobile Hamburger) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSearchOpen((prev) => !prev);
                setMobileMenuOpen(false);
              }}
              className="w-10 h-10 inline-flex items-center justify-center text-[#141413] hover:bg-[#141413]/5 transition-colors"
              aria-label="Buscar prendas"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            <button
              type="button"
              onClick={onOpenAccount}
              className="hidden sm:inline-flex w-10 h-10 items-center justify-center text-[#141413] hover:bg-[#141413]/5 transition-colors"
              aria-label="Mi cuenta y pedidos"
            >
              <User className="w-[18px] h-[18px]" />
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              className="h-10 px-2.5 inline-flex items-center gap-1.5 text-[#141413] hover:bg-[#141413]/5 transition-colors whitespace-nowrap"
              aria-label={`Carrito de compras con ${cartCount} productos`}
            >
              <ShoppingBag className="w-[18px] h-[18px] shrink-0" />
              <span className="text-xs font-mono-tabular font-medium">
                ({cartCount})
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
                setSearchOpen(false);
              }}
              className="md:hidden w-10 h-10 inline-flex items-center justify-center text-[#141413] hover:bg-[#141413]/5 transition-colors"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Buscador desplegable instantáneo */}
      {searchOpen && (
        <div className="fixed inset-x-0 top-16 z-40 bg-[#F7F6F2] border-b border-[#141413]/15 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6">
            <div className="flex items-center gap-3 border-b border-[#141413]/20 pb-3">
              <Search className="w-4 h-4 text-[#65635E] shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar hoodies, 500 GSM, verde oliva, pantalones, colecciones..."
                autoFocus
                className="w-full bg-transparent text-sm sm:text-base text-[#141413] placeholder:text-[#65635E] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs font-medium text-[#65635E] hover:text-[#141413] whitespace-nowrap px-2 py-1"
              >
                ESC
              </button>
            </div>

            {/* Sugerencias de categorías escalables */}
            <div className="flex items-center flex-wrap gap-2 pt-4 pb-5">
              <span className="text-xs text-[#65635E] mr-1">Categorías:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onNavigate('shop', cat.id);
                    setSearchOpen(false);
                  }}
                  className="px-3 py-1 text-xs font-medium bg-[#EFECE6] text-[#141413] hover:bg-[#141413] hover:text-[#F7F6F2] transition-colors whitespace-nowrap"
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Resultados rápidos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {searchResults.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectProduct(item);
                    setSearchOpen(false);
                  }}
                  className="group flex items-center gap-3 text-left p-2 hover:bg-[#EFECE6] transition-colors"
                >
                  <div className="w-14 h-18 bg-[#EFECE6] shrink-0 overflow-hidden">
                    <ResilientImage
                      src={item.colors[0].imagePrimary}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#65635E] truncate">
                      {item.categoryLabel}
                    </p>
                    <p className="text-xs font-semibold text-[#141413] truncate group-hover:underline">
                      {item.name}
                    </p>
                    <p className="text-xs font-mono-tabular text-[#141413] mt-0.5">
                      {formatCOP(item.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menú móvil con soporte para futuras categorías */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-30 bg-[#F7F6F2] md:hidden overflow-y-auto">
          <div className="px-6 py-8 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
            <div className="space-y-8">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNavigate(item.id, item.category);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between py-2 text-left font-display text-2xl font-bold text-[#141413] border-b border-[#141413]/10"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-5 h-5 text-[#65635E]" />
                  </button>
                ))}
              </nav>

              {/* Categorías escalables listas desde el inicio */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#65635E] mb-3">
                  Explorar por categoría
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onNavigate('shop', cat.id);
                        setMobileMenuOpen(false);
                      }}
                      className="px-3.5 py-2.5 text-left text-sm font-medium bg-[#EFECE6] text-[#141413] hover:bg-[#141413] hover:text-[#F7F6F2] transition-colors flex items-center justify-between"
                    >
                      <span>{cat.label}</span>
                      <span className="text-[11px] font-mono-tabular opacity-70">
                        {cat.id === 'hoodies' ? '08' : '01'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#141413]/10 flex items-center justify-between text-xs text-[#65635E]">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAccount();
                }}
                className="font-medium text-[#141413] underline underline-offset-4"
              >
                Mi Cuenta / Rastrear Pedido
              </button>
              <span>Bogotá · Medellín · Envíos CO</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
