import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // 后端的基础路径
});

export default api;