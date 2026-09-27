import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import {
  PRODUCTS,
  COLLECTIONS,
  CATEGORIES,
  EDITORIAL_ASSETS,
  STORE_CONFIG,
  CategoryId,
  Product,
  SizeCode,
  formatCOP,
} from './data/catalog';
import { Header, NavSection } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ShopTheLook } from './components/ShopTheLook';
import { ShopCatalog } from './components/ShopCatalog';
import { ProductDetailView } from './components/ProductDetailView';
import {
  CartDrawer,
  CartItem,
  ConfirmedOrder,
} from './components/CartDrawer';
import { Footer, InfoModalType } from './components/Footer';
import { InfoModal } from './components/InfoModal';
import { ResilientImage } from './components/ResilientImage';

export default function App() {
  const [activeNav, setActiveNav] = useState<NavSection>('home');
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryId>('hoodies');
  const [selectedCollectionFilter, setSelectedCollectionFilter] =
    useState<string>('all');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeProductColorId, setActiveProductColorId] = useState<
    string | undefined
  >(undefined);
  const [showAllHoodiesOnHome, setShowAllHoodiesOnHome] =
    useState<boolean>(true);
  const [activeDropIndex, setActiveDropIndex] = useState<number>(0);

  // Cart & Orders state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kodice_cart_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return [
      {
        key: 'kdc-h01-negro-L',
        product: PRODUCTS[0],
        colorId: 'negro',
        colorName: 'Negro Carbón',
        image: PRODUCTS[0].colors[0].imagePrimary,
        size: 'L',
        quantity: 1,
      },
    ];
  });
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [cartInitialStep, setCartInitialStep] = useState<'cart' | 'checkout'>(
    'cart'
  );
  const [orders, setOrders] = useState<ConfirmedOrder[]>([]);
  const [infoModal, setInfoModal] = useState<InfoModalType>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubscribed, setNewsletterSubscribed] =
    useState<boolean>(false);

  const brandStoryRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('kodice_cart_v1', JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  // Update document title dynamically for SEO
  useEffect(() => {
    if (activeNav === 'product' && activeProduct) {
      document.title = `${activeProduct.name} (${formatCOP(
        activeProduct.price
      )}) | KÓDICE Colombia`;
    } else if (activeNav === 'shop' || activeNav === 'hoodies') {
      document.title = `Tienda · ${
        selectedCategory === 'hoodies'
          ? 'Hoodies Heavyweight'
          : 'Catálogo Urbano'
      } | KÓDICE Colombia`;
    } else if (activeNav === 'collections') {
      document.title = `Colecciones y Drops | KÓDICE Streetwear`;
    } else {
      document.title = `KÓDICE — Streetwear & Heavyweight Essentials | Colombia`;
    }
  }, [activeNav, activeProduct, selectedCategory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  const handleNavigate = (section: NavSection, category?: CategoryId) => {
    setActiveNav(section);
    if (section === 'hoodies') {
      setSelectedCategory('hoodies');
      setSelectedCollectionFilter('all');
    } else if (section === 'shop') {
      setSelectedCategory(category || 'all');
      setSelectedCollectionFilter('all');
    } else if (section === 'new') {
      setSelectedCategory('all');
      setSelectedCollectionFilter('all');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product, colorId?: string) => {
    setActiveProduct(product);
    setActiveProductColorId(colorId || product.colors[0]?.id);
    setActiveNav('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (
    product: Product,
    colorId: string,
    size: SizeCode,
    quantity: number
  ) => {
    const colorObj =
      product.colors.find((c) => c.id === colorId) || product.colors[0];
    const key = `${product.id}-${colorObj.id}-${size}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === key);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          key,
          product,
          colorId: colorObj.id,
          colorName: colorObj.name,
          image: colorObj.imagePrimary,
          size,
          quantity,
        },
      ];
    });

    showToast(`${product.name} (${size}) agregado al carrito`);
  };

  const handleBuyNow = (
    product: Product,
    colorId: string,
    size: SizeCode,
    quantity: number
  ) => {
    handleAddToCart(product, colorId, size, quantity);
    setCartInitialStep('checkout');
    setCartOpen(true);
  };

  const handleUpdateQuantity = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleCompleteOrder = (order: ConfirmedOrder) => {
    setOrders((prev) => [order, ...prev]);
    setCartItems([]);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const allHoodies = PRODUCTS.filter((p) => p.category === 'hoodies');
  const displayedHomeHoodies = showAllHoodiesOnHome
    ? allHoodies
    : allHoodies.filter((p) => p.featured);
  const activeDrop = COLLECTIONS[activeDropIndex] || COLLECTIONS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2] text-[#141413]">
      {/* Header principal (Top Bar Contract) */}
      <Header
        activeNav={activeNav}
        activeCategory={selectedCategory}
        cartCount={totalCartCount}
        products={PRODUCTS}
        onNavigate={handleNavigate}
        onSelectProduct={handleSelectProduct}
        onOpenCart={() => {
          setCartInitialStep('cart');
          setCartOpen(true);
        }}
        onOpenAccount={() => setInfoModal('account')}
      />

      {/* Feedback sutil al agregar al carrito */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-40 bg-[#141413] text-[#F7F6F2] px-4 py-3 text-xs font-medium flex items-center gap-3 shadow-lg border border-[#F7F6F2]/15"
        >
          <Check className="w-4 h-4 text-[#84B59F] shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setCartInitialStep('cart');
              setCartOpen(true);
            }}
            className="underline underline-offset-4 font-semibold ml-1 whitespace-nowrap"
          >
            Ver carrito
          </button>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="flex-1">
        {activeNav === 'home' && (
          <>
            {/* 1. HERO PRINCIPAL (80–85% de la pantalla inicial) */}
            <section className="relative min-h-[78vh] lg:min-h-[85vh] w-full bg-[#1C1C1B] overflow-hidden flex items-end">
              <div className="absolute inset-0">
                <ResilientImage
                  src={EDITORIAL_ASSETS.hero}
                  alt="Modelo usando Hoodie Heavyweight KÓDICE en galería arquitectónica"
                  eager
                  className="w-full h-full object-cover object-center"
                />
                {/* Scrim medido para garantizar legibilidad >= 4.5:1 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/15" />
              </div>

              <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-14 sm:py-20 lg:py-24">
                <div className="max-w-2xl space-y-5 text-[#F7F6F2]">
                  <p className="text-xs font-mono-tabular tracking-[0.18em] uppercase text-[#F7F6F2]/80">
                    {STORE_CONFIG.hero.kicker}
                  </p>

                  <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.02em] leading-[1.03] text-[#F7F6F2]">
                    {STORE_CONFIG.hero.title}
                  </h1>

                  <p className="text-base sm:text-lg text-[#F7F6F2]/90 max-w-xl leading-relaxed">
                    {STORE_CONFIG.hero.subtitle}
                  </p>

                  <div className="pt-3 flex flex-wrap items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => handleNavigate('hoodies', 'hoodies')}
                      className="px-7 py-4 bg-[#F7F6F2] text-[#141413] hover:bg-[#E5E0D8] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors inline-flex items-center gap-2.5 whitespace-nowrap"
                    >
                      <span>{STORE_CONFIG.hero.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href="#shop-the-look"
                      className="px-6 py-4 border border-[#F7F6F2]/40 text-[#F7F6F2] hover:bg-[#F7F6F2]/10 text-xs sm:text-sm font-medium tracking-wider uppercase transition-colors whitespace-nowrap"
                    >
                      {STORE_CONFIG.hero.secondaryCta}
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. SECCIÓN DE PRODUCTOS DESTACADOS ("THE LATEST" / "Nuestros favoritos") */}
            <section className="py-20 sm:py-28 max-w-[1440px] mx-auto px-4 sm:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                <div>
                  <p className="text-xs font-mono-tabular tracking-[0.16em] uppercase text-[#65635E] mb-2">
                    THE LATEST
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#141413]">
                    Nuestros favoritos
                  </h2>
                </div>

                {/* Controles interactivos para alternar entre los 4 favoritos o los 8 hoodies */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex p-1 bg-[#EFECE6] border border-[#141413]/10">
                    <button
                      type="button"
                      onClick={() => setShowAllHoodiesOnHome(true)}
                      className={`px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                        showAllHoodiesOnHome
                          ? 'bg-[#141413] text-[#F7F6F2]'
                          : 'text-[#65635E] hover:text-[#141413]'
                      }`}
                    >
                      Colección Hoodies (8)
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAllHoodiesOnHome(false)}
                      className={`px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                        !showAllHoodiesOnHome
                          ? 'bg-[#141413] text-[#F7F6F2]'
                          : 'text-[#65635E] hover:text-[#141413]'
                      }`}
                    >
                      Esenciales Top (4)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNavigate('shop', 'all')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#141413] hover:underline underline-offset-4 whitespace-nowrap"
                  >
                    <span>Ir a Tienda</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cuadrícula de 4 columnas en desktop, 2 en tablet y 2 en móvil */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
                {displayedHomeHoodies.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Acción natural hacia el catálogo completo */}
              <div className="mt-14 pt-8 border-t border-[#141413]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-[#65635E]">
                  Todas nuestras prendas son pre-encogidas y confeccionadas en
                  algodón de alto gramaje (460–560 GSM).
                </p>
                <button
                  type="button"
                  onClick={() => handleNavigate('shop', 'all')}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#141413] hover:underline underline-offset-4 whitespace-nowrap"
                >
                  <span>Explorar filtros y todas las categorías</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* 3. NUEVA COLECCIÓN ("NEW DROP" / "Collection 01") */}
            <section className="py-20 sm:py-28 border-t border-[#141413]/10 bg-[#EFECE6]">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-[0.16em] text-[#65635E]">
                      <span>{STORE_CONFIG.newDrop.tag}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeDrop.releaseDate}</span>
                    </div>

                    <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#141413]">
                      {activeDrop.title}
                    </h2>

                    <p className="text-sm sm:text-base text-[#383734] leading-relaxed">
                      {activeDrop.subtitle}
                    </p>

                    <p className="text-xs sm:text-sm text-[#65635E] leading-relaxed">
                      {activeDrop.description}
                    </p>

                    {/* Selector de Drops para escalar futuras colecciones sin cambiar la estructura */}
                    <div className="pt-2">
                      <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#65635E] mb-2">
                        SELECCIONAR ARCHIVO / DROP:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {COLLECTIONS.map((col, idx) => (
                          <button
                            key={col.id}
                            type="button"
                            onClick={() => setActiveDropIndex(idx)}
                            className={`px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                              activeDropIndex === idx
                                ? 'bg-[#141413] text-[#F7F6F2]'
                                : 'bg-[#F7F6F2] text-[#141413] hover:bg-[#E2DDD4]'
                            }`}
                          >
                            {col.code} · {col.id.split('—')[0].trim()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedCollectionFilter(activeDrop.id);
                          setActiveNav('shop');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-7 py-4 bg-[#141413] text-[#F7F6F2] hover:bg-[#2B2B29] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2.5 whitespace-nowrap"
                      >
                        <span>{STORE_CONFIG.newDrop.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="relative aspect-[16/10] bg-[#E2DDD4] overflow-hidden border border-[#141413]/10">
                      <ResilientImage
                        src={activeDrop.image}
                        alt={activeDrop.title}
                        className="w-full h-full object-cover object-center transition-all duration-300"
                      />
                      <div className="absolute bottom-4 left-4 bg-[#F7F6F2]/95 px-4 py-2 text-xs font-mono-tabular text-[#141413]">
                        {activeDrop.code} · {activeDrop.garmentCount} SILUETAS DISPONIBLES
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. SECCIÓN "SHOP THE LOOK" */}
            <ShopTheLook
              products={PRODUCTS}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
            />

            {/* 5. SECCIÓN DE IDENTIDAD DE MARCA ("MADE FOR THE EVERYDAY") */}
            <section
              ref={brandStoryRef}
              className="py-20 sm:py-28 border-t border-[#141413]/10 bg-[#F7F6F2]"
            >
              <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                  <div className="lg:col-span-6">
                    <div className="aspect-[4/3] bg-[#EFECE6] overflow-hidden border border-[#141413]/10">
                      <ResilientImage
                        src={EDITORIAL_ASSETS.craftsmanship}
                        alt="Taller de diseño y confección KÓDICE en Bogotá con textiles de alto gramaje"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-6">
                    <p className="text-xs font-mono-tabular tracking-[0.16em] uppercase text-[#65635E]">
                      {STORE_CONFIG.brandIdentity.kicker}
                    </p>

                    <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#141413]">
                      {STORE_CONFIG.brandIdentity.title}
                    </h2>

                    <p className="text-sm sm:text-base text-[#383734] leading-relaxed max-w-xl">
                      {STORE_CONFIG.brandIdentity.body}
                    </p>

                    {/* Métricas reales de construcción textil (Claim-to-Proof Adjacency) */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#141413]/10">
                      {STORE_CONFIG.brandIdentity.metrics.map((metric) => (
                        <div key={metric.label}>
                          <p className="font-mono-tabular text-sm sm:text-base font-semibold text-[#141413]">
                            {metric.value}
                          </p>
                          <p className="text-xs text-[#65635E] mt-0.5">
                            {metric.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Categorías futuras preparadas en la arquitectura */}
                    <div className="pt-4 border-t border-[#141413]/10">
                      <p className="text-xs text-[#65635E] mb-3">
                        Explora nuestras líneas activas y de expansión en la
                        tienda:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleNavigate('shop', cat.id)}
                            className="px-3 py-1.5 text-xs font-medium bg-[#EFECE6] text-[#141413] hover:bg-[#141413] hover:text-[#F7F6F2] transition-colors whitespace-nowrap"
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. NEWSLETTER ("STAY IN THE LOOP") */}
            <section className="py-20 sm:py-24 border-t border-[#141413]/10 bg-[#EFECE6]/40">
              <div className="max-w-2xl mx-auto px-4 sm:px-8 text-center space-y-4">
                <p className="text-xs font-mono-tabular tracking-[0.16em] uppercase text-[#65635E]">
                  COMUNIDAD & EARLY ACCESS
                </p>
                <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#141413]">
                  STAY IN THE LOOP
                </h2>
                <p className="text-sm text-[#65635E] max-w-md mx-auto">
                  Recibe información sobre nuevos drops, colecciones y
                  lanzamientos antes de que salgan al público general.
                </p>

                {newsletterSubscribed ? (
                  <div className="mt-6 p-4 bg-[#EFECE6] border border-[#141413]/15 inline-flex items-center gap-2 text-xs font-medium text-[#141413]">
                    <Check className="w-4 h-4 text-[#1F3A2E]" />
                    <span>
                      Suscripción confirmada. Tendrás acceso anticipado al
                      próximo Drop.
                    </span>
                  </div>
                ) : (
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2"
                  >
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Tu correo electrónico"
                      aria-label="Tu correo electrónico"
                      className="flex-1 px-4 py-3.5 text-xs sm:text-sm bg-white border border-[#141413]/20 text-[#141413] placeholder:text-[#65635E] focus:outline-none focus:border-[#141413]"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3.5 bg-[#141413] text-[#F7F6F2] hover:bg-[#2B2B29] text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
                    >
                      Suscribirme
                    </button>
                  </form>
                )}
              </div>
            </section>
          </>
        )}

        {/* PÁGINA /TIENDA, /HOODIES, /NUEVOS */}
        {(activeNav === 'shop' ||
          activeNav === 'hoodies' ||
          activeNav === 'new') && (
          <ShopCatalog
            products={PRODUCTS}
            selectedCategory={selectedCategory}
            selectedCollectionFilter={selectedCollectionFilter}
            onlyNew={activeNav === 'new'}
            onChangeCategory={(cat) => {
              setSelectedCategory(cat);
              if (activeNav === 'new') setActiveNav('shop');
            }}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* PÁGINA /COLECCIONES */}
        {activeNav === 'collections' && (
          <section className="py-12 sm:py-20 max-w-[1440px] mx-auto px-4 sm:px-8 space-y-16">
            <div className="border-b border-[#141413]/10 pb-8">
              <p className="text-xs font-mono-tabular uppercase tracking-[0.16em] text-[#65635E] mb-2">
                ARCHIVO DE CÁPSULAS Y LANZAMIENTOS
              </p>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#141413]">
                COLECCIONES & DROPS
              </h1>
              <p className="text-sm sm:text-base text-[#65635E] mt-2 max-w-2xl">
                Cada lanzamiento explora un estudio de proporciones, teñidos
                minerales y gramajes diseñados para convivir entre sí.
              </p>
            </div>

            <div className="space-y-16">
              {COLLECTIONS.map((col) => {
                const colProducts = PRODUCTS.filter(
                  (p) => p.collection === col.id
                );
                return (
                  <div
                    key={col.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-16 border-b border-[#141413]/10"
                  >
                    <div className="lg:col-span-4 space-y-4">
                      <span className="text-xs font-mono-tabular text-[#65635E]">
                        {col.code} · {col.releaseDate}
                      </span>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#141413]">
                        {col.title}
                      </h2>
                      <p className="text-sm text-[#383734] leading-relaxed">
                        {col.subtitle}
                      </p>
                      <p className="text-xs text-[#65635E] leading-relaxed">
                        {col.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedCollectionFilter(col.id);
                          setActiveNav('shop');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="mt-2 px-5 py-3 bg-[#141413] text-[#F7F6F2] text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2"
                      >
                        <span>Filtrar esta colección</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                      {colProducts.slice(0, 3).map((prod) => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          onSelectProduct={handleSelectProduct}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* PÁGINA INDIVIDUAL DE PRODUCTO (PDP) */}
        {activeNav === 'product' && activeProduct && (
          <ProductDetailView
            product={activeProduct}
            initialColorId={activeProductColorId}
            allProducts={PRODUCTS}
            onBack={() => handleNavigate('shop', selectedCategory)}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}
      </main>

      {/* Footer minimalista con 4 columnas + métodos de pago */}
      <Footer
        onNavigate={handleNavigate}
        onOpenInfoModal={(modal) => setInfoModal(modal)}
        onScrollToBrand={() => {
          if (activeNav !== 'home') {
            setActiveNav('home');
            window.setTimeout(() => {
              brandStoryRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            brandStoryRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Carrito lateral y Checkout */}
      <CartDrawer
        isOpen={cartOpen}
        items={cartItems}
        initialStep={cartInitialStep}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCompleteOrder={handleCompleteOrder}
        onExploreShop={() => handleNavigate('hoodies', 'hoodies')}
      />

      {/* Modales informativos y de cuenta */}
      <InfoModal
        modalType={infoModal}
        orders={orders}
        onClose={() => setInfoModal(null)}
      />
    </div>
  );
}
