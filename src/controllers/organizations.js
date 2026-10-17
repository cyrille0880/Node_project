
import { body, validationResult } from 'express-validator';
import {
    createOrganization,
    getAllOrganizations,
    getOrganizationDetails,
    updateOrganization
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

const validateOrganization = ({ name, description, contactEmail }) => {
    if (!name) return 'Organization name is required.';
    if (name.length < 3 || name.length > 150) return 'Organization name must be between 3 and 150 characters.';
    if (!description) return 'Description is required.';
    if (!contactEmail || contactEmail.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
        return 'Enter a valid contact email address (maximum 255 characters).';
    }
    return null;
};

const getOrganizationFormData = (body) => ({
    name: typeof body.name === 'string' ? body.name.trim() : '',
    description: typeof body.description === 'string' ? body.description.trim() : '',
    contactEmail: typeof body.contactEmail === 'string' ? body.contactEmail.trim() : ''
});
// Define any controller functions
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};


const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', {title, organizationDetails, projects});
};




const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', {
        title,
        formData: { name: '', description: '', contactEmail: '' },
        error: null
    });
};

const processNewOrganizationForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations    

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${organizationId}`);
};

const showEditOrganizationForm = async (req, res, next) => {
    const organizationId = req.params.id;

    if (!/^\d+$/.test(organizationId)) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const organization = await getOrganizationDetails(organizationId);
    if (!organization) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    res.render('edit-organization', {
        title: `Edit ${organization.name}`,
        organization,
        error: null
    });
};

const processEditOrganizationForm = async (req, res, next) => {
    const organizationId = req.params.id;

    if (!/^\d+$/.test(organizationId)) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const organization = await getOrganizationDetails(organizationId);
    if (!organization) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const formData = getOrganizationFormData(req.body);
    const validationError = validateOrganization(formData);
    if (validationError) {
        return res.status(400).render('edit-organization', {
            title: `Edit ${organization.name}`,
            organization: { ...organization, ...formData },
            error: validationError
        });
    }

    await updateOrganization(
        organizationId,
        formData.name,
        formData.description,
        formData.contactEmail
    );
    req.flash('success', 'Organization updated successfully.');
    res.redirect(`/organization/${organizationId}`);
};

// Export any controller functions
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};