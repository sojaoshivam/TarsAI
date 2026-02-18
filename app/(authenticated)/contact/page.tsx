'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.message.length < 10) {
      toast.error('Message must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-full bg-[#0a0a0a] px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-cyan-400" />
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12">
          {/* Support Card */}
          <Card className="bg-[#141414] border-gray-800 p-4 sm:p-5 md:p-6 text-center rounded-lg sm:rounded-xl">
            <div className="flex justify-center mb-3 sm:mb-4">
              <Mail className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-cyan-400" />
            </div>
            <h3 className="font-semibold text-white mb-1 sm:mb-2 text-base sm:text-lg">Email</h3>
            <p className="text-xs sm:text-sm text-gray-400">support@tarsai.com</p>
          </Card>

          {/* Response Time Card */}
          <Card className="bg-[#141414] border-gray-800 p-4 sm:p-5 md:p-6 text-center rounded-lg sm:rounded-xl">
            <div className="flex justify-center mb-3 sm:mb-4">
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-cyan-400" />
            </div>
            <h3 className="font-semibold text-white mb-1 sm:mb-2 text-base sm:text-lg">Response Time</h3>
            <p className="text-xs sm:text-sm text-gray-400">Within 24 hours</p>
          </Card>

          {/* Availability Card */}
          <Card className="bg-[#141414] border-gray-800 p-4 sm:p-5 md:p-6 text-center rounded-lg sm:rounded-xl sm:col-span-2 md:col-span-1">
            <div className="flex justify-center mb-3 sm:mb-4">
              <Send className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-cyan-400" />
            </div>
            <h3 className="font-semibold text-white mb-1 sm:mb-2 text-base sm:text-lg">Availability</h3>
            <p className="text-xs sm:text-sm text-gray-400">Mon - Fri, 9 AM - 6 PM EST</p>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="bg-[#141414] border-gray-800 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-white mb-4 sm:mb-6">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="bg-[#0a0a0a] border-gray-700 text-xs sm:text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="bg-[#0a0a0a] border-gray-700 text-xs sm:text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Feature request"
                className="bg-[#0a0a0a] border-gray-700 text-xs sm:text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind..."
                rows={6}
                className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg text-xs sm:text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 px-3 sm:px-4 py-2 sm:py-3 transition-all resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.message.length} characters (minimum 10)
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2 sm:py-3 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              We'll get back to you as soon as possible
            </p>
          </form>
        </Card>

        {/* FAQ Link */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
            Looking for quick answers?
          </p>
          <a
            href="/help"
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors text-xs sm:text-sm md:text-base"
          >
            Visit our Help Center →
          </a>
        </div>
      </div>
    </div>
  );
}
