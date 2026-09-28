CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);



INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id) 
        REFERENCES organization (organization_id)
        ON DELETE CASCADE
);



-- Insert 5 projects for Organization 1
INSERT INTO  service_project(organization_id, title, description, location, project_date) VALUES
(1, 'Community Garden Clean Up', 'Removing weeds, preparing soil, and planting fresh vegetables for local residents.', 'City Community Garden', '2026-10-15'),
(1, 'Food Pantry Sorting', 'Collecting, organizing, and boxing canned food items for holiday distribution.', 'Downtown Food Bank', '2026-11-02'),
(1, 'Urban Tree Planting', 'Planting 50 native shade trees along the riverbank trail.', 'Riverside Park', '2026-11-20'),
(1, 'Winter Coat Collection', 'Gathering, inspecting, and distributing donated warm coats to shelters.', 'Community Center', '2026-12-05'),
(1, 'Senior Tech Literacy Workshop', 'Teaching elderly community members how to use smartphones and video calls.', 'Public Library', '2026-12-18'),

-- Insert 5 projects for Organization 2
(2, 'Coastal Beach Restoration', 'Cleaning litter off the shoreline and rebuilding sand dunes.', 'Ocean Beach', '2026-10-10'),
(2, 'Neighborhood E-Waste Recycling', 'Collecting old electronics and appliances for safe disposal.', 'High School Parking Lot', '2026-10-25'),
(2, 'Park Bench Restoration', 'Sanding and repainting weathered wooden benches throughout the park.', 'Central Park', '2026-11-12'),
(2, 'Hiking Trail Maintenance', 'Clearing fallen branches and fixing erosion markers on public trails.', 'Mountain Ridge Trail', '2026-11-28'),
(2, 'City Street Cleanup', 'Organized litter pickup along major commercial avenues.', 'East Side Main Street', '2026-12-10'),

-- Insert 5 projects for Organization 3
(3, 'After-School Math Tutoring', 'Providing one-on-one tutoring for elementary and middle school students.', 'Youth Empowerment Hub', '2026-10-18'),
(3, 'Charity Book Sale Prep', 'Sorting donated books by genre and setting up sales displays.', 'Main Branch Library', '2026-11-05'),
(3, 'Soup Kitchen Meal Prep', 'Cooking, serving, and cleaning up dinner for local community members.', 'Hope Shelter', '2026-11-22'),
(3, 'Holiday Toy Repair & Cleaning', 'Restoring and wrapping gently used toys for family donations.', 'Civic Hall', '2026-12-01'),
(3, 'Blood Drive Support', 'Assisting medical staff with donor check-in and refreshment tables.', 'Red Cross Center', '2026-12-15');


CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS project_categories (
    project_id INT NOT NULL REFERENCES service_project(project_id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);