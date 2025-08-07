-- Insert sponsors
INSERT INTO sponsors (name, logo, website) VALUES
('UNICEF', '/placeholder.svg?height=80&width=120', 'https://unicef.org'),
('World Vision', '/placeholder.svg?height=80&width=120', 'https://worldvision.org');
-- Seed data for Bidii Girls Program

-- Insert admin users (password is hashed for 'admin123')
INSERT INTO users (email, password_hash, role) VALUES
('admin@bidiigirls.org', '$2b$10$2Ar68X1fTWvN2cVVCIGQUOUNQfpYEe/Oz4O3vEOFBoDpYj/kYup/u', 'admin'),
('sarah@bidiigirls.org', '$2b$10$2Ar68X1fTWvN2cVVCIGQUOUNQfpYEe/Oz4O3vEOFBoDpYj/kYup/u', 'admin');

-- Insert team members
INSERT INTO team_members (name, role, bio, email, order_index) VALUES
('Sarah Wanjiku', 'Founder & Executive Director', 'Sarah founded Bidii Girls Program in 2021 after witnessing firsthand the challenges girls face due to period poverty. With over 10 years of experience in community development, she leads our mission with passion and dedication.', 'sarah@bidiigirls.org', 1),
('Grace Muthoni', 'Program Manager', 'Grace oversees our educational programs and community outreach initiatives. Her background in social work and her deep understanding of local communities make her invaluable to our mission.', 'grace@bidiigirls.org', 2),
('David Kimani', 'Operations Director', 'David manages our day-to-day operations and ensures efficient distribution of resources. His expertise in logistics and supply chain management helps us reach more girls effectively.', 'david@bidiigirls.org', 3),
('Mary Akinyi', 'Community Coordinator', 'Mary works directly with schools and communities to implement our programs. Her grassroots approach and cultural sensitivity ensure our initiatives are well-received and effective.', 'mary@bidiigirls.org', 4);

-- Insert projects
INSERT INTO projects (title, description, location, status, progress, budget, raised, beneficiaries, start_date) VALUES
('Menstrual Hygiene Education Program', 'Comprehensive education program teaching girls about menstrual health, hygiene practices, and body positivity in 10 schools across Kibera slum.', 'Kibera, Nairobi', 'active', 75, 15000.00, 11250.00, 250, '2024-01-01'),
('Sanitary Pad Distribution Initiative', 'Monthly distribution of reusable sanitary pads and hygiene kits to girls in Mathare slum, ensuring they don''t miss school during their periods.', 'Mathare, Nairobi', 'active', 60, 8000.00, 4800.00, 180, '2024-03-01'),
('Girls Empowerment Workshops', 'Weekly workshops focusing on leadership skills, self-confidence, and career guidance for teenage girls in Mukuru slum.', 'Mukuru, Nairobi', 'planning', 25, 5000.00, 1250.00, 120, '2024-06-01'),
('School Infrastructure Improvement', 'Building and renovating toilet facilities in schools to provide private, clean spaces for girls to manage their periods with dignity.', 'Kawangware, Nairobi', 'completed', 100, 25000.00, 25000.00, 300, '2023-09-01');

-- Insert blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, author, published) VALUES
('Breaking the Silence: Why Period Education Matters', 'breaking-silence-period-education-matters', 'Exploring the importance of comprehensive menstrual health education in breaking down stigma and empowering young girls.', 'Period education is crucial for empowering girls and breaking down harmful stigmas...', 'Education', 'Sarah Wanjiku', true),
('Success Story: How Maria Overcame Period Poverty', 'success-story-maria-overcame-period-poverty', 'Meet Maria, a 16-year-old from Kibera who transformed her life through our menstrual hygiene program.', 'Maria''s story is one of resilience and transformation...', 'Success Stories', 'Grace Muthoni', true),
('The Economic Impact of Period Poverty in Kenya', 'economic-impact-period-poverty-kenya', 'Understanding how period poverty affects girls'' education and economic opportunities in Kenyan communities.', 'Period poverty has far-reaching economic consequences...', 'Research', 'David Kimani', true);

-- Insert campaigns
INSERT INTO campaigns (title, description, location, urgency, beneficiaries, linked_blog, feature_image, start_date, end_date)
VALUES
('Emergency Period Kits for Kibera', 'Providing immediate relief with emergency menstrual hygiene kits for 200 girls in Kibera slum.', 'Kibera, Nairobi', 'Urgent', 200, 1, '/placeholder.svg?height=300&width=400', '2024-07-01', '2024-08-01'),
('School Toilet Renovation Project', 'Building private, clean toilet facilities in 5 schools to ensure girls have dignified spaces.', 'Mathare, Nairobi', 'Active', 500, 2, '/placeholder.svg?height=300&width=400', '2024-09-01', '2024-12-01');
