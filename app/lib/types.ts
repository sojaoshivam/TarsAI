// Message content types
export interface TextPart {
  type: 'text';
  text: string;
}

export interface ImagePart {
  type: 'image';
  image: string;
}

// Add these to match AI SDK types
export interface ReasoningPart {
  type: 'reasoning';
  reasoning?: string;
  details?: Array<{ type: 'text', text: string }>;
  text?: string;
  [key: string]: any;
}

export interface ToolInvocationPart {
  type: 'tool-invocation';
  toolInvocation: any;
}

export type ContentPart = TextPart | ImagePart | ReasoningPart | ToolInvocationPart;

// Message types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | ContentPart[];
  parts?: ContentPart[]; // Legacy format support
}

export interface SanitizedMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Component props
export interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface FileUploadError {
  message: string;
  code?: string;
}
