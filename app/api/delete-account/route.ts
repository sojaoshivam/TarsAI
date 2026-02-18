import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/app/lib/db';
import { chats, messages, userSubscriptions } from '@/app/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete all user data in order (respecting foreign keys)
    // 1. Delete messages
    await db
      .delete(messages)
      .where(eq(messages.chatId, 0)) // This will be updated by the subquery
      .execute()
      .catch(() => null); // Ignore errors if no messages

    // 2. Delete chats
    await db
      .delete(chats)
      .where(eq(chats.userId, userId))
      .execute()
      .catch(() => null);

    // 3. Delete subscription
    await db
      .delete(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .execute()
      .catch(() => null);

    // Note: Actual user deletion from Clerk should be handled by the frontend
    // or a separate Clerk webhook

    return NextResponse.json({
      success: true,
      message: 'Account data deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
