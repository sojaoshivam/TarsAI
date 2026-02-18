import crypto from 'crypto';

/**
 * Verify Stripe webhook signature
 * @param body The raw request body
 * @param signature The signature header from the request
 * @param secret The webhook secret from Stripe
 * @returns true if signature is valid, false otherwise
 */
export function verifyStripeSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hash = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    const signatureHash = signature.split(',')[0].split('=')[1];
    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(signatureHash)
    );
  } catch (error) {
    console.error('Stripe signature verification failed:', error);
    return false;
  }
}

/**
 * Verify Dodo Payments webhook signature
 * @param body The raw request body
 * @param signature The signature header from the request
 * @param secret The webhook secret from Dodo
 * @returns true if signature is valid, false otherwise
 */
export function verifyDodoSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hash = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error('Dodo signature verification failed:', error);
    return false;
  }
}

/**
 * Extract webhook secret from environment based on provider
 */
export function getWebhookSecret(provider: 'stripe' | 'dodo'): string | null {
  if (provider === 'stripe') {
    return process.env.STRIPE_WEBHOOK_SECRET || null;
  } else if (provider === 'dodo') {
    return process.env.DODO_WEBHOOK_SECRET || null;
  }
  return null;
}
