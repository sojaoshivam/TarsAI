'use client';

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { LogOut, Cog, Download, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface SubscriptionInfo {
  plan: 'free' | 'pro';
  pdfCount: number;
  pdfLimit: number;
  isValid: boolean;
  currentPeriodEnd?: string;
}

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await axios.get('/api/subscription');
      return response.data as SubscriptionInfo;
    },
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await axios.post('/api/delete-account');
      await signOut();
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full min-h-full bg-[#0a0a0a] px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-2 sm:gap-3 mb-2">
            <Cog className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-cyan-400" />
            Settings
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400 mt-2">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        {user && (
          <Card className="bg-[#141414] border-gray-800 p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6 rounded-lg sm:rounded-xl">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">Profile</h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm text-gray-400">Email</label>
                <p className="text-sm sm:text-base text-white">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
              <div>
                <label className="text-xs sm:text-sm text-gray-400">Name</label>
                <p className="text-sm sm:text-base text-white">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Subscription Section */}
        <Card className="bg-[#141414] border-gray-800 p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6 rounded-lg sm:rounded-xl">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">Subscription</h2>
          {isLoading ? (
            <p className="text-xs sm:text-sm text-gray-400">Loading subscription info...</p>
          ) : subscriptionData ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Current Plan</p>
                  <p className="text-white capitalize text-base sm:text-lg font-semibold">
                    {subscriptionData.plan} Plan
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-400">Status</p>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-block ${
                      subscriptionData.isValid
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {subscriptionData.isValid ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-3 sm:pt-4">
                <p className="text-xs sm:text-sm text-gray-400 mb-2">PDF Usage</p>
                <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full"
                    style={{
                      width: `${(subscriptionData.pdfCount / subscriptionData.pdfLimit) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">
                  {subscriptionData.pdfCount} / {subscriptionData.pdfLimit} PDFs used
                </p>
              </div>

              {subscriptionData.plan === 'free' && (
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold mt-3 sm:mt-4 text-sm sm:text-base py-2 sm:py-3">
                  <Link href="/pricing">Upgrade to Pro</Link>
                </Button>
              )}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-400">Unable to load subscription info</p>
          )}
        </Card>

        {/* Preferences Section */}
        <Card className="bg-[#141414] border-gray-800 p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6 rounded-lg sm:rounded-xl">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">Preferences</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm sm:text-base text-white font-medium">Email Notifications</p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Receive updates about new features and improvements
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            </div>
          </div>
        </Card>

        {/* Data Section */}
        <Card className="bg-[#141414] border-gray-800 p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6 rounded-lg sm:rounded-xl">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">Data</h2>
          <div className="space-y-2 sm:space-y-3">
            <Button
              variant="outline"
              className="w-full border-gray-700 hover:bg-gray-800 text-xs sm:text-sm py-2 sm:py-3"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Export My Data
            </Button>
            <p className="text-xs text-gray-500">
              Download your data in JSON format
            </p>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-950/20 border-red-900/50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-red-400 mb-3 sm:mb-4">Danger Zone</h2>
          <div className="space-y-2 sm:space-y-3">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-gray-700 hover:bg-gray-800 text-xs sm:text-sm py-2 sm:py-3"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Sign Out
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm py-2 sm:py-3"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
            <p className="text-xs text-gray-500">
              This action is permanent and cannot be undone
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
