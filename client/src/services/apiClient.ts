import axios from 'axios';

// The client and the API share one origin: the dev server forwards /api to the
// server. So paths are relative to /api, never a full URL or a port:
//   apiClient.get('/notes')  ->  GET /api/notes
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
