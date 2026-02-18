export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: readonly string[];
  allowedExtensions?: readonly string[];
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const DEFAULT_MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_PDF_TYPES = ['application/pdf'];
const ALLOWED_EXTENSIONS = ['.pdf'];

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File,
  options: FileValidationOptions = {}
): ValidationResult {
  const {
    maxSize = DEFAULT_MAX_FILE_SIZE,
    allowedTypes = ALLOWED_PDF_TYPES,
    allowedExtensions = ALLOWED_EXTENSIONS,
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds limit of ${maxSize / 1024 / 1024}MB`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidExtension) {
    return {
      isValid: false,
      error: `Invalid file extension. Allowed: ${allowedExtensions.join(', ')}`,
    };
  }

  return { isValid: true };
}

/**
 * Validate chat message input
 */
export function validateChatMessage(message: string): ValidationResult {
  if (!message || typeof message !== 'string') {
    return {
      isValid: false,
      error: 'Invalid message format',
    };
  }

  if (message.trim().length === 0) {
    return {
      isValid: false,
      error: 'Message cannot be empty',
    };
  }

  if (message.length > 5000) {
    return {
      isValid: false,
      error: 'Message is too long (max 5000 characters)',
    };
  }

  return { isValid: true };
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email address',
    };
  }

  return { isValid: true };
}

/**
 * Validate required fields in object
 */
export function validateRequiredFields(
  obj: Record<string, unknown>,
  requiredFields: string[]
): ValidationResult {
  const missingFields = requiredFields.filter((field) => !obj[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Missing required fields: ${missingFields.join(', ')}`,
    };
  }

  return { isValid: true };
}
