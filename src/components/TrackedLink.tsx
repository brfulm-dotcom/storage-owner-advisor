'use client';

// =============================================================
// TRACKED LINK
// A link that logs a click to the vendor_clicks table before
// navigating. Used on vendor detail pages and anywhere we need
// click tracking on a server component page.
// =============================================================

interface TrackedLinkProps {
  href: string;
  vendorSlug: string;
  vendorName: string;
  clickType?: string;
  className?: string;
  children: React.ReactNode;
}

export default function TrackedLink({
  href,
  vendorSlug,
  vendorName,
  clickType = 'website',
  className,
  children,
}: TrackedLinkProps) {
  const handleClick = () => {
    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendor_slug: vendorSlug,
        vendor_name: vendorName,
        click_type: clickType,
      }),
    }).catch(() => {});
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
