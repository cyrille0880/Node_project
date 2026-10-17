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

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
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

const createCategory = async (name) => {
    const query = `
        INSERT INTO public.category (name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [name]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE public.category
        SET name = $2
        WHERE category_id = $1
        RETURNING category_id;
    `;

    const result = await db.query(query, [categoryId, name]);

    if (result.rows.length === 0) {
        throw new Error('Failed to update category');
    }

    return result.rows[0].category_id;
};

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO public.project_category (project_id, category_id)
        VALUES ($1, $2)
        ON CONFLICT (project_id, category_id) DO NOTHING;
    `;

    await db.query(query, [projectId, categoryId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    if (!Array.isArray(categoryIds)) {
        throw new TypeError('categoryIds must be an array');
    }

    const uniqueCategoryIds = [...new Set(categoryIds)];

    await db.query(
        'DELETE FROM public.project_category WHERE project_id = $1;',
        [projectId]
    );

    for (const categoryId of uniqueCategoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};

export {
    getAllProjectCategories,
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    createCategory,
    updateCategory,
    updateCategoryAssignments
};