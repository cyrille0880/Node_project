import express from 'express';
import { showOrganizationDetailsPage } from './controllers/organizations.js';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import {
	addVolunteerToProject,
	processEditProjectForm,
	processNewProjectForm,
	removeVolunteerFromProject,
	showEditProjectForm,
	showNewProjectForm,
	showProjectDetailsPage,
	showProjectsPage
} from './controllers/project.js';
import {
	processEditCategoryForm,
	processNewCategoryForm,
	processAssignCategoriesForm,
	showCategoriesPage,
	showCategoryDetailsPage,
	showAssignCategoriesForm,
	showEditCategoryForm,
	showNewCategoryForm
} from './controllers/categories.js';
import {
	processEditOrganizationForm,
	processNewOrganizationForm,
    organizationValidation,
	showEditOrganizationForm,
	showNewOrganizationForm
} from './controllers/organizations.js';
import { testErrorPage } from './controllers/errors.js';
import {
	processLoginForm,
	processLogout,
	processUserRegistrationForm,
	showDashboard,
	showLoginForm,
	showUserRegistrationForm
} from './controllers/users.js';
import requireLogin from './middleware/requireLogin.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.post('/logout', requireLogin, processLogout);
router.get('/dashboard', requireLogin, showDashboard);
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/organizations', showOrganizationsPage);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', processEditOrganizationForm);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', processNewProjectForm);
router.get('/projects', showProjectsPage);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', processEditProjectForm);
router.post('/project/:id/volunteer', requireLogin, addVolunteerToProject);
router.post('/project/:id/unvolunteer', requireLogin, removeVolunteerFromProject);
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);
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
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
// error-handling routes
router.get('/test-error', testErrorPage);

export default router;