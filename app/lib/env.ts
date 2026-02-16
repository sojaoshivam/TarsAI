
const requiredEnvVars = [
    "DATABASE_URL",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "NEXT_PUBLIC_S3_ACCESS_KEY_ID",
    "NEXT_PUBLIC_S3_SECRET_KEY",
    "NEXT_PUBLIC_S3_BUCKET_NAME",
    "PINECONE_API_KEY",
    "PINECONE_INDEX",
    "GOOGLE_GENERATIVE_AI_API_KEY",
    "STRIPE_API_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_BASE_URL"
];

export function validateEnv() {
    const missing = requiredEnvVars.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(", ")}`
        );
    }
}
