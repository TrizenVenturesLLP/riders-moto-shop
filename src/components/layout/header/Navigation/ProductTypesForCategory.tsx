import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useProductTypesByCategory, convertToProductTypeOption } from "@/hooks/useProductTypes";

interface ProductTypesForCategoryProps {
  category: { name: string; slug: string };
  bikeSlug: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ProductTypesForCategory = ({
  category,
  bikeSlug,
  isExpanded,
  onToggle,
}: ProductTypesForCategoryProps) => {
  const { data: productTypesData, isLoading } = useProductTypesByCategory(category.slug, false);
  const apiProductTypes = productTypesData?.data?.productTypes || [];
  const productTypes = apiProductTypes
    .filter(pt => pt.isActive)
    .map(convertToProductTypeOption);

  const displayCount = isExpanded ? productTypes.length : 3;
  const hasMore = productTypes.length > 3;

  if (isLoading) {
    return (
      <div className="p-3 border border-border rounded-lg">
        <div className="font-semibold text-sm text-primary mb-2">{category.name}</div>
        <div className="text-xs text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="group/category p-3 border border-border rounded-lg">
      <Link
        to={`/collections/bikes/${bikeSlug}?category=${category.slug}`}
        className="block font-semibold text-sm text-primary hover:text-primary/80 transition-colors mb-2"
      >
        {category.name}
      </Link>
      {productTypes.length > 0 && (
        <div className="space-y-1">
          {productTypes.slice(0, displayCount).map((productType) => (
            <Link
              key={productType.slug}
              to={`/collections/bikes/${bikeSlug}?category=${category.slug}&productType=${productType.slug}`}
              className="block text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              • {productType.name || productType.label}
            </Link>
          ))}
          {hasMore && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors w-full text-left"
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="h-3 w-3 rotate-180 transition-transform" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 transition-transform" />
                  + {productTypes.length - 3} more
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

