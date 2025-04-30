import axios, { CreateAxiosDefaults } from 'axios';

export const axiosConfig: CreateAxiosDefaults = {
  baseURL: 'https://localhost:7177/swagger',
};

export const axiosInstance = axios.create(axiosConfig);
