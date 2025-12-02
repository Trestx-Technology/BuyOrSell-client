export const skillsQueries = {
  createSkill: {
    Key: ['skill', 'create'],
    endpoint: '/skills',
  },
  getAllSkills: {
    Key: ['skills'],
    endpoint: '/skills',
  },
  getSkillById: (id: string) => ({
    Key: ['skill', id],
    endpoint: `/skills/${id}`,
  }),
  updateSkill: (id: string) => ({
    Key: ['skill', id, 'update'],
    endpoint: `/skills/${id}`,
  }),
  deleteSkill: (id: string) => ({
    Key: ['skill', id, 'delete'],
    endpoint: `/skills/${id}`,
  }),
  searchSkills: {
    Key: ['skills', 'search'],
    endpoint: '/skills/search',
  },
};

