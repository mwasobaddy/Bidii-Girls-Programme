const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, message: error.message };
  }
};

// Recent Activity
export const getRecentActivity = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/activity`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch recent activity');
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return { success: false, message: error.message };
  }
};

// Team Members
export const getAllTeamMembers = async () => {
  const response = await fetch(`${API_BASE_URL}/team`);
  if (!response.ok) throw new Error('Failed to fetch team members');
  return response.json();
};

export const createTeamMember = async (teamData) => {
  const response = await fetch(`${API_BASE_URL}/team`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(teamData),
  });
  if (!response.ok) throw new Error('Failed to create team member');
  return response.json();
};

export const updateTeamMember = async (id, teamData) => {
  const response = await fetch(`${API_BASE_URL}/team/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(teamData),
  });
  if (!response.ok) throw new Error('Failed to update team member');
  return response.json();
};

export const deleteTeamMember = async (id) => {
  const response = await fetch(`${API_BASE_URL}/team/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete team member');
  return response.json();
};
