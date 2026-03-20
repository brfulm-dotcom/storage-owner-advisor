import Link from 'next/link';
import { Category } from '@/data/categories';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="h-full p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        {/* Icon */}
        <div className="text-4xl mb-4">{category.icon}</div>

        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>

        {/* Description - Truncated */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {category.description}
        </p>

        {/* Vendor Count */}
        <div className="text-sm font-medium text-blue-600">
          {category.vendorCount || 0} vendors
        </div>
      </div>
    </Link>
  );
}
