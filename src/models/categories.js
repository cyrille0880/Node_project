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

export { getAllProjectCategories };