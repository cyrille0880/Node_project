import db from './db.js'

const getUpcomingProjects = async (numberOfProjects) => {
    const query = `
        SELECT
          sp.project_id,
          sp.title,
          sp.description,
          sp.project_date::text AS date,
          sp.location,
          sp.organization_id,
          o.name AS organization_name
        FROM public.service_project AS sp
        JOIN public.organization AS o
          ON o.organization_id = sp.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date ASC
        LIMIT $1;
    `;

    const result = await db.query(query, [numberOfProjects]);

    return result.rows;
}




const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          project_date
        FROM public.service_project
        WHERE organization_id = $1
        ORDER BY project_date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getProjectDetails = async (projectId) => {
      const query = `
        SELECT
          sp.project_id,
          sp.title,
          sp.description,
          sp.project_date::text AS date,
          sp.location,
          sp.organization_id,
          o.name AS organization_name
        FROM public.service_project AS sp
        JOIN public.organization AS o
          ON o.organization_id = sp.organization_id
        WHERE sp.project_id = $1
        LIMIT 1;
      `;

      const result = await db.query(query, [projectId]);

      return result.rows[0] ?? null;
};

// Export the model functions
export { getUpcomingProjects, getProjectDetails, getProjectsByOrganizationId };