-- =============================================================================
-- SponsorNepal — Seed Data
-- =============================================================================
-- Run this AFTER creating auth users in Supabase Dashboard > Authentication.
--
-- Required auth users (email / password):
--   admin@sponsornepal.com     / Admin@123
--   ram@example.com            / Creator@123
--   sita@example.com           / Creator@123
--   bikash@example.com         / Creator@123
--   anita@example.com          / Creator@123
--   priya@example.com          / Creator@123
--   ncell@ncell.com.np         / Brand@123
--   daraz@daraz.com.np         / Brand@123
--   imepay@imepay.com.np       / Brand@123
--   foodmandu@foodmandu.com.np / Brand@123
--
-- After creating each user in the Supabase Dashboard, copy their UUID
-- and replace the placeholder UUIDs below, OR use the companion script
-- (see database/seeds/README.md).
-- =============================================================================

-- Disable triggers temporarily to allow direct inserts
ALTER TABLE public.users DISABLE TRIGGER on_auth_user_created;

-- =============================================================================
-- 1. USERS
-- =============================================================================

INSERT INTO public.users (id, email, role, full_name, avatar_url, is_verified) VALUES
-- Admin
('00000000-0000-0000-0000-000000000001', 'admin@sponsornepal.com', 'admin', 'SponsorNepal Admin', NULL, true),

-- Creators
('10000000-0000-0000-0000-000000000001', 'ram@example.com', 'creator', 'Ram Thapa', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ram', true),
('10000000-0000-0000-0000-000000000002', 'sita@example.com', 'creator', 'Sita Maharjan', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sita', true),
('10000000-0000-0000-0000-000000000003', 'bikash@example.com', 'creator', 'Bikash Shrestha', 'https://api.dicebear.com/7.x/avataaars/svg?seed=bikash', true),
('10000000-0000-0000-0000-000000000004', 'anita@example.com', 'creator', 'Anita Gurung', 'https://api.dicebear.com/7.x/avataaars/svg?seed=anita', false),
('10000000-0000-0000-0000-000000000005', 'priya@example.com', 'creator', 'Priya Tamang', 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', true),

-- Brands
('20000000-0000-0000-0000-000000000001', 'ncell@ncell.com.np', 'brand', 'Ncell Team', 'https://api.dicebear.com/7.x/initials/svg?seed=Ncell', true),
('20000000-0000-0000-0000-000000000002', 'daraz@daraz.com.np', 'brand', 'Daraz Nepal', 'https://api.dicebear.com/7.x/initials/svg?seed=Daraz', true),
('20000000-0000-0000-0000-000000000003', 'imepay@imepay.com.np', 'brand', 'IME Pay Team', 'https://api.dicebear.com/7.x/initials/svg?seed=IME', true),
('20000000-0000-0000-0000-000000000004', 'foodmandu@foodmandu.com.np', 'brand', 'Foodmandu Marketing', 'https://api.dicebear.com/7.x/initials/svg?seed=FM', true);

-- =============================================================================
-- 2. CREATOR PROFILES
-- =============================================================================

INSERT INTO public.creator_profiles (
  user_id, username, bio, niche, location, languages,
  instagram_handle, tiktok_handle, youtube_channel,
  instagram_followers, tiktok_followers, youtube_subscribers,
  engagement_rate, audience_demographics, pricing_range,
  categories, previous_sponsors, portfolio, banner_url
) VALUES

-- Ram Thapa — Travel & Lifestyle
(
  '10000000-0000-0000-0000-000000000001',
  'ramthapa',
  'Nepali travel vlogger and lifestyle creator exploring the beauty of Nepal. From the Himalayas to the Terai, I share authentic stories of our culture, food, and adventures.',
  'Travel & Lifestyle',
  'Kathmandu, Nepal',
  '{"Nepali","English","Hindi"}',
  '@ramthapa_travels',
  '@ramthapa',
  'Ram Thapa Vlogs',
  125000,
  89000,
  45000,
  4.80,
  '{"age_groups": {"18-24": 35, "25-34": 40, "35-44": 15, "45+": 10}, "gender": {"male": 55, "female": 42, "other": 3}, "top_locations": ["Nepal", "India", "UAE", "USA"]}',
  'NPR 15,000 - 50,000',
  '{"Travel","Lifestyle","Food","Culture","Adventure"}',
  '{"Ncell","Daraz Nepal","Soaltee Hotel","Buddha Air"}',
  '[
    {"title": "Hidden Gems of Pokhara", "url": "https://instagram.com/p/sample1", "type": "reel", "views": 250000},
    {"title": "Kathmandu Street Food Tour", "url": "https://youtube.com/watch?v=sample2", "type": "video", "views": 180000},
    {"title": "Everest Base Camp Journey", "url": "https://instagram.com/p/sample3", "type": "reel", "views": 520000}
  ]',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=400&fit=crop'
),

-- Sita Maharjan — Beauty & Fashion
(
  '10000000-0000-0000-0000-000000000002',
  'sitamaharjan',
  'Beauty influencer and fashion enthusiast from Kathmandu. I create content about Nepali beauty brands, traditional fashion with modern twists, and skincare routines for South Asian skin.',
  'Beauty & Fashion',
  'Lalitpur, Nepal',
  '{"Nepali","English","Newari"}',
  '@sita_beauty',
  '@sitabeauty',
  'Sita Beauty Nepal',
  210000,
  340000,
  78000,
  6.20,
  '{"age_groups": {"18-24": 45, "25-34": 35, "35-44": 15, "45+": 5}, "gender": {"male": 15, "female": 82, "other": 3}, "top_locations": ["Nepal", "India", "Qatar", "UK"]}',
  'NPR 20,000 - 75,000',
  '{"Beauty","Fashion","Skincare","Lifestyle","Makeup"}',
  '{"Vivo Nepal","Sastodeal","The Body Shop Nepal","Goldstar"}',
  '[
    {"title": "Nepali Bridal Makeup Tutorial", "url": "https://youtube.com/watch?v=sample4", "type": "video", "views": 890000},
    {"title": "Top 10 Nepali Skincare Brands", "url": "https://instagram.com/p/sample5", "type": "carousel", "views": 156000},
    {"title": "Dashain Outfit Ideas", "url": "https://tiktok.com/@sitabeauty/sample6", "type": "video", "views": 420000}
  ]',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=400&fit=crop'
),

-- Bikash Shrestha — Tech & Gaming
(
  '10000000-0000-0000-0000-000000000003',
  'bikashstha',
  'Tech reviewer and gaming content creator. I review gadgets, apps, and tech products relevant to the Nepali market. Also streaming PUBG Mobile and Free Fire on weekends.',
  'Tech & Gaming',
  'Bhaktapur, Nepal',
  '{"Nepali","English"}',
  '@bikash_tech',
  '@bikashtech',
  'Bikash Tech Nepal',
  95000,
  180000,
  120000,
  5.50,
  '{"age_groups": {"18-24": 50, "25-34": 35, "35-44": 10, "45+": 5}, "gender": {"male": 75, "female": 22, "other": 3}, "top_locations": ["Nepal", "India", "Malaysia", "USA"]}',
  'NPR 10,000 - 40,000',
  '{"Technology","Gaming","Reviews","Unboxing","Streaming"}',
  '{"Samsung Nepal","Xiaomi Nepal","Daraz","CG Digital"}',
  '[
    {"title": "Best Phones Under NPR 30,000", "url": "https://youtube.com/watch?v=sample7", "type": "video", "views": 320000},
    {"title": "PUBG Mobile Nepal Tournament", "url": "https://tiktok.com/@bikashtech/sample8", "type": "stream", "views": 95000},
    {"title": "iPhone 16 Review - Nepali Perspective", "url": "https://youtube.com/watch?v=sample9", "type": "video", "views": 450000}
  ]',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop'
),

