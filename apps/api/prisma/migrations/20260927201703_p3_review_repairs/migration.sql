-- P3 review repairs (F4 + F5), additive only.
-- F4: publishedAt date domain cho 5 content tables (0001-01-01 .. < 10000-01-01, loai BC/-infinity/infinity).
-- F5: body <= 20000 code points cho 5 content tables; itinerary_days.content <= 5000 code points.
-- Preflight fail truoc khi apply constraint; khong sua/khong xoa du lieu.
-- Atomicity: Prisma migrate deploy chay moi migration trong mot transaction;
-- preflight RAISE EXCEPTION abort ca transaction nen khong co partial apply.

DO $$
DECLARE
  v_count bigint;
  v_example_id uuid;
BEGIN
  SELECT count(*), (array_agg(id))[1] INTO v_count, v_example_id
  FROM public."destinations"
  WHERE "body" IS NOT NULL AND char_length("body") > 20000;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'p3_review_repairs preflight: destinations.body has % row(s) over 20000 code points (example id %)', v_count, v_example_id;
  END IF;

  SELECT count(*), (array_agg(id))[1] INTO v_count, v_example_id
  FROM public."experiences"
  WHERE "body" IS NOT NULL AND char_length("body") > 20000;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'p3_review_repairs preflight: experiences.body has % row(s) over 20000 code points (example id %)', v_count, v_example_id;
  END IF;

  SELECT count(*), (array_agg(id))[1] INTO v_count, v_example_id
  FROM public."itineraries"
  WHERE "body" IS NOT NULL AND char_length("body") > 20000;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'p3_review_repairs preflight: itineraries.body has % row(s) over 20000 code points (example id %)', v_count, v_example_id;
  END IF;

  SELECT count(*), (array_agg(id))[1] INTO v_count, v_example_id
  FROM public."stories"
  WHERE "body" IS NOT NULL AND char_length("body") > 20000;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'p3_review_repairs preflight: stories.body has % row(s) over 20000 code points (example id %)', v_count, v_example_id;
  END IF;

  SELECT count(*), (array_agg(id))[1] INTO v_count, v_example_id
  FROM public."guides"
  WHERE "body" IS NOT NULL AND char_length("body") > 20000;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'p3_review_repairs preflight: guides.body has % row(s) over 20000 code points (example id %)', v_count, v_example_id;
  END IF;

  SELECT count(*), (array_agg(id))[1] INTO v_count, v_example_id
  FROM public."itinerary_days"
  WHERE char_length("content") > 5000;
  IF v_count > 0 THEN
    RAISE EXCEPTION 'p3_review_repairs preflight: itinerary_days.content has % row(s) over 5000 code points (example id %)', v_count, v_example_id;
  END IF;

  SELECT count(*), (array_agg(id))[1] INTO v_count, v_example_id
  FROM public."destinations"
  WHERE "publishedAt" IS NOT NULL
    AND ("publishedAt" < TIMESTAMPTZ '0001-01-01 00:00:00+00'
      OR "publishedAt" >= TIMESTAMPTZ '10000-01-01 00:00:00+00');
  IF v_count > 0 THEN
    RAISE EXCEPTION 'p3_review_repairs preflight: destinations.publishedAt has % row(s) outside 0001..9999 (example id %)', v_count, v_example_id;
  END IF;

  SELECT count(*), (array_agg(id))[1] INTO v_count, v_example_id
  FROM public."experiences"
  WHERE "publishedAt" IS NOT NULL
    AND ("publishedAt" < TIMESTAMPTZ '0001-01-01 00:00:00+00'
      OR "publishedAt" >= TIMESTAMPTZ '10000-01-01 00:00:00+00');
  IF v_count > 0 THEN
    RAISE EXCEPTION 'p3_review_repairs preflight: experiences.publishedAt has % row(s) outside 0001..9999 (example id %)', v_count, v_example_id;
  END IF;

  SELECT count(*), (array_agg(id))[1] INTO v_count, v_example_id
  FROM public."itineraries"
  WHERE "publishedAt" IS NOT NULL
    AND ("publishedAt" < TIMESTAMPTZ '0001-01-01 00:00:00+00'
      OR "publishedAt" >= TIMESTAMPTZ '10000-01-01 00:00:00+00');
  IF v_count > 0 THEN
    RAISE EXCEPTION 'p3_review_repairs preflight: itineraries.publishedAt has % row(s) outside 0001..9999 (example id %)', v_count, v_example_id;
  END IF;

  SELECT count(*), (array_agg(id))[1] INTO v_count, v_example_id
  FROM public."stories"
  WHERE "publishedAt" IS NOT NULL
    AND ("publishedAt" < TIMESTAMPTZ '0001-01-01 00:00:00+00'
      OR "publishedAt" >= TIMESTAMPTZ '10000-01-01 00:00:00+00');
  IF v_count > 0 THEN
    RAISE EXCEPTION 'p3_review_repairs preflight: stories.publishedAt has % row(s) outside 0001..9999 (example id %)', v_count, v_example_id;
  END IF;

  SELECT count(*), (array_agg(id))[1] INTO v_count, v_example_id
  FROM public."guides"
  WHERE "publishedAt" IS NOT NULL
    AND ("publishedAt" < TIMESTAMPTZ '0001-01-01 00:00:00+00'
      OR "publishedAt" >= TIMESTAMPTZ '10000-01-01 00:00:00+00');
  IF v_count > 0 THEN
    RAISE EXCEPTION 'p3_review_repairs preflight: guides.publishedAt has % row(s) outside 0001..9999 (example id %)', v_count, v_example_id;
  END IF;
