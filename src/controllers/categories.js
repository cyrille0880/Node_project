import {
    createCategory,
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    updateCategory
} from '../models/categories.js';

const validateCategoryName = (value) => {
    const name = typeof value === 'string' ? value.trim() : '';
    if (!name) return { name, error: 'Category name is required.' };
    if (name.length < 3) return { name, error: 'Category name must be at least 3 characters.' };
    if (name.length > 100) return { name, error: 'Category name must be 100 characters or fewer.' };
    return { name, error: null };
};

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
    const categoryId = req.params.id;

    if (!/^\d+$/.test(categoryId)) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const category = await getCategoryById(categoryId);

    if (!category) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const projects = await getProjectsByCategoryId(categoryId);
    res.render('category', { title: category.name, category, projects });
};

const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'Create New Category',
        name: '',
        error: null
    });
};

const processNewCategoryForm = async (req, res) => {
    const { name, error } = validateCategoryName(req.body.name);
    if (error) {
        return res.status(400).render('new-category', {
            title: 'Create New Category',
            name,
            error
        });
    }

    const categoryId = await createCategory(name);
    req.flash('success', 'Category created successfully.');
    res.redirect(`/category/${categoryId}`);
};

const showEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;
    if (!/^\d+$/.test(categoryId)) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const category = await getCategoryById(categoryId);
    if (!category) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    res.render('edit-category', { title: `Edit ${category.name}`, category, error: null });
};

const processEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;
    if (!/^\d+$/.test(categoryId)) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const category = await getCategoryById(categoryId);
    if (!category) {
        const error = new Error('Page Not Found');
        error.status = 404;
        return next(error);
    }

    const validation = validateCategoryName(req.body.name);
    if (validation.error) {
        return res.status(400).render('edit-category', {
            title: `Edit ${category.name}`,
            category: { ...category, name: validation.name },
            error: validation.error
        });
    }

    await updateCategory(categoryId, validation.name);
    req.flash('success', 'Category updated successfully.');
    res.redirect(`/category/${categoryId}`);
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};