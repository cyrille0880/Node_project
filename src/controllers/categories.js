import { getAllProjectCategories } from '../models/categories.js';

const showCategoriesPage = async (req, res) => {
    const categories = await getAllProjectCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

export { showCategoriesPage };