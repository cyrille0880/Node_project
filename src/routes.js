import express from 'express';
import { showOrganizationDetailsPage } from './controllers/organizations.js';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import {
	processEditProjectForm,
	processNewProjectForm,
	showEditProjectForm,
	showNewProjectForm,
	showProjectDetailsPage,
	showProjectsPage
} from './controllers/project.js';
import {
	processEditCategoryForm,
	processNewCategoryForm,
	showCategoriesPage,
	showCategoryDetailsPage,
	showEditCategoryForm,
	showNewCategoryForm
} from './controllers/categories.js';
import {
	processEditOrganizationForm,
	processNewOrganizationForm,
	showEditOrganizationForm,
	showNewOrganizationForm
} from './controllers/organizations.js';
import { testErrorPage } from './controllers/errors.js';
const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', processEditOrganizationForm);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', processNewProjectForm);
router.get('/projects', showProjectsPage);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', processEditProjectForm);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', processNewCategoryForm);
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', processEditCategoryForm);
router.get('/category/:id', showCategoryDetailsPage);
// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);
// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', processNewOrganizationForm);
// error-handling routes
router.get('/test-error', testErrorPage);

export default router;