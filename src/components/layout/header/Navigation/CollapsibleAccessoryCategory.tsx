import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { NavbarItem } from '@/types/navbar';

interface CollapsibleAccessoryCategoryProps {
  title: string;
  accessories: NavbarItem[];
}

export const CollapsibleAccessoryCategory = ({ title, accessories }: CollapsibleAccessoryCategoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAccessoryClick = (accessory: NavbarItem) => {
    if (accessory.link) {
      navigate(accessory.link);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left py-2 px-2 bg-muted rounded-lg hover:bg-accent transition-colors"
      >
        <h5 className="font-medium text-foreground">{title}</h5>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="mt-2 pl-3 space-y-1">
          {accessories.map((accessory, accIndex: number) => (
            <div key={accIndex}>
              {accessory.link ? (
                <button
                  onClick={() => handleAccessoryClick(accessory)}
                  className="block w-full text-left py-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {accessory.title}
                </button>
              ) : (
                <div className="py-1 text-xs text-muted-foreground/60">
                  {accessory.title}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


