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

const updateProject = async (projectId, project) => {
      const query = `
        UPDATE public.service_project
        SET
          title = $2,
          description = $3,
          project_date = $4,
          location = $5,
          organization_id = $6
        WHERE project_id = $1
        RETURNING project_id;
      `;

      const result = await db.query(query, [
        projectId,
        project.title,
        project.description,
        project.date,
        project.location,
        project.organization_id
      ]);

      if (result.rows.length === 0) {
          throw new Error('Failed to update project');
      }

      return result.rows[0];
};

const createProject = async (project) => {
      const query = `
        INSERT INTO public.service_project
          (title, description, project_date, location, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
      `;

      const result = await db.query(query, [
        project.title,
        project.description,
        project.date,
        project.location,
        project.organization_id
      ]);

      if (result.rows.length === 0) {
          throw new Error('Failed to create project');
      }

      return result.rows[0].project_id;
};

const addProjectVolunteer = async (projectId, userId) => {
      await db.query(`
        INSERT INTO public.project_volunteers (project_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (project_id, user_id) DO NOTHING;
      `, [projectId, userId]);
};

const removeProjectVolunteer = async (projectId, userId) => {
      await db.query(`
        DELETE FROM public.project_volunteers
        WHERE project_id = $1 AND user_id = $2;
      `, [projectId, userId]);
};

const getProjectsVolunteeredByUser = async (userId) => {
      const query = `
        SELECT
          sp.project_id,
          sp.title,
          sp.description,
          sp.project_date::text AS date,
          sp.location,
          sp.organization_id,
          o.name AS organization_name
        FROM public.project_volunteers AS pv
        JOIN public.service_project AS sp
          ON sp.project_id = pv.project_id
        JOIN public.organization AS o
          ON o.organization_id = sp.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.project_date, sp.title;
      `;

      const result = await db.query(query, [userId]);
      return result.rows;
};

const isUserVolunteeringForProject = async (projectId, userId) => {
      const result = await db.query(`
        SELECT 1
        FROM public.project_volunteers
        WHERE project_id = $1 AND user_id = $2
        LIMIT 1;
      `, [projectId, userId]);

      return result.rows.length > 0;
};

// Export the model functions
export {
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByOrganizationId,
    createProject,
    updateProject,
    addProjectVolunteer,
    removeProjectVolunteer,
    getProjectsVolunteeredByUser,
    isUserVolunteeringForProject
};