-- ============================================================
-- DUAL RATING SYSTEM MIGRATION
-- Adds site_rating and site_review_count to vendors table
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add site rating columns to vendors table
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS site_rating DECIMAL(2,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS site_review_count INTEGER DEFAULT 0;

-- 2. Create a function to recalculate site ratings from approved reviews
CREATE OR REPLACE FUNCTION update_vendor_site_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate for the affected vendor
  UPDATE vendors
  SET
    site_rating = COALESCE((
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM vendor_reviews
      WHERE vendor_slug = COALESCE(NEW.vendor_slug, OLD.vendor_slug)
      AND approved = true
    ), 0),
    site_review_count = (
      SELECT COUNT(*)
      FROM vendor_reviews
      WHERE vendor_slug = COALESCE(NEW.vendor_slug, OLD.vendor_slug)
      AND approved = true
    )
  WHERE slug = COALESCE(NEW.vendor_slug, OLD.vendor_slug);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger to auto-update site rating when reviews change
DROP TRIGGER IF EXISTS trigger_update_site_rating ON vendor_reviews;
CREATE TRIGGER trigger_update_site_rating
  AFTER INSERT OR UPDATE OR DELETE ON vendor_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_vendor_site_rating();

-- 4. Backfill existing approved reviews into site_rating
UPDATE vendors v
SET
  site_rating = COALESCE(sub.avg_rating, 0),
  site_review_count = COALESCE(sub.review_count, 0)
FROM (
  SELECT
    vendor_slug,
    ROUND(AVG(rating)::numeric, 1) as avg_rating,
    COUNT(*) as review_count
  FROM vendor_reviews
  WHERE approved = true
  GROUP BY vendor_slug
) sub
WHERE v.slug = sub.vendor_slug;
