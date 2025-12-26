import { Link } from 'react-router-dom';
import rmsLogo from '@/assets/rms-logo.jpg';

interface HeaderLogoProps {
  isScrolledDown: boolean;
}

export const HeaderLogo = ({ isScrolledDown }: HeaderLogoProps) => {
  return (
    <div className="flex items-center">
      <Link to="/">
        <img 
          src={rmsLogo}
          alt="Riders Moto Shop" 
          className={`h-auto transition-all duration-300 ease-in-out cursor-pointer hover:opacity-80 ${
            isScrolledDown ? 'max-h-14' : 'max-h-20'
          }`}
        />
      </Link>
    </div>
  );
};

