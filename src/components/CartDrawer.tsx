import React, { useState } from 'react';
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  Product,
  SizeCode,
  STORE_CONFIG,
  formatCOP,
} from '../data/catalog';
import { ResilientImage } from './ResilientImage';

export interface CartItem {
  key: string;
  product: Product;
  colorId: string;
  colorName: string;
  image: string;
  size: SizeCode;
  quantity: number;
}

export interface ConfirmedOrder {
  orderNumber: string;
  date: string;
  customerName: string;
  city: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  initialStep?: 'cart' | 'checkout';
  onClose: () => void;
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onCompleteOrder: (order: ConfirmedOrder) => void;
  onExploreShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  initialStep = 'cart',
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCompleteOrder,
  onExploreShop,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>(
    initialStep
  );
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bogotá D.C.');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'pse' | 'card' | 'cod'
  >('pse');
  const [lastOrder, setLastOrder] = useState<ConfirmedOrder | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
    }
  }, [isOpen, initialStep]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const qualifiesFreeShipping = subtotal >= STORE_CONFIG.freeShippingThreshold;
  const shipping =
    items.length === 0
      ? 0
      : qualifiesFreeShipping
      ? 0
      : STORE_CONFIG.standardShippingCost;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(
    0,
    STORE_CONFIG.freeShippingThreshold - subtotal
  );
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / STORE_CONFIG.freeShippingThreshold) * 100)
  );

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !address.trim()) return;

    const order: ConfirmedOrder = {
      orderNumber: `KDC-${Math.floor(1040 + Math.random() * 8900)}`,
      date: new Date().toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      customerName: customerName.trim(),
      city,
      address: address.trim(),
      paymentMethod:
        paymentMethod === 'pse'
          ? 'PSE / Nequi / Bancolombia'
          : paymentMethod === 'card'
          ? 'Tarjeta de Crédito / Débito'
          : 'Pago Contraentrega (Efectivo / Datafono)',
      items: [...items],
      subtotal,
      shipping,
      total,
    };

    setLastOrder(order);
    onCompleteOrder(order);
    setStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs">
      <div
        onClick={onClose}
        className="flex-1"
        aria-hidden="true"
      />

      <aside
        aria-label="Carrito de compras"
        className="w-full max-w-md bg-[#F7F6F2] h-full flex flex-col justify-between border-l border-[#141413]/15 shadow-2xl overflow-hidden"
      >
        {/* Cabecera del carrito */}
        <div className="px-6 py-5 border-b border-[#141413]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#141413]" />
            <h2 className="font-display text-lg font-bold tracking-tight text-[#141413]">
              {step === 'cart'
                ? 'TU CARRITO'
                : step === 'checkout'
                ? 'FINALIZAR COMPRA'
                : 'PEDIDO CONFIRMADO'}
            </h2>
            {step === 'cart' && (
              <span className="text-xs font-mono-tabular text-[#65635E]">
                ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#65635E] hover:text-[#141413] transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progreso para envío gratis */}
        {step === 'cart' && items.length > 0 && (
          <div className="px-6 py-3 bg-[#EFECE6] border-b border-[#141413]/10">
            <p className="text-xs text-[#141413]">
              {qualifiesFreeShipping ? (
                <span className="font-medium">
                  ✓ Tu pedido tiene envío nacional gratuito incluido
                </span>
              ) : (
                <span>
                  Te faltan{' '}
                  <strong className="font-mono-tabular">
                    {formatCOP(remainingForFreeShipping)}
                  </strong>{' '}
                  para envío gratis
                </span>
              )}
            </p>
            <div className="w-full h-1 bg-[#141413]/10 mt-2 overflow-hidden">
              <div
                className="h-full bg-[#141413] transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Contenido dinámico: Lista de productos, Formulario Checkout o Confirmación */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <ShoppingBag className="w-10 h-10 text-[#65635E]/50 mb-4 stroke-[1.25]" />
                  <p className="font-display text-lg font-bold text-[#141413]">
                    Tu carrito está vacío
                  </p>
                  <p className="text-xs text-[#65635E] mt-1.5 max-w-xs">
                    Explora nuestra colección de hoodies heavyweight y prendas
                    esenciales diseñadas para todos los días.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onExploreShop();
                    }}
                    className="mt-6 px-6 py-3 bg-[#141413] text-[#F7F6F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#2B2B29] transition-colors"
                  >
                    Descubrir colección
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#141413]/10">
                  {items.map((item) => (
                    <div key={item.key} className="py-4 flex gap-4">
                      <div className="w-20 h-24 bg-[#EFECE6] shrink-0 overflow-hidden border border-[#141413]/10">
                        <ResilientImage
                          src={item.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[11px] text-[#65635E]">
                                {item.product.categoryLabel}
                              </p>
                              <h3 className="text-xs sm:text-sm font-semibold text-[#141413] truncate">
                                {item.product.name}
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.key)}
                              className="text-[#65635E] hover:text-[#141413] p-1"
                              aria-label={`Eliminar ${item.product.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-xs text-[#65635E] mt-1">
                            Color: <span className="text-[#141413]">{item.colorName}</span>{' '}
                            · Talla:{' '}
                            <span className="font-mono-tabular text-[#141413]">
                              {item.size}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="inline-flex items-center border border-[#141413]/20 bg-[#F7F6F2]">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.key, -1)}
                              className="w-7 h-7 flex items-center justify-center text-[#141413] hover:bg-[#EFECE6]"
                              aria-label="Restar unidad"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-mono-tabular">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.key, 1)}
                              className="w-7 h-7 flex items-center justify-center text-[#141413] hover:bg-[#EFECE6]"
                              aria-label="Sumar unidad"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <p className="text-xs sm:text-sm font-mono-tabular font-semibold text-[#141413]">
                            {formatCOP(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form
              id="checkout-form"
              onSubmit={handleCheckoutSubmit}
              className="space-y-4"
            >
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="text-xs font-medium text-[#65635E] hover:text-[#141413] underline underline-offset-4 mb-1"
              >
                ← Volver al resumen del carrito
              </button>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#141413] mb-1.5">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Mateo Restrepo"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#141413]/20 focus:outline-none focus:border-[#141413]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#141413] mb-1.5">
                    Celular / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="300 000 0000"
                    className="w-full px-3.5 py-2.5 text-sm font-mono-tabular bg-white border border-[#141413]/20 focus:outline-none focus:border-[#141413]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#141413] mb-1.5">
                    Ciudad *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#141413]/20 focus:outline-none focus:border-[#141413]"
                  >
                    <option value="Bogotá D.C.">Bogotá D.C.</option>
                    <option value="Medellín">Medellín</option>
                    <option value="Cali">Cali</option>
                    <option value="Barranquilla">Barranquilla</option>
                    <option value="Bucaramanga">Bucaramanga</option>
                    <option value="Pereira">Pereira</option>
                    <option value="Cartagena">Cartagena</option>
                    <option value="Otra ciudad (Colombia)">Otra ciudad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#141413] mb-1.5">
                  Dirección de entrega y apto *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Cra 11 # 82-01, Apto 502"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#141413]/20 focus:outline-none focus:border-[#141413]"
                />
              </div>

              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#141413] mb-2">
                  Método de pago
                </p>
                <div className="space-y-2">
                  {[
                    {
                      id: 'pse',
                      title: 'PSE / Nequi / Bancolombia',
                      desc: 'Transferencia bancaria inmediata sin recargo',
                    },
                    {
                      id: 'card',
                      title: 'Tarjeta de Crédito o Débito',
                      desc: 'Visa, Mastercard, American Express hasta 12 cuotas',
                    },
                    {
                      id: 'cod',
                      title: 'Pago Contraentrega (COD)',
                      desc: 'Paga al recibir en tu dirección en ciudades principales',
                    },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? 'border-[#141413] bg-[#EFECE6]'
                          : 'border-[#141413]/15 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === method.id}
                        onChange={() =>
                          setPaymentMethod(method.id as typeof paymentMethod)
                        }
                        className="mt-1 accent-[#141413]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-[#141413]">
                          {method.title}
                        </p>
                        <p className="text-[11px] text-[#65635E]">
                          {method.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          )}

          {step === 'confirmed' && lastOrder && (
            <div className="py-6 space-y-6">
              <div className="p-5 bg-[#EFECE6] border border-[#141413]/15">
                <div className="flex items-center gap-2.5 text-[#1F3A2E] mb-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-mono-tabular uppercase tracking-wider font-semibold">
                    ORDEN #{lastOrder.orderNumber} CONFIRMADA
                  </span>
                </div>
                <p className="font-display text-lg font-bold text-[#141413]">
                  Gracias por tu compra, {lastOrder.customerName}
                </p>
                <p className="text-xs text-[#65635E] mt-1">
                  Estamos preparando tus prendas en nuestro taller de Bogotá.
                  Recibirás guía de rastreo por WhatsApp.
                </p>
              </div>

              <div className="space-y-2 text-xs border-b border-[#141413]/10 pb-4">
                <div className="flex justify-between">
                  <span className="text-[#65635E]">Destino:</span>
                  <span className="font-medium text-[#141413]">
                    {lastOrder.address}, {lastOrder.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#65635E]">Método de pago:</span>
                  <span className="font-medium text-[#141413]">
                    {lastOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#65635E]">Total pagado:</span>
                  <span className="font-mono-tabular font-semibold text-[#141413]">
                    {formatCOP(lastOrder.total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 bg-[#141413] text-[#F7F6F2] text-xs font-semibold uppercase tracking-wider"
              >
                Continuar explorando KÓDICE
              </button>
            </div>
          )}
        </div>

        {/* Resumen inferior de costos y CTA */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="px-6 py-5 bg-[#EFECE6] border-t border-[#141413]/15 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#65635E]">
                <span>Subtotal</span>
                <span className="font-mono-tabular text-[#141413]">
                  {formatCOP(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[#65635E]">
                <span>Envío nacional</span>
                <span className="font-mono-tabular text-[#141413]">
                  {shipping === 0 ? 'GRATIS' : formatCOP(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#141413] pt-2 border-t border-[#141413]/10">
                <span>Total</span>
                <span className="font-mono-tabular">{formatCOP(total)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 bg-[#141413] text-[#F7F6F2] hover:bg-[#2B2B29] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>FINALIZAR COMPRA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3.5 bg-[#141413] text-[#F7F6F2] hover:bg-[#2B2B29] text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                CONFIRMAR PEDIDO · {formatCOP(total)}
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
};
