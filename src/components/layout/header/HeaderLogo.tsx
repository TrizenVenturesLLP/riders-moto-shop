import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import rmsLogo from '@/assets/rms-logo.jpg';
import rmsLogoDark from '@/assets/rms-logo-dark.png';

interface HeaderLogoProps {
  isScrolledDown: boolean;
}

export const HeaderLogo = ({ isScrolledDown }: HeaderLogoProps) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');
  
  return (
    <div className="flex items-center">
      <Link to="/">
        <img 
          src={isDark ? rmsLogoDark : rmsLogo}
          alt="Riders Moto Shop" 
          className={`h-auto transition-all duration-300 ease-in-out cursor-pointer hover:opacity-80 ${
            isScrolledDown ? 'max-h-14' : 'max-h-20'
          }`}
        />
      </Link>
    </div>
  );
};


