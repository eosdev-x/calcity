import React from 'react';
import cityLogo from '../assets/city-seal.png';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <img
      src={cityLogo}
      alt="California City Seal"
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      style={{ objectFit: 'contain' }}
    />
  );
};
