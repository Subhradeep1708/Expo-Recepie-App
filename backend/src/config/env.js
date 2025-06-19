
import "dotenv/config";
export const env = {
    PORT: process.env.PORT || 8001,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV
}