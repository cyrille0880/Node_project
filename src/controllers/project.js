// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
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

// Export any controller functions
export { showProjectDetailsPage, showProjectsPage };