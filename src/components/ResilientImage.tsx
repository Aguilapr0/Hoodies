import React, { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  eager?: boolean;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  style,
  eager = false,
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EAE6DF] text-[#5C5A54] p-6 text-center select-none ${className}`}
        style={style}
        role="img"
        aria-label={alt}
      >
        <div className="w-10 h-10 border border-[#141413]/20 flex items-center justify-center mb-2 text-xs font-mono-tabular tracking-widest">
          KDC
        </div>
        <span className="text-xs font-medium tracking-wide uppercase text-[#141413]/75 max-w-[18ch] truncate">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setHasError(true)}
      className={className}
      style={style}
    />
  );
};