END $$;

ALTER TABLE public."destinations"
  ADD CONSTRAINT "destinations_body_length_check"
  CHECK ("body" IS NULL OR char_length("body") <= 20000);

ALTER TABLE public."experiences"
  ADD CONSTRAINT "experiences_body_length_check"
  CHECK ("body" IS NULL OR char_length("body") <= 20000);

ALTER TABLE public."itineraries"
  ADD CONSTRAINT "itineraries_body_length_check"
  CHECK ("body" IS NULL OR char_length("body") <= 20000);

ALTER TABLE public."stories"
  ADD CONSTRAINT "stories_body_length_check"
  CHECK ("body" IS NULL OR char_length("body") <= 20000);

ALTER TABLE public."guides"
  ADD CONSTRAINT "guides_body_length_check"
  CHECK ("body" IS NULL OR char_length("body") <= 20000);

ALTER TABLE public."itinerary_days"
  ADD CONSTRAINT "itinerary_days_content_length_check"
  CHECK (char_length("content") <= 5000);

ALTER TABLE public."destinations"
  ADD CONSTRAINT "destinations_published_at_domain_check"
  CHECK (
    "publishedAt" IS NULL
    OR ("publishedAt" >= TIMESTAMPTZ '0001-01-01 00:00:00+00'
      AND "publishedAt" < TIMESTAMPTZ '10000-01-01 00:00:00+00')
  );

ALTER TABLE public."experiences"
  ADD CONSTRAINT "experiences_published_at_domain_check"
  CHECK (
    "publishedAt" IS NULL
    OR ("publishedAt" >= TIMESTAMPTZ '0001-01-01 00:00:00+00'
      AND "publishedAt" < TIMESTAMPTZ '10000-01-01 00:00:00+00')
  );

ALTER TABLE public."itineraries"
  ADD CONSTRAINT "itineraries_published_at_domain_check"
  CHECK (
    "publishedAt" IS NULL
    OR ("publishedAt" >= TIMESTAMPTZ '0001-01-01 00:00:00+00'
      AND "publishedAt" < TIMESTAMPTZ '10000-01-01 00:00:00+00')
  );

ALTER TABLE public."stories"
  ADD CONSTRAINT "stories_published_at_domain_check"
  CHECK (
    "publishedAt" IS NULL
    OR ("publishedAt" >= TIMESTAMPTZ '0001-01-01 00:00:00+00'
      AND "publishedAt" < TIMESTAMPTZ '10000-01-01 00:00:00+00')
  );

ALTER TABLE public."guides"
  ADD CONSTRAINT "guides_published_at_domain_check"
  CHECK (
    "publishedAt" IS NULL
    OR ("publishedAt" >= TIMESTAMPTZ '0001-01-01 00:00:00+00'
      AND "publishedAt" < TIMESTAMPTZ '10000-01-01 00:00:00+00')
  );
