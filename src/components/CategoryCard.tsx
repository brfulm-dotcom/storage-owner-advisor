import Link from 'next/link';
import { Category } from '@/lib/supabase';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer h-full">
        <div className="text-4xl mb-3">{category.icon}</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {category.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {category.description}
        </p>
        <span className="text-xs font-semibold text-blue-600">
          {category.vendor_count} vendors →
        </span>
      </div>
    </Link>
  );
}