-- Anita Gurung — Food & Cooking
(
  '10000000-0000-0000-0000-000000000004',
  'anitagurung',
  'Home chef and food content creator. Sharing authentic Nepali recipes, street food reviews, and cooking tips. My momo recipe has over 2M views!',
  'Food & Cooking',
  'Pokhara, Nepal',
  '{"Nepali","English","Gurung"}',
  '@anita_cooks',
  '@anitacooks',
  'Anita Kitchen Nepal',
  78000,
  156000,
  92000,
  7.10,
  '{"age_groups": {"18-24": 25, "25-34": 40, "35-44": 25, "45+": 10}, "gender": {"male": 30, "female": 67, "other": 3}, "top_locations": ["Nepal", "India", "Australia", "USA"]}',
  'NPR 8,000 - 30,000',
  '{"Food","Cooking","Recipes","Street Food","Restaurant Reviews"}',
  '{"Foodmandu","Bhatbhateni","Masala Nepal"}',
  '[
    {"title": "Perfect Momos - Secret Recipe", "url": "https://youtube.com/watch?v=sample10", "type": "video", "views": 2100000},
    {"title": "Pokhara Street Food Guide", "url": "https://instagram.com/p/sample11", "type": "reel", "views": 340000},
    {"title": "Dashain Special Thali", "url": "https://tiktok.com/@anitacooks/sample12", "type": "video", "views": 180000}
  ]',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop'
),

