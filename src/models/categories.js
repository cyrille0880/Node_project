import db from './db.js';

const getAllProjectCategories = async () => {
    const query = `
        SELECT project_id, category_id
        FROM public.project_category;
    `;

    const result = await db.query(query);

    return result.rows;
};

export { getAllProjectCategories };