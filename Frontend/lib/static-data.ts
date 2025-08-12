// Static data for build-time generation
// This data comes from the Backend database and should be updated when new content is added

export const STATIC_IDS = {
  campaigns: [
    { id: '1' },
    { id: '2' }
  ],
  projects: [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ],
  blogPosts: [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ]
};

// Helper function to get campaign IDs for static generation
export function getCampaignStaticParams() {
  return STATIC_IDS.campaigns;
}

// Helper function to get project IDs for static generation
export function getProjectStaticParams() {
  return STATIC_IDS.projects;
}

// Helper function to get blog post IDs for static generation
export function getBlogPostStaticParams() {
  return STATIC_IDS.blogPosts;
}