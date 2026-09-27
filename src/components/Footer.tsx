import React from 'react';
import { CategoryId } from '../data/catalog';
import { NavSection } from './Header';

export type InfoModalType =
  | null
  | 'contact'
  | 'shipping'
  | 'returns'
  | 'faq'
  | 'size_guide'
  | 'about'
  | 'terms'
  | 'privacy'
  | 'account';

interface FooterProps {
  onNavigate: (section: NavSection, category?: CategoryId) => void;
  onOpenInfoModal: (modal: Exclude<InfoModalType, null>) => void;
  onScrollToBrand: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenInfoModal,
  onScrollToBrand,
}) => {
  return (
    <footer className="bg-[#EFECE6] border-t border-[#141413]/10 text-[#141413]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 pb-16 border-b border-[#141413]/10">
          {/* Columna de identidad de marca */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <span className="font-display text-2xl font-bold tracking-[-0.03em] text-[#141413] block">
              KÓDICE
            </span>
            <p className="text-xs sm:text-sm text-[#65635E] max-w-xs leading-relaxed">
              Moda urbana contemporánea y esenciales de alto gramaje diseñados
              en Colombia. Siluetas pensadas para perdurar más allá de las
              temporadas.
            </p>
            <p className="text-xs font-mono-tabular text-[#65635E]">
              BOGOTÁ · MEDELLÍN · CALI · ENVÍOS A TODO EL PAÍS
            </p>
          </div>

          {/* Columna 1: SHOP */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#141413]">
              SHOP
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#65635E]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('hoodies', 'hoodies')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Hoodies
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('new')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Nuevos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('collections')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Colecciones
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('shop', 'all')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Todos los productos
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 2: AYUDA */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#141413]">
              AYUDA
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#65635E]">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('contact')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Contacto
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('shipping')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Envíos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('returns')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Cambios y devoluciones
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('faq')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Preguntas frecuentes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('size_guide')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Guía de tallas
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 3: MARCA */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#141413]">
              MARCA
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#65635E]">
              <li>
                <button
                  type="button"
                  onClick={onScrollToBrand}
                  className="hover:text-[#141413] transition-colors"
                >
                  Nosotros
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('about')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Nuestra historia
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('contact')}
                  className="hover:text-[#141413] transition-colors"
                >
                  Instagram (@kodice.co)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('contact')}
                  className="hover:text-[#141413] transition-colors"
                >
                  TikTok (@kodice.studio)
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 4: LEGAL */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#141413]">
              LEGAL
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#65635E]">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('terms')}
                  className="hover:text-[#141413] transition-colors text-left"
                >
                  Términos y condiciones
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('privacy')}
                  className="hover:text-[#141413] transition-colors text-left"
                >
                  Política de privacidad
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenInfoModal('returns')}
                  className="hover:text-[#141413] transition-colors text-left"
                >
                  Política de cambios
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Métodos de pago y derechos de autor */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#65635E]">
          <p>
            © {new Date().getFullYear()} KÓDICE STUDIO COLOMBIA S.A.S. Todos los
            derechos reservados. Precios en Pesos Colombianos (COP).
          </p>

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 font-mono-tabular text-[11px] text-[#141413]/80">
            <span>PSE</span>
            <span aria-hidden="true">·</span>
            <span>NEQUI</span>
            <span aria-hidden="true">·</span>
            <span>BANCOLOMBIA</span>
            <span aria-hidden="true">·</span>
            <span>VISA</span>
            <span aria-hidden="true">·</span>
            <span>MASTERCARD</span>
            <span aria-hidden="true">·</span>
            <span>CONTRAENTREGA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
