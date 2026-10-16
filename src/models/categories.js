import db from './db.js';

const getAllProjectCategories = async () => {
    const query = `
        SELECT
            pc.project_id,
            sp.title AS project_title,
            pc.category_id,
            c.name AS category_name
        FROM public.project_category AS pc
        JOIN public.service_project AS sp
            ON sp.project_id = pc.project_id
        JOIN public.category AS c
            ON c.category_id = pc.category_id
        ORDER BY c.name, sp.title;
    `;

    const result = await db.query(query);

    return result.rows;
};

const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1
        LIMIT 1;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows[0] ?? null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.category AS c
        JOIN public.project_category AS pc
            ON pc.category_id = c.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date::text AS date,
            sp.location,
            sp.organization_id
        FROM public.service_project AS sp
        JOIN public.project_category AS pc
            ON pc.project_id = sp.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.project_date, sp.title;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
};

export {
    getAllProjectCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId
};