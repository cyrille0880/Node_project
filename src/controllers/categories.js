import {
    getAllProjectCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

const showCategoriesPage = async (req, res) => {
    const categories = await getAllProjectCategories();
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

export { showCategoriesPage, showCategoryDetailsPage };