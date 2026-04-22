import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

export interface PageHeroBreadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  heroImage?: string;
  breadcrumbs?: PageHeroBreadcrumb[];
  children?: ReactNode;
}

export default function PageHero({
  title,
  subtitle,
  icon,
  heroImage,
  breadcrumbs,
  children,
}: PageHeroProps) {
  return (
    <section className="relative py-10 sm:py-14 md:py-16 overflow-hidden">
      {heroImage ? (
        <>
          <Image
            src={heroImage}
            alt=""
            fill
            className="object-cover"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-gray-900/80" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-gray-900" />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm mb-4 text-blue-100">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <span key={i} className="flex items-center space-x-2">
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className="hover:text-white">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'text-white font-semibold' : ''}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <span className="text-blue-200/60">/</span>}
                </span>
              );
            })}
          </nav>
        )}

        <div className="flex items-start gap-4 sm:gap-6">
          {icon && <div className="text-4xl sm:text-5xl">{icon}</div>}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base sm:text-lg text-blue-100">{subtitle}</p>
            )}
          </div>
        </div>

        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
