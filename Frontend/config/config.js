// Base backend URL
const BASE_API_URL = "http://127.0.0.1:8000";

const FRONTEND_BASE_URL = window.location.origin;
console.log("Frontend Base URL:", FRONTEND_BASE_URL);
const BASE_FRONTEND_URL = `${FRONTEND_BASE_URL}/frontend`;

export default {
    BASE_API_URL,
    BASE_FRONTEND_URL
};
