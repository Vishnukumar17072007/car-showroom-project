const required = ['PORT', 'MONGO_URI', 'JWT_SECRET'];

function validateEnv() {
    for (const key of required) {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    }
    if (process.env.JWT_SECRET.length < 16) {
        throw new Error('JWT_SECRET must be at least 16 characters');
    }
}

module.exports = { validateEnv };
