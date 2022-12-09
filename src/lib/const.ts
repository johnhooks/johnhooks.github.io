import { dev } from "$app/environment";

/**
 * The root url of the site.
 *
 * ? This isn't a prefect system but might work for now.
 */
export const BASE_URL = dev ? "http://localhost:5173" : "https://johnhooks.io";
