import { NextResponse } from 'next/server';
import {
  withErrorHandler,
  withMethodCheck,
  successResponse,
  errorResponse,
} from '@/app/lib/api-middleware';
import { validateRequiredFields, validateEmail } from '@/app/lib/validation';
import { auth } from '@clerk/nextjs/server';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

async function handleContactForm(req: Request) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const body = (await req.json()) as unknown;

    // Validate required fields
    const data = body as Record<string, unknown>;
    const validation = validateRequiredFields(data, [
      'name',
      'email',
      'subject',
      'message',
    ]);

    if (!validation.isValid) {
      return errorResponse(validation.error || 'Missing required fields', 400);
    }

    // Safe type assertion after validation
    const formData: ContactFormData = {
      name: String(data.name),
      email: String(data.email),
      subject: String(data.subject),
      message: String(data.message),
    };

    // Validate email format
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      return errorResponse(emailValidation.error || 'Invalid email', 400);
    }

    // Validate message length
    if (formData.message.length < 10 || formData.message.length > 5000) {
      return errorResponse(
        'Message must be between 10 and 5000 characters',
        400
      );
    }

    // Get optional user ID
    const { userId } = await auth();

    // TODO: Save contact form to database or send email
    // For now, just log it
    console.log('Contact form submission:', {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      userId,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send email to support team
    // await sendEmail({
    //   to: 'support@tarsai.com',
    //   subject: `New Contact Form: ${formData.subject}`,
    //   template: 'contact-form',
    //   data: { name: formData.name, email: formData.email, subject: formData.subject, message: formData.message, userId },
    // });

    return successResponse(
      {
        success: true,
        message: 'Contact form submitted successfully',
      },
      200
    );
  } catch (error) {
    console.error('Contact form error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return errorResponse(message, 500);
  }
}

export const POST = withErrorHandler(handleContactForm);