-- Priya Tamang — Fitness & Wellness
(
  '10000000-0000-0000-0000-000000000005',
  'priyafit',
  'Certified fitness trainer and wellness advocate. I create workout routines, healthy Nepali meal plans, and mental health content. On a mission to make fitness accessible in Nepal.',
  'Fitness & Wellness',
  'Kathmandu, Nepal',
  '{"Nepali","English","Tamang"}',
  '@priya_fitness',
  '@priyafit',
  'Priya Fit Nepal',
  65000,
  110000,
  35000,
  5.90,
  '{"age_groups": {"18-24": 40, "25-34": 40, "35-44": 15, "45+": 5}, "gender": {"male": 35, "female": 62, "other": 3}, "top_locations": ["Nepal", "India", "Qatar", "Japan"]}',
  'NPR 10,000 - 35,000',
  '{"Fitness","Wellness","Health","Yoga","Nutrition"}',
  '{"Gold Gym Nepal","MuscleBlaze Nepal","Health Zone"}',
  '[
    {"title": "30 Day Home Workout Challenge", "url": "https://youtube.com/watch?v=sample13", "type": "video", "views": 560000},
    {"title": "Healthy Nepali Breakfast Ideas", "url": "https://instagram.com/p/sample14", "type": "reel", "views": 198000},
    {"title": "Yoga for Beginners - Nepali Guide", "url": "https://youtube.com/watch?v=sample15", "type": "video", "views": 275000}
  ]',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=400&fit=crop'
);

-- =============================================================================
-- 3. BRAND PROFILES
-- =============================================================================

INSERT INTO public.brand_profiles (
  user_id, company_name, website, industry, description, logo_url
) VALUES

(
  '20000000-0000-0000-0000-000000000001',
  'Ncell',
  'https://www.ncell.axiata.com',
  'Telecommunications',
  'Ncell is Nepal''s leading private telecommunications company, providing mobile voice and data services to millions of customers across the country.',
  'https://api.dicebear.com/7.x/initials/svg?seed=Ncell&backgroundColor=1a73e8'
),
(
  '20000000-0000-0000-0000-000000000002',
  'Daraz Nepal',
  'https://www.daraz.com.np',
  'E-commerce',
  'Daraz is South Asia''s leading online marketplace offering a diverse selection of products at competitive prices with fast delivery across Nepal.',
  'https://api.dicebear.com/7.x/initials/svg?seed=Daraz&backgroundColor=f57224'
),
(
  '20000000-0000-0000-0000-000000000003',
  'IME Pay',
  'https://www.imepay.com.np',
  'Fintech',
  'IME Pay is Nepal''s trusted digital payment platform enabling seamless money transfers, bill payments, and mobile banking for millions of Nepalis.',
  'https://api.dicebear.com/7.x/initials/svg?seed=IME&backgroundColor=00a651'
),
(
  '20000000-0000-0000-0000-000000000004',
  'Foodmandu',
  'https://www.foodmandu.com',
  'Food Delivery',
  'Foodmandu is Nepal''s first and largest food delivery platform, connecting hungry customers with the best restaurants in Kathmandu Valley and beyond.',
  'https://api.dicebear.com/7.x/initials/svg?seed=FM&backgroundColor=e31837'
);

-- =============================================================================
-- 4. CAMPAIGNS
-- =============================================================================

INSERT INTO public.campaigns (
  brand_id, title, description, budget, deliverables, target_audience,
  platform_requirements, deadline, campaign_type, status
) VALUES

-- Ncell campaigns
(
  '20000000-0000-0000-0000-000000000001',
  'Ncell 5G Launch Campaign',
  'We are launching 5G services in Nepal and need influencers to create buzz around this milestone. Looking for tech and lifestyle creators to showcase the speed and possibilities of 5G connectivity.',
  500000.00,
  '2 Instagram Reels, 1 YouTube video, 3 Instagram Stories with swipe-up link',
  'Tech-savvy youth aged 18-35 in urban Nepal',
  '{"Instagram","YouTube","TikTok"}',
  '2026-06-30',
  'Product Launch',
  'open'
),
(
  '20000000-0000-0000-0000-000000000001',
  'Ncell Data Pack Promotion',
  'Promote our new affordable data packs targeting students and young professionals. Need relatable content showing how our data packs help with work, study, and entertainment.',
  200000.00,
  '3 TikTok videos, 2 Instagram Stories, 1 blog post',
  'Students and young professionals aged 18-28',
  '{"TikTok","Instagram"}',
  '2026-06-15',
  'Brand Awareness',
  'open'
),

