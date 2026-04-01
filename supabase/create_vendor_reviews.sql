-- ============================================================
-- vendor_reviews table
-- Run this once in Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS vendor_reviews (
  id            BIGSERIAL PRIMARY KEY,
  vendor_slug   TEXT        NOT NULL,
  rating        INTEGER     NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title         TEXT,
  review_text   TEXT        NOT NULL,
  reviewer_name TEXT        NOT NULL,
  reviewer_title TEXT,                          -- e.g. "Facility Owner, Phoenix AZ"
  source        TEXT        NOT NULL DEFAULT 'site',  -- 'site' | 'google' | 'imported'
  approved      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookups by vendor
CREATE INDEX IF NOT EXISTS vendor_reviews_slug_approved_idx
  ON vendor_reviews (vendor_slug, approved);

-- Enable Row Level Security
ALTER TABLE vendor_reviews ENABLE ROW LEVEL SECURITY;

-- Public: read approved reviews only
CREATE POLICY "Public read approved reviews"
  ON vendor_reviews FOR SELECT
  USING (approved = TRUE);

-- Public: anyone can submit (approved defaults to false — goes to moderation queue)
CREATE POLICY "Public submit reviews"
  ON vendor_reviews FOR INSERT
  WITH CHECK (approved = FALSE);

-- Service role: full access (used by admin API and import scripts)
CREATE POLICY "Service role full access"
  ON vendor_reviews FOR ALL
  USING (auth.role() = 'service_role');
