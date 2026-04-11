import { supabase, isSupabaseReady } from '@/lib/supabase';

interface Review {
  id: number;
  rating: number;
  title: string | null;
  review_text: string;
  reviewer_name: string;
  reviewer_title: string | null;
  source: string;
  created_at: string;
}

async function getApprovedReviews(vendorSlug: string): Promise<Review[]> {
  if (!isSupabaseReady()) return [];
  const { data, error } = await supabase
    .from('vendor_reviews')
    .select('id, rating, title, review_text, reviewer_name, reviewer_title, source, created_at')
    .eq('vendor_slug', vendorSlug)
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  return data || [];
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function sourceLabel(source: string): string {
  if (source === 'google') return 'Google';
  if (source === 'imported') return 'Imported';
  return 'Verified Operator';
}

interface VendorReviewsProps {
  vendorSlug: string;
  vendorName: string;
  currentRating: number;
  reviewCount: number;
  siteRating?: number;
  siteReviewCount?: number;
}

export default async function VendorReviews({
  vendorSlug,
  vendorName,
  currentRating,
  reviewCount,
  siteRating,
  siteReviewCount,
}: VendorReviewsProps) {
  const reviews = await getApprovedReviews(vendorSlug);

  // Rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { star, count, pct };
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-5">
        Operator Reviews
        {reviews.length > 0 && (
          <span className="ml-2 text-base font-normal text-gray-500">
            ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
          </span>
        )}
      </h2>

      {/* Rating summary */}
      {reviews.length > 0 ? (
        <div className="flex gap-6 mb-6 pb-6 border-b border-gray-100">
          {/* Big average — show site rating from user reviews */}
          <div className="flex flex-col items-center justify-center min-w-[80px]">
            <span className="text-4xl font-bold text-gray-900">{(siteRating ?? currentRating).toFixed(1)}</span>
            <div className="flex gap-0.5 my-1">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={`text-sm ${s <= Math.round(siteRating ?? currentRating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
              ))}
            </div>
            <span className="text-xs text-gray-500">{siteReviewCount ?? reviewCount} user reviews</span>
          </div>

          {/* Bar breakdown */}
          <div className="flex-1 space-y-1.5">
            {ratingBreakdown.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 w-4 text-right">{star}</span>
                <span className="text-yellow-400 text-xs">★</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-gray-400 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-500 text-sm mb-1">No operator reviews yet.</p>
          <p className="text-gray-400 text-xs">Be the first to share your experience with {vendorName}.</p>
        </div>
      )}

      {/* Industry reputation note (shows until we have real reviews) */}
      {reviews.length === 0 && reviewCount > 0 && (
        <div className="mb-5 flex items-start gap-2 text-xs text-gray-400 bg-blue-50 rounded-lg px-3 py-2.5">
          <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            The rating above reflects this vendor&apos;s industry reputation based on operator feedback from forums, industry publications, and known performance. Individual operator reviews will appear here once submitted and approved.
          </span>
        </div>
      )}

      {/* Individual reviews */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <StarDisplay rating={review.rating} />
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 text-sm mt-1">{review.title}</h4>
                  )}
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(review.created_at)}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">{review.review_text}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="font-medium text-gray-600">{review.reviewer_name}</span>
                {review.reviewer_title && (
                  <>
                    <span>·</span>
                    <span>{review.reviewer_title}</span>
                  </>
                )}
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {sourceLabel(review.source)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