-- Daraz campaigns
(
  '20000000-0000-0000-0000-000000000002',
  'Daraz 6.6 Sale Campaign',
  'Join our biggest mid-year sale event! We need creators to generate excitement and drive traffic to the Daraz app during our 6.6 Mega Sale. Commission-based plus flat fee.',
  350000.00,
  '5 Instagram posts/Reels, 2 YouTube Shorts, daily Stories for 1 week',
  'Online shoppers aged 20-40 across Nepal',
  '{"Instagram","YouTube","Facebook"}',
  '2026-06-06',
  'Sales Promotion',
  'open'
),
(
  '20000000-0000-0000-0000-000000000002',
  'Daraz Fashion Week',
  'Showcase the latest fashion trends available on Daraz. Create lookbooks, hauls, and styling content featuring products from our fashion category.',
  250000.00,
  '3 Instagram Reels (outfit transitions), 1 YouTube haul video, 5 Instagram Stories',
  'Fashion-conscious women aged 18-35',
  '{"Instagram","YouTube","TikTok"}',
  '2026-07-15',
  'Content Series',
  'open'
),

-- IME Pay campaigns
(
  '20000000-0000-0000-0000-000000000003',
  'IME Pay Send Money Campaign',
  'Promote IME Pay''s international money transfer feature. Target Nepali diaspora and their families back home. Show how easy and fast it is to send money from abroad.',
  300000.00,
  '2 YouTube videos, 3 Instagram Reels, 2 TikTok videos',
  'Nepali diaspora and families receiving remittances',
  '{"YouTube","Instagram","TikTok"}',
  '2026-07-01',
  'Brand Awareness',
  'open'
),
(
  '20000000-0000-0000-0000-000000000003',
  'IME Pay QR Payments Drive',
  'Promote QR code payments at local shops and restaurants. Need creators to demonstrate the ease of cashless payments in everyday scenarios.',
  150000.00,
  '4 Instagram Reels, 2 TikTok videos showing real payment scenarios',
  'Urban consumers aged 20-40',
  '{"Instagram","TikTok"}',
  '2026-06-20',
  'Product Adoption',
  'in_progress'
),

-- Foodmandu campaigns
(
  '20000000-0000-0000-0000-000000000004',
  'Foodmandu Restaurant Reviews',
  'Create honest, engaging reviews of top restaurants on our platform. We want authentic content that helps users discover new places to eat.',
  180000.00,
  '4 Instagram Reels (restaurant reviews), 2 YouTube videos, 10 Instagram Stories',
  'Food lovers aged 18-45 in Kathmandu Valley',
  '{"Instagram","YouTube"}',
  '2026-06-30',
  'Content Series',
  'open'
),
(
  '20000000-0000-0000-0000-000000000004',
  'Foodmandu Late Night Delivery',
  'Promote our new late-night delivery service (10 PM - 2 AM). Target students, gamers, and night owls who need food delivered during odd hours.',
  120000.00,
  '3 TikTok videos, 2 Instagram Reels, 5 Instagram Stories',
  'Students, gamers, and young professionals aged 18-30',
  '{"TikTok","Instagram"}',
  '2026-06-10',
  'Service Promotion',
  'open'
),
(
  '20000000-0000-0000-0000-000000000004',
  'Foodmandu Dashain Special',
  'Celebrate Dashain with Foodmandu! Create festive content around traditional Dashain foods and how Foodmandu makes celebrations easier with delivery.',
  400000.00,
  '5 Instagram Reels, 2 YouTube videos, daily Stories for 2 weeks during Dashain',
  'All Nepalis celebrating Dashain',
  '{"Instagram","YouTube","TikTok","Facebook"}',
  '2026-10-15',
  'Seasonal Campaign',
  'draft'
);

-- =============================================================================
-- 5. CAMPAIGN APPLICATIONS
-- =============================================================================

INSERT INTO public.campaign_applications (
  campaign_id, creator_id, proposal_message, expected_price, delivery_timeline, status
) VALUES

-- Applications for Ncell 5G Launch
(
  (SELECT id FROM campaigns WHERE title = 'Ncell 5G Launch Campaign'),
  '10000000-0000-0000-0000-000000000003',
  'Hi! As a tech content creator with 180K+ TikTok followers, I''d love to showcase the 5G experience. I can create a speed test comparison video and a day-in-my-life using 5G content that will resonate with my tech-savvy audience.',
  45000.00,
  '7 days from product access',
  'accepted'
),
(
  (SELECT id FROM campaigns WHERE title = 'Ncell 5G Launch Campaign'),
  '10000000-0000-0000-0000-000000000001',
  'As a travel creator, I can show how 5G transforms the content creation experience — live streaming from remote locations, uploading 4K footage on the go, etc. This angle will appeal to both tech enthusiasts and travelers.',
  50000.00,
  '10 days',
  'pending'
),

