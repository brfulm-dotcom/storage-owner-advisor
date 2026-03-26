import Link from 'next/link';
import { Category } from '@/lib/supabase';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer h-full">
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">{category.icon}</div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 leading-tight">
              {category.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {category.description}
            </p>
            <span className="text-xs font-semibold text-blue-600 mt-1 inline-block">
              {category.vendor_count} vendors →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
