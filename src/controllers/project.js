// Import any needed model functions
import {
    createProject,
    getUpcomingProjects,
    getProjectDetails,
    updateProject
} from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const getProjectFormData = (body) => ({
    title: typeof body.title === 'string' ? body.title.trim() : '',
    description: typeof body.description === 'string' ? body.description.trim() : '',
    date: typeof body.date === 'string' ? body.date : '',
    location: typeof body.location === 'string' ? body.location.trim() : '',
    organization_id: typeof body.organization_id === 'string' ? body.organization_id : ''
});

const validateProjectFormData = (project, organizations) => {
    if (!project.title) return 'Project title is required.';
    if (project.title.length > 255) return 'Project title must be 255 characters or fewer.';
    if (!project.location) return 'Project location is required.';
    if (project.location.length > 255) return 'Project location must be 255 characters or fewer.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(project.date)) return 'Enter a valid project date.';

    const parsedDate = new Date(`${project.date}T00:00:00.000Z`);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== project.date) {
        return 'Enter a valid project date.';
    }

    if (!/^\d+$/.test(project.organization_id)
        || !organizations.some((organization) => String(organization.organization_id) === project.organization_id)) {
        return 'Select a valid partner organization.';
    }
    return null;
};

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};  

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    res.render('new-project', {
        title: 'Create New Service Project',
        project: { title: '', description: '', date: '', location: '', organization_id: '' },
        organizations,
        error: null
    });
};

const processNewProjectForm = async (req, res) => {
    const project = getProjectFormData(req.body);
    const organizations = await getAllOrganizations();
    const error = validateProjectFormData(project, organizations);

    if (error) {
        return res.status(400).render('new-project', {
            title: 'Create New Service Project', project, organizations, error
        });
    }

    const projectId = await createProject({
        ...project,
        description: project.description || null
    });
    res.redirect(`/project/${projectId}`);
};

const showProjectDetailsPage = async (req, res, next) => {
    const projectId = req.params.id;

    if (!/^\d+$/.test(projectId)) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const project = await getProjectDetails(projectId);

    if (!project) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const categories = await getCategoriesByProjectId(projectId);
    res.render('project', { title: project.title, project, categories });
};  

const showEditProjectForm = async (req, res, next) => {
    const projectId = req.params.id;

    if (!/^\d+$/.test(projectId)) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const project = await getProjectDetails(projectId);

    if (!project) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const organizations = await getAllOrganizations();
    res.render('edit-project', {
        title: `Edit ${project.title}`,
        project,
        organizations,
        error: null
    });
};

const processEditProjectForm = async (req, res, next) => {
    const projectId = req.params.id;
    const { title, description, date, location, organization_id: organizationId } = req.body;

    if (!/^\d+$/.test(projectId)) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const existingProject = await getProjectDetails(projectId);
    if (!existingProject) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const project = getProjectFormData({ title, description, date, location, organization_id: organizationId });
    const organizations = await getAllOrganizations();
    const validationError = validateProjectFormData(project, organizations);
    if (validationError) {
        return res.status(400).render('edit-project', {
            title: `Edit ${existingProject.title}`,
            project: { ...existingProject, ...project },
            organizations,
            error: validationError
        });
    }

    const updatedProject = await updateProject(projectId, {
        ...project,
        description: project.description || null
    });

    if (!updatedProject) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    res.redirect(`/project/${updatedProject.project_id}`);
};

// Export any controller functions
export {
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    showProjectDetailsPage,
    showProjectsPage
};