-- Applications for Daraz 6.6 Sale
(
  (SELECT id FROM campaigns WHERE title = 'Daraz 6.6 Sale Campaign'),
  '10000000-0000-0000-0000-000000000002',
  'I have 210K Instagram followers and my audience is primarily online shoppers. I can create compelling outfit transitions and deal highlights that drive real conversions. My previous Daraz collab generated 500+ orders.',
  40000.00,
  'Content delivered by June 3rd',
  'accepted'
),
(
  (SELECT id FROM campaigns WHERE title = 'Daraz 6.6 Sale Campaign'),
  '10000000-0000-0000-0000-000000000004',
  'As a food creator, I can showcase kitchen appliances, food items, and cooking gadgets available on Daraz during the sale. Perfect angle for the foodie audience!',
  25000.00,
  '5 days',
  'pending'
),
(
  (SELECT id FROM campaigns WHERE title = 'Daraz 6.6 Sale Campaign'),
  '10000000-0000-0000-0000-000000000005',
  'I can create fitness equipment and athleisure haul content for the sale. My audience trusts my product recommendations and I have high conversion rates.',
  30000.00,
  '7 days',
  'rejected'
),

-- Applications for Daraz Fashion Week
(
  (SELECT id FROM campaigns WHERE title = 'Daraz Fashion Week'),
  '10000000-0000-0000-0000-000000000002',
  'Fashion is my primary niche! I can create stunning lookbooks featuring Daraz fashion finds, including traditional Nepali wear with modern styling. My audience specifically follows me for fashion inspiration.',
  35000.00,
  '1 week for all content',
  'accepted'
),

-- Applications for IME Pay Send Money
(
  (SELECT id FROM campaigns WHERE title = 'IME Pay Send Money Campaign'),
  '10000000-0000-0000-0000-000000000001',
  'I can create an emotional story about sending money home to family during my travels. This authentic approach resonates with the Nepali diaspora audience and showcases IME Pay''s reliability.',
  40000.00,
  '10 days',
  'pending'
),

-- Applications for Foodmandu Restaurant Reviews
(
  (SELECT id FROM campaigns WHERE title = 'Foodmandu Restaurant Reviews'),
  '10000000-0000-0000-0000-000000000004',
  'Food is my passion and my 78K Instagram followers love my honest reviews. I can visit 4 restaurants and create mouth-watering content that drives orders. My momo video got 2M views — imagine what I can do for your restaurants!',
  35000.00,
  '2 weeks',
  'accepted'
),
(
  (SELECT id FROM campaigns WHERE title = 'Foodmandu Restaurant Reviews'),
  '10000000-0000-0000-0000-000000000001',
  'I can combine my travel storytelling with food reviews — exploring the best restaurants in different parts of Kathmandu Valley. A unique angle that food and travel lovers will enjoy.',
  30000.00,
  '10 days',
  'pending'
),

-- Applications for Foodmandu Late Night Delivery
(
  (SELECT id FROM campaigns WHERE title = 'Foodmandu Late Night Delivery'),
  '10000000-0000-0000-0000-000000000003',
  'As a gamer, I can create authentic late-night gaming + food delivery content. My audience of 180K on TikTok are mostly gamers who order food during late sessions. Perfect fit!',
  20000.00,
  '5 days',
  'accepted'
),
(
  (SELECT id FROM campaigns WHERE title = 'Foodmandu Late Night Delivery'),
  '10000000-0000-0000-0000-000000000005',
  'I can create "what I eat in a day" content showing late-night healthy meal deliveries after evening workouts. Great for the health-conscious night owl segment.',
  18000.00,
  '5 days',
  'pending'
);

-- =============================================================================
-- 6. CONVERSATIONS
-- =============================================================================

INSERT INTO public.conversations (id, creator_id, brand_id) VALUES
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004'),
('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004'),
('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000003');

-- =============================================================================
-- 7. MESSAGES
-- =============================================================================

INSERT INTO public.messages (conversation_id, sender_id, content, is_read, created_at) VALUES
-- Conversation: Bikash <-> Ncell (5G campaign)
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Hi Bikash! We loved your application for the 5G campaign. Your tech review style is exactly what we''re looking for.', true, '2026-05-15 10:00:00+05:45'),
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Thank you so much! I''m really excited about this campaign. When can I get access to the 5G device for testing?', true, '2026-05-15 10:15:00+05:45'),
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'We''ll send you a 5G-enabled device by Friday. Please start with a speed test video and then a "day with 5G" vlog.', true, '2026-05-15 10:30:00+05:45'),
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Perfect! I''ll have the speed test video ready by Monday and the vlog by Wednesday. Should I include any specific 5G use cases you want highlighted?', true, '2026-05-15 11:00:00+05:45'),
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Yes! Please focus on: 4K video streaming, cloud gaming, and video calling quality. These are our key selling points.', false, '2026-05-15 11:15:00+05:45'),

