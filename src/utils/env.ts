/**
 * This code is exporting a constant named 'isDev' which is set from the value of process.env.DEV.
 * This allows the code to access the value of this environment variable from other files and vue templates.
 */
export const isDev = process.env.DEV;

/**
 * This code is exporting a constant named 'isProd' which is set from the value of process.env.PROD.
 * This allows the code to access the value of this environment variable from other files and vue templates.
 */
export const isProd = process.env.PROD;
