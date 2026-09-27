import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { InfoModalType } from './Footer';
import { ConfirmedOrder } from './CartDrawer';
import { formatCOP } from '../data/catalog';

interface InfoModalProps {
  modalType: InfoModalType;
  orders: ConfirmedOrder[];
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  modalType,
  orders,
  onClose,
}) => {
  const [contactSent, setContactSent] = useState(false);

  if (!modalType) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F7F6F2] border border-[#141413]/15 max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8"
      >
        <div className="flex items-center justify-between border-b border-[#141413]/10 pb-4 mb-6">
          <h3 className="font-display text-xl font-bold text-[#141413]">
            {modalType === 'account' && 'MI CUENTA Y PEDIDOS'}
            {modalType === 'contact' && 'CONTACTO Y SHOWROOM'}
            {modalType === 'shipping' && 'POLÍTICA DE ENVÍOS EN COLOMBIA'}
            {modalType === 'returns' && 'CAMBIOS Y DEVOLUCIONES'}
            {modalType === 'faq' && 'PREGUNTAS FRECUENTES'}
            {modalType === 'size_guide' && 'GUÍA DE TALLAS Y MEDIDAS'}
            {modalType === 'about' && 'NUESTRA HISTORIA'}
            {modalType === 'terms' && 'TÉRMINOS Y CONDICIONES'}
            {modalType === 'privacy' && 'POLÍTICA DE PRIVACIDAD'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#65635E] hover:text-[#141413]"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs sm:text-sm text-[#383734] leading-relaxed space-y-4">
          {modalType === 'account' && (
            <div className="space-y-4">
              <p className="text-[#65635E]">
                Consulta el estado de tus pedidos recientes realizados en esta
                sesión o gestiona tus preferencias de entrega en Colombia.
              </p>
              {orders.length === 0 ? (
                <div className="p-6 bg-[#EFECE6] text-center">
                  <p className="font-semibold text-[#141413]">
                    Aún no tienes pedidos registrados en esta sesión
                  </p>
                  <p className="text-xs text-[#65635E] mt-1">
                    Cuando completes una compra desde el carrito, tu orden y
                    código de rastreo aparecerán aquí.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.orderNumber}
                      className="p-4 bg-[#EFECE6] border border-[#141413]/10 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tabular font-semibold text-[#141413]">
                          Orden #{ord.orderNumber}
                        </span>
                        <span className="text-xs text-[#1F3A2E] font-medium">
                          En preparación · {ord.date}
                        </span>
                      </div>
                      <p className="text-xs text-[#65635E]">
                        {ord.customerName} · {ord.address}, {ord.city}
                      </p>
                      <p className="text-xs font-mono-tabular font-medium text-[#141413]">
                        Total: {formatCOP(ord.total)} ({ord.items.length}{' '}
                        prendas)
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {modalType === 'contact' && (
            <div className="space-y-4">
              <p>
                Nuestro equipo de atención al cliente y estilismo está
                disponible de lunes a sábado de 9:00 a.m. a 7:00 p.m.
              </p>
              <div className="p-4 bg-[#EFECE6] space-y-1 text-xs">
                <p>
                  <strong>Showroom Bogotá:</strong> Calle 81 # 11-40, Zona T
                  (Cita previa)
                </p>
                <p>
                  <strong>Correo:</strong> studio@kodice.co
                </p>
                <p>
                  <strong>WhatsApp Atención:</strong> +57 (300) 842-9100
                </p>
              </div>
              {contactSent ? (
                <div className="p-4 bg-[#1F3A2E] text-[#F7F6F2] text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>
                    Mensaje recibido. Te responderemos en menos de 2 horas
                    hábiles.
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSent(true);
                  }}
                  className="space-y-3 pt-2"
                >
                  <input
                    type="email"
                    required
                    placeholder="Tu correo electrónico"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#141413]/20 text-xs focus:outline-none focus:border-[#141413]"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="¿En qué podemos ayudarte? (Tallas, envíos, pedidos mayoristas...)"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#141413]/20 text-xs focus:outline-none focus:border-[#141413]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#141413] text-[#F7F6F2] text-xs font-semibold uppercase tracking-wider"
                  >
                    Enviar mensaje
                  </button>
                </form>
              )}
            </div>
          )}

          {modalType === 'shipping' && (
            <div className="space-y-3">
              <p>
                Despachamos todos los pedidos desde nuestro centro logístico en
                Bogotá con transportadoras aliadas certificadas.
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  · <strong>Bogotá y Sabana:</strong> 1 a 2 días hábiles.
                </li>
                <li>
                  · <strong>Medellín, Cali, Barranquilla, Bucaramanga, Eje Cafetero:</strong>{' '}
                  2 a 3 días hábiles.
                </li>
                <li>
                  · <strong>Resto del país:</strong> 3 a 5 días hábiles.
                </li>
                <li>
                  · <strong>Envío gratuito:</strong> En todas las compras
                  iguales o superiores a $250.000 COP.
                </li>
              </ul>
            </div>
          )}

          {modalType === 'returns' && (
            <div className="space-y-3">
              <p>
                Queremos que la caída y el ajuste de tu prenda sean exactos. Si
                necesitas otra talla o color:
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  · Cuentas con <strong>30 días calendario</strong> para
                  solicitar cambios de talla o prenda.
                </li>
                <li>
                  · El primer cambio de talla tiene recolección y reenvío sin
                  costo en ciudades principales.
                </li>
                <li>
                  · La prenda debe estar sin usar, sin lavar y con su empaque y
                  etiquetas originales intactas.
                </li>
              </ul>
            </div>
          )}

          {modalType === 'faq' && (
            <div className="space-y-4 text-xs">
              <div>
                <p className="font-semibold text-[#141413]">
                  ¿Encogen los hoodies de 500 GSM al lavarse?
                </p>
                <p className="text-[#65635E] mt-1">
                  No. Nuestro tejido French Terry pasa por un proceso de
                  pre-encogido y lavado enzimático antes de la confección.
                  Recomendamos lavar en agua fría y secar a la sombra.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#141413]">
                  ¿Tienen pago contraentrega?
                </p>
                <p className="text-[#65635E] mt-1">
                  Sí, ofrecemos pago contraentrega en Bogotá, Medellín, Cali,
                  Barranquilla y Bucaramanga, además de PSE, Nequi y tarjetas.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#141413]">
                  ¿Cuándo lanzan nuevas categorías además de hoodies?
                </p>
                <p className="text-[#65635E] mt-1">
                  Nuestra arquitectura de colección incorpora progresivamente
                  camisetas de 280 GSM, pantalones cargo, calzado y accesorios,
                  que ya puedes explorar en la sección Tienda y Shop the Look.
                </p>
              </div>
            </div>
          )}

          {modalType === 'size_guide' && (
            <div className="space-y-3">
              <p>
                Nuestros hoodies manejan silueta <strong>Boxy / Oversized</strong>{' '}
                con hombros caídos. Pide tu talla habitual para el fit de
                estudio:
              </p>
              <div className="p-4 bg-[#EFECE6] font-mono-tabular text-xs space-y-1.5">
                <p>Talla S · Pecho 58 cm · Largo 66 cm (1.60m – 1.71m)</p>
                <p>Talla M · Pecho 61 cm · Largo 69 cm (1.72m – 1.78m)</p>
                <p>Talla L · Pecho 64 cm · Largo 72 cm (1.79m – 1.85m)</p>
                <p>Talla XL · Pecho 67 cm · Largo 75 cm (1.86m+)</p>
              </div>
            </div>
          )}

          {(modalType === 'about' ||
            modalType === 'terms' ||
            modalType === 'privacy') && (
            <div className="space-y-3">
              <p>
                <strong>KÓDICE STUDIO</strong> nació en Bogotá con una premisa
                clara: elevar el estándar del streetwear cotidiano mediante
                textiles densos, patronaje arquitectónico y producción local
                ética.
              </p>
              <p>
                Operamos bajo la normativa colombiana de comercio electrónico
                (Ley 1480 de 2011 — Estatuto del Consumidor) y garantizamos la
                protección de datos personales (Ley 1581 de 2012).
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#141413]/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#141413] text-[#F7F6F2] text-xs font-semibold uppercase tracking-wider"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
