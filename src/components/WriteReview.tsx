'use client';

import { useState } from 'react';

interface WriteReviewProps {
  vendorSlug: string;
  vendorName: string;
  onSuccess?: () => void;
}

export default function WriteReview({ vendorSlug, vendorName, onSuccess }: WriteReviewProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerTitle, setReviewerTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const displayRating = hoverRating || rating;

  const ratingLabels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_slug:    vendorSlug,
          rating,
          title:          title.trim() || null,
          review_text:    reviewText.trim(),
          reviewer_name:  reviewerName.trim(),
          reviewer_title: reviewerTitle.trim() || null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResult({ ok: true, message: data.message });
        onSuccess?.();
      } else {
        setResult({ ok: false, message: data.error || 'Something went wrong. Please try again.' });
      }
    } catch {
      setResult({ ok: false, message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Write a Review
      </button>
    );
  }

  if (result?.ok) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-5 text-center">
        <div className="text-green-500 text-3xl mb-2">✓</div>
        <h3 className="font-bold text-green-800 mb-1">Review Submitted!</h3>
        <p className="text-sm text-green-700">{result.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Review {vendorName}</h3>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star rating picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`text-3xl transition-colors ${
                  star <= displayRating ? 'text-yellow-400' : 'text-gray-200'
                } hover:text-yellow-400`}
                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
            {displayRating > 0 && (
              <span className="ml-2 text-sm text-gray-600 font-medium">
                {ratingLabels[displayRating]}
              </span>
            )}
          </div>
          {rating === 0 && (
            <p className="text-xs text-gray-400 mt-1">Click a star to rate</p>
          )}
        </div>

        {/* Title (optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Review Title <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Great revenue share, easy setup"
            maxLength={120}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Review text */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="Share your experience as a facility operator. What did you like or dislike? How was the revenue share, claims process, or customer support?"
            rows={4}
            minLength={20}
            maxLength={2000}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
          <p className="text-xs text-gray-400 mt-1">{reviewText.length}/2000 characters (min 20)</p>
        </div>

        {/* Reviewer name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={reviewerName}
            onChange={e => setReviewerName(e.target.value)}
            placeholder="e.g. John D. or John (last initial is fine)"
            maxLength={80}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Reviewer title/role (optional but valuable) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Your Role <span className="text-gray-400 font-normal">(optional, helps others trust your review)</span>
          </label>
          <input
            type="text"
            value={reviewerTitle}
            onChange={e => setReviewerTitle(e.target.value)}
            placeholder="e.g. Facility Owner, Phoenix AZ  |  Operations Manager, 3-location chain"
            maxLength={100}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error message */}
        {result && !result.ok && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
            {result.message}
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-gray-400">
          Reviews are moderated and typically appear within 24 hours. Please share your genuine experience as a self-storage operator — not a tenant review.
        </p>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setResult(null); }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
