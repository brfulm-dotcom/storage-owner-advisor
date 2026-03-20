interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

export default function StarRating({ rating, reviewCount }: StarRatingProps) {
  // Generate filled and empty stars
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {/* Filled stars */}
        {Array(filledStars)
          .fill(null)
          .map((_, i) => (
            <span key={`filled-${i}`} className="text-yellow-400 text-lg">
              ★
            </span>
          ))}

        {/* Half star */}
        {hasHalfStar && (
          <span className="text-yellow-400 text-lg relative inline-block w-4">
            <span className="absolute left-0">☆</span>
            <span className="absolute left-0 overflow-hidden w-2">★</span>
          </span>
        )}

        {/* Empty stars */}
        {Array(emptyStars)
          .fill(null)
          .map((_, i) => (
            <span
              key={`empty-${i}`}
              className="text-gray-300 text-lg"
            >
              ☆
            </span>
          ))}
      </div>
      <span className="text-sm text-gray-600">({reviewCount} reviews)</span>
    </div>
  );
}
