/**
 * Centralized configuration constants for the application
 */

// PDF Configuration
export const PDF_CONFIG = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_CHUNK_SIZE: 1000,
  CHUNK_OVERLAP: 200,
  ALLOWED_TYPES: ['application/pdf'],
  ALLOWED_EXTENSIONS: ['.pdf'],
} as const;

// Pinecone Configuration
export const PINECONE_CONFIG = {
  TOP_K: 5, // Number of top results to retrieve
  NAMESPACE_PREFIX: 'pdf_',
} as const;

// Subscription Configuration
export const SUBSCRIPTION_CONFIG = {
  FREE_PLAN_PDF_LIMIT: 2,
  PRO_PLAN_PDF_LIMIT: 10,
  SUBSCRIPTION_VALIDITY_DAYS: 30,
} as const;

// API Configuration
export const API_CONFIG = {
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,
  REQUEST_TIMEOUT_MS: 30000,
} as const;

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  CHAT: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 30,
  },
  UPLOAD: {
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    MAX_REQUESTS: 10,
  },
  API: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 100,
  },
} as const;

// Message Configuration
export const MESSAGE_CONFIG = {
  MAX_LENGTH: 5000,
  HISTORY_LIMIT: 20, // Number of messages to keep in context
} as const;

// Gemini AI Configuration
export const AI_CONFIG = {
  MODEL: 'gemini-2.5-flash',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2048,
} as const;

// Database Configuration
export const DB_CONFIG = {
  BATCH_SIZE: 100,
  QUERY_TIMEOUT_MS: 30000,
} as const;

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
  S3_BUCKET: process.env.NEXT_PUBLIC_S3_BUCKET_NAME || '',
  S3_REGION: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
} as const;

// Authentication Configuration
export const AUTH_CONFIG = {
  SESSION_TIMEOUT_MS: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_TOKEN_THRESHOLD_MS: 60 * 60 * 1000, // 1 hour
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized. Please sign in.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  BAD_REQUEST: 'Invalid request. Please check your input.',
  INTERNAL_ERROR: 'An internal server error occurred. Please try again later.',
  RATE_LIMITED: 'Too many requests. Please try again later.',
  FILE_TOO_LARGE: `File size exceeds limit of ${PDF_CONFIG.MAX_SIZE / 1024 / 1024}MB.`,
  PDF_LIMIT_REACHED: 'You have reached your PDF upload limit for this month.',
  INVALID_FILE_TYPE: 'Only PDF files are allowed.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SUBSCRIPTION_CREATED: 'Subscription created successfully.',
  FILE_UPLOADED: 'File uploaded successfully.',
  CHAT_CREATED: 'Chat created successfully.',
  SUBSCRIPTION_UPDATED: 'Subscription updated successfully.',
} as const;