-- Conversation: Sita <-> Daraz (6.6 Sale)
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Hi Sita! Congratulations, you''ve been selected for our 6.6 Mega Sale campaign. Let''s discuss the content plan.', true, '2026-05-16 09:00:00+05:45'),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Amazing! I''m so excited to work with Daraz again. What products should I focus on for the outfit transitions?', true, '2026-05-16 09:20:00+05:45'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'We want to highlight summer fashion, accessories, and beauty products. We''ll send you a curated list with discount codes.', true, '2026-05-16 09:45:00+05:45'),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'That sounds great! I can also do a "haul + try-on" format which my audience loves. Shall I include pricing in the content?', true, '2026-05-16 10:00:00+05:45'),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Yes please! Showing the discounted prices is key. Also, please use the hashtag #Daraz66Sale and tag @daraznepal.', false, '2026-05-16 10:15:00+05:45'),

-- Conversation: Anita <-> Foodmandu (Restaurant Reviews)
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', 'Hi Anita! Your momo video was incredible — 2M views! We''d love to have you review some of our top restaurants.', true, '2026-05-17 14:00:00+05:45'),
('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', 'Thank you! I''d love to. Which restaurants are you thinking? I prefer authentic Nepali and Newari cuisine spots.', true, '2026-05-17 14:20:00+05:45'),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', 'We have Bota, Newa Lahana, and Roadhouse Cafe on board. You can order through Foodmandu and we''ll cover the costs. Show the ordering experience too!', true, '2026-05-17 14:45:00+05:45'),
('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', 'Love those choices! I''ll create a series called "Anita''s Foodmandu Picks" — each video reviewing one restaurant with signature dishes. The app experience will be natural in the content.', true, '2026-05-17 15:00:00+05:45'),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', 'That''s perfect! Please include the delivery time and packaging quality too. Our customers care about the full experience.', false, '2026-05-17 15:15:00+05:45'),

