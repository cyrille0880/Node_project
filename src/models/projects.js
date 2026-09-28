import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT project_id, organization_id, title, description, location, project_date
      FROM public.service_project;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}