-- Blog articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image_url text,
  category text NOT NULL CHECK (category IN ('linguistic', 'cultural', 'celebrity', 'movie-tv')),
  tags text[] DEFAULT '{}',
  published_at timestamptz,
  is_published boolean DEFAULT false,
  views int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles (published_at DESC);

-- RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public read for published articles
CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT
  USING (is_published = true);

-- Service role can do everything (bypasses RLS automatically)
