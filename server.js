const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Location-specific content
const locations = {
  ottawa: { name: 'Ottawa', tagline: 'Capital Fitness', intro: 'Ottawa content' },
  toronto: { name: 'Toronto', tagline: 'Heart of Toronto', intro: 'Toronto content' },
  montreal: { name: 'Montreal', tagline: 'Votre santé', intro: 'Montréal content' },
  vancouver: { name: 'Vancouver', tagline: 'West Coast Wellness', intro: 'Vancouver content' }
};

const subpages = ['home', 'memberships', 'philosophy', 'wellness', 'club-tour'];

const locationList = Object.entries(locations).map(([key, val]) => ({
  key,
  name: val.name
}));

// Make locations list available in all templates
app.use((req, res, next) => {
  res.locals.allLocations = locationList;
  next();
});

// Landing page (no location)
app.get('/', (req, res) => {
  res.locals.title = 'Welcome to Our Locations';
  res.locals.location = null;
  res.render('landing');
});

// Dynamic route for all location pages
app.get('/:location/:page?', (req, res) => {
  const locationKey = req.params.location.toLowerCase();
  const page = (req.params.page || 'home').toLowerCase();

  // Validate location and page
  if (!locations[locationKey] || !subpages.includes(page)) {
    return res.status(404).send('Page not found');
  }

  // Check if the corresponding EJS template exists
  const templatePath = path.join(__dirname, 'views', `${page}.ejs`);
  if (!fs.existsSync(templatePath)) {
    return res.status(404).send('Template not found');
  }

  const location = locations[locationKey];

  // Make content available in templates
  res.locals.location = location.name;
  res.locals.tagline = location.tagline;
  res.locals.intro = location.intro;
  res.locals.title = `${location.name} – ${page.charAt(0).toUpperCase() + page.slice(1)}`;

  res.render(page);
});

// Run on cPanel's required IP
app.listen(process.env.PORT || 3000, '127.0.0.1', () => {
  console.log('Server running...');
});