-- Conversation: Ram <-> Daraz (collaboration inquiry)
('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Hi Daraz team! I saw your Fashion Week campaign and I''m interested. While travel is my main niche, I can create travel outfit content featuring Daraz products.', true, '2026-05-18 11:00:00+05:45'),
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'Hi Ram! That''s an interesting angle — travel fashion. Can you share some examples of outfit content you''ve done before?', true, '2026-05-18 11:30:00+05:45'),
('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'I don''t have dedicated fashion content, but my travel reels feature different outfits and my audience always asks about what I wear. I can do "what to pack for Pokhara" or "trekking gear from Daraz" style content.', false, '2026-05-18 12:00:00+05:45'),

-- Conversation: Bikash <-> Foodmandu (Late Night)
('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'Hi Foodmandu! I just got accepted for the late night delivery campaign. I''m planning a "Gaming Night with Foodmandu" series. When does the late night service start?', true, '2026-05-19 20:00:00+05:45'),
('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000004', 'Great concept! Late night delivery is available from 10 PM to 2 AM. We can set up a special promo code for your audience — BIKASHNIGHT for 20% off.', true, '2026-05-19 20:15:00+05:45'),
('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'That promo code is awesome! I''ll do a live stream where I order food mid-game and show the delivery experience. My gaming audience will love this.', true, '2026-05-19 20:30:00+05:45'),
('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000004', 'Love the live stream idea! Can you also show the app ordering process? Make it look easy and quick.', false, '2026-05-19 20:45:00+05:45'),

-- Conversation: Priya <-> IME Pay
('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000005', 'Hi IME Pay team! I saw your QR payments campaign. As a fitness creator, I can show how I use IME Pay for gym payments, healthy food purchases, and wellness products.', true, '2026-05-20 09:00:00+05:45'),
('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000003', 'Hi Priya! That''s a great fit. We want to show IME Pay as part of everyday life. Can you create content at your gym and local health food stores?', true, '2026-05-20 09:20:00+05:45'),
('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000005', 'Absolutely! I can do a "cashless day" vlog — showing every payment from morning smoothie to evening gym session using IME Pay QR. Very relatable for my audience.', true, '2026-05-20 09:40:00+05:45'),
('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000003', 'That''s exactly what we need! Please highlight the transaction speed and the QR scan process. We''ll provide you with a list of partner merchants near you.', false, '2026-05-20 10:00:00+05:45');

-- =============================================================================
-- 8. DEALS
-- =============================================================================

INSERT INTO public.deals (
  campaign_id, creator_id, brand_id, agreed_amount, escrow_status, payout_status, status
) VALUES

-- Bikash's deal with Ncell (5G campaign)
(
  (SELECT id FROM campaigns WHERE title = 'Ncell 5G Launch Campaign'),
  '10000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000001',
  45000.00,
  'held',
  'pending',
  'active'
),

-- Sita's deal with Daraz (6.6 Sale)
(
  (SELECT id FROM campaigns WHERE title = 'Daraz 6.6 Sale Campaign'),
  '10000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000002',
  40000.00,
  'held',
  'pending',
  'active'
),

-- Sita's deal with Daraz (Fashion Week)
(
  (SELECT id FROM campaigns WHERE title = 'Daraz Fashion Week'),
  '10000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000002',
  35000.00,
  'pending',
  'pending',
  'pending'
),

-- Anita's deal with Foodmandu (Restaurant Reviews)
(
  (SELECT id FROM campaigns WHERE title = 'Foodmandu Restaurant Reviews'),
  '10000000-0000-0000-0000-000000000004',
  '20000000-0000-0000-0000-000000000004',
  35000.00,
  'held',
  'pending',
  'active'
),

-- Bikash's deal with Foodmandu (Late Night)
(
  (SELECT id FROM campaigns WHERE title = 'Foodmandu Late Night Delivery'),
  '10000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000004',
  20000.00,
  'pending',
  'pending',
  'pending'
),

-- A completed deal (for stats)
(
  (SELECT id FROM campaigns WHERE title = 'IME Pay QR Payments Drive'),
  '10000000-0000-0000-0000-000000000005',
  '20000000-0000-0000-0000-000000000003',
  22000.00,
  'released',
  'completed',
  'completed'
);

-- =============================================================================
-- 9. SAVED CREATORS
-- =============================================================================

INSERT INTO public.saved_creators (brand_id, creator_id) VALUES
-- Ncell saved
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003'),
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'),

-- Daraz saved
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001'),

-- IME Pay saved
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001'),

-- Foodmandu saved
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004'),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003'),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001');

-- =============================================================================
-- 10. NOTIFICATIONS
-- =============================================================================

INSERT INTO public.notifications (user_id, title, message, is_read, created_at) VALUES
-- Creator notifications
('10000000-0000-0000-0000-000000000003', 'Application Accepted!', 'Your application for Ncell 5G Launch Campaign has been accepted. Check your messages for details.', true, '2026-05-15 10:00:00+05:45'),
('10000000-0000-0000-0000-000000000003', 'New Deal Created', 'A new deal has been created for Ncell 5G Launch Campaign. Amount: NPR 45,000.', true, '2026-05-15 12:00:00+05:45'),
('10000000-0000-0000-0000-000000000003', 'New Message', 'You have a new message from Ncell regarding the 5G campaign.', false, '2026-05-15 11:15:00+05:45'),

('10000000-0000-0000-0000-000000000002', 'Application Accepted!', 'Your application for Daraz 6.6 Sale Campaign has been accepted!', true, '2026-05-16 09:00:00+05:45'),
('10000000-0000-0000-0000-000000000002', 'New Deal Created', 'A new deal has been created for Daraz 6.6 Sale Campaign. Amount: NPR 40,000.', true, '2026-05-16 10:00:00+05:45'),
('10000000-0000-0000-0000-000000000002', 'New Campaign Match', 'New campaign "Daraz Fashion Week" matches your profile. Check it out!', false, '2026-05-17 08:00:00+05:45'),

('10000000-0000-0000-0000-000000000004', 'Application Accepted!', 'Your application for Foodmandu Restaurant Reviews has been accepted!', true, '2026-05-17 14:00:00+05:45'),
('10000000-0000-0000-0000-000000000004', 'New Deal Created', 'A new deal has been created for Foodmandu Restaurant Reviews. Amount: NPR 35,000.', true, '2026-05-17 16:00:00+05:45'),

('10000000-0000-0000-0000-000000000001', 'Application Pending', 'Your application for Ncell 5G Launch Campaign is under review.', true, '2026-05-14 15:00:00+05:45'),
('10000000-0000-0000-0000-000000000001', 'Application Pending', 'Your application for IME Pay Send Money Campaign is under review.', false, '2026-05-18 09:00:00+05:45'),

('10000000-0000-0000-0000-000000000005', 'Application Rejected', 'Your application for Daraz 6.6 Sale Campaign was not selected this time. Keep applying!', true, '2026-05-16 11:00:00+05:45'),
('10000000-0000-0000-0000-000000000005', 'Deal Completed', 'Your deal for IME Pay QR Payments Drive has been completed. Payment of NPR 22,000 has been processed.', true, '2026-05-10 16:00:00+05:45'),
('10000000-0000-0000-0000-000000000005', 'New Message', 'You have a new message from Foodmandu regarding the late night delivery campaign.', false, '2026-05-19 20:45:00+05:45'),

-- Brand notifications
('20000000-0000-0000-0000-000000000001', 'New Application', 'Bikash Shrestha has applied to your "Ncell 5G Launch Campaign" campaign.', true, '2026-05-13 10:00:00+05:45'),
('20000000-0000-0000-0000-000000000001', 'New Application', 'Ram Thapa has applied to your "Ncell 5G Launch Campaign" campaign.', false, '2026-05-14 08:00:00+05:45'),

('20000000-0000-0000-0000-000000000002', 'New Application', 'Sita Maharjan has applied to your "Daraz 6.6 Sale Campaign" campaign.', true, '2026-05-14 12:00:00+05:45'),
('20000000-0000-0000-0000-000000000002', 'New Application', 'Anita Gurung has applied to your "Daraz 6.6 Sale Campaign" campaign.', true, '2026-05-14 14:00:00+05:45'),
('20000000-0000-0000-0000-000000000002', 'New Application', 'Priya Tamang has applied to your "Daraz 6.6 Sale Campaign" campaign.', true, '2026-05-14 16:00:00+05:45'),

('20000000-0000-0000-0000-000000000004', 'New Application', 'Anita Gurung has applied to your "Foodmandu Restaurant Reviews" campaign.', true, '2026-05-15 10:00:00+05:45'),
('20000000-0000-0000-0000-000000000004', 'New Application', 'Ram Thapa has applied to your "Foodmandu Restaurant Reviews" campaign.', false, '2026-05-16 09:00:00+05:45'),
('20000000-0000-0000-0000-000000000004', 'New Application', 'Bikash Shrestha has applied to your "Foodmandu Late Night Delivery" campaign.', true, '2026-05-17 11:00:00+05:45'),
('20000000-0000-0000-0000-000000000004', 'New Application', 'Priya Tamang has applied to your "Foodmandu Late Night Delivery" campaign.', false, '2026-05-17 15:00:00+05:45'),

('20000000-0000-0000-0000-000000000003', 'New Application', 'Priya Tamang has applied to your "IME Pay QR Payments Drive" campaign.', true, '2026-05-10 08:00:00+05:45'),
('20000000-0000-0000-0000-000000000003', 'Deal Completed', 'Deal with Priya Tamang for IME Pay QR Payments Drive has been completed. Payment of NPR 22,000 released.', true, '2026-05-10 16:00:00+05:45');

-- =============================================================================
-- 11. TRANSACTIONS
-- =============================================================================

INSERT INTO public.transactions (deal_id, amount, payment_method, payment_status, transaction_ref, created_at) VALUES
-- Bikash's deal with Ncell (escrow held)
(
  (SELECT id FROM deals WHERE creator_id = '10000000-0000-0000-0000-000000000003' AND brand_id = '20000000-0000-0000-0000-000000000001' AND status = 'active' LIMIT 1),
  45000.00,
  'bank_transfer',
  'escrow_held',
  'TXN-NCELL-001',
  '2026-05-15 12:30:00+05:45'
),

-- Sita's deal with Daraz 6.6 (escrow held)
(
  (SELECT id FROM deals WHERE creator_id = '10000000-0000-0000-0000-000000000002' AND brand_id = '20000000-0000-0000-0000-000000000002' AND campaign_id = (SELECT id FROM campaigns WHERE title = 'Daraz 6.6 Sale Campaign') AND status = 'active' LIMIT 1),
  40000.00,
  'esewa',
  'escrow_held',
  'TXN-DARAZ-001',
  '2026-05-16 10:30:00+05:45'
),

-- Anita's deal with Foodmandu (escrow held)
(
  (SELECT id FROM deals WHERE creator_id = '10000000-0000-0000-0000-000000000004' AND brand_id = '20000000-0000-0000-0000-000000000004' AND status = 'active' LIMIT 1),
  35000.00,
  'khalti',
  'escrow_held',
  'TXN-FM-001',
  '2026-05-17 16:30:00+05:45'
),

-- Priya's completed deal with IME Pay (released)
(
  (SELECT id FROM deals WHERE creator_id = '10000000-0000-0000-0000-000000000005' AND brand_id = '20000000-0000-0000-0000-000000000003' AND status = 'completed' LIMIT 1),
  22000.00,
  'bank_transfer',
  'released',
  'TXN-IME-001',
  '2026-05-10 14:00:00+05:45'
),

-- Platform fee record for the completed deal
(
  (SELECT id FROM deals WHERE creator_id = '10000000-0000-0000-0000-000000000005' AND brand_id = '20000000-0000-0000-0000-000000000003' AND status = 'completed' LIMIT 1),
  2200.00,
  'platform_fee',
  'collected',
  'FEE-IME-001',
  '2026-05-10 14:00:00+05:45'
);

-- Re-enable triggers
ALTER TABLE public.users ENABLE TRIGGER on_auth_user_created;

-- =============================================================================
-- DONE! Seed data inserted successfully.
-- =============================================================================
-- Summary:
--   1 admin, 5 creators, 4 brands
--   9 creator profiles with full data
--   4 brand profiles
--   9 campaigns (6 open, 1 in_progress, 1 draft, 1 completed)
--   11 applications (4 accepted, 1 rejected, 6 pending)
--   6 conversations with 28 messages
--   6 deals (3 active, 2 pending, 1 completed)
--   10 saved creators
--   24 notifications
--   5 transactions (3 escrow held, 1 released, 1 platform fee) (mix of read/unread)
-- =============================================================================
