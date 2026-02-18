import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadToS3 } from './db/s3';
import { toast } from 'sonner';
import { FileUploadError } from './types';
import { validateFileUpload } from './validation';
import { PDF_CONFIG } from './constants';

interface FileUploadResult {
  file_key: string;
  file_name: string;
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<FileUploadError | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<FileUploadResult> => {
      // Validate file before upload
      const validation = validateFileUpload(file, {
        maxSize: PDF_CONFIG.MAX_SIZE,
        allowedTypes: PDF_CONFIG.ALLOWED_TYPES,
        allowedExtensions: PDF_CONFIG.ALLOWED_EXTENSIONS,
      });

      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid file');
      }

      setUploading(true);
      setError(null);

      try {
        const result = await uploadToS3(file);

        if (!result?.file_key || !result?.file_name) {
          throw new Error('Upload failed: Missing file key or name');
        }

        return result;
      } finally {
        setUploading(false);
      }
    },
    onError: (err: Error) => {
      const fileError: FileUploadError = {
        message: err.message || 'Failed to upload file',
        code: 'UPLOAD_ERROR',
      };
      setError(fileError);
      toast.error(fileError.message);
    },
  });

  return {
    upload: uploadMutation.mutate,
    uploading: uploadMutation.isPending || uploading,
    error,
    clearError: () => setError(null),
  };
}

interface SubscriptionData {
  plan: 'free' | 'pro';
  pdfCount: number;
  pdfLimit: number;
  isValid: boolean;
}

export function useSubscriptionCheck(subscriptionData: SubscriptionData | undefined) {
  const canUpload = (fileSize: number): { allowed: boolean; reason?: string } => {
    if (!subscriptionData) {
      return {
        allowed: false,
        reason: 'Unable to check subscription status',
      };
    }

    // Check file size
    if (fileSize > PDF_CONFIG.MAX_SIZE) {
      return {
        allowed: false,
        reason: `File size exceeds limit of ${PDF_CONFIG.MAX_SIZE / 1024 / 1024}MB`,
      };
    }

    // Check PDF limit
    if (subscriptionData.pdfCount >= subscriptionData.pdfLimit) {
      return {
        allowed: false,
        reason:
          subscriptionData.plan === 'free'
            ? 'Free plan limit reached! Upgrade to Pro for 10 PDFs per month.'
            : 'Monthly PDF limit reached. Limit resets next month.',
      };
    }

    return { allowed: true };
  };

  return { canUpload };
}
