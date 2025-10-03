"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import Link from "next/link";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });

  const handleInputChange =
    (field: keyof typeof formData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Here you would typically make an API call to send the message
    console.log("Sending contact message:", formData);
    alert("Thank you for your message! We'll get back to you soon.");

    // Reset form
    setFormData({
      name: "",
      email: "",
      category: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-grey-50">
      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant={"ghost"}
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size={"icon-sm"}
          className="absolute left-4 text-purple"
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          Contact us
        </Typography>
      </div>
      <div className="sm:px-4 xl:px-0 flex flex-col gap-5 sm:py-8">
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href={"/?login=true"}
            className="text-gray-400 font-semibold text-sm hover:text-purple"
          >
            Home
          </Link>
          <ChevronsRight className="size-6 text-purple" />
          <Link
            href={"/contact-us"}
            className="text-purple-600 font-semibold text-sm"
          >
            Contact us
          </Link>
        </div>

        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="bg-white sm:rounded-2xl sm:shadow-2xl overflow-hidden">
              <div className="sm:bg-gradient-to-br from-purple-600 to-purple-800 flex justify-between gap-0 sm:p-8 lg:p-12">
                {/* Left Side - Contact Info */}
                <div className="hidden sm:block w-full max-w-lg text-white">
                  <div className="h-full flex flex-col justify-center">
                    {/* Heading */}
                    <div className="mb-6">
                      <h1 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                        Send us
                        <br />a Message
                      </h1>
                      <p className="text-lg text-purple-100 drop-shadow-sm leading-relaxed">
                        Let&apos;s make your vision a reality. Contact us today
                        and let&apos;s discuss how we can help you innovate and
                        grow.
                      </p>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-xl font-semibold mb-6 drop-shadow-lg">
                        Contact Info
                      </h3>
                      <div className="space-y-4">
                        {/* Email */}
                        <div className="flex items-center gap-3 drop-shadow-sm">
                          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-purple-100">
                              buyrorsell@gmail.com
                            </p>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-3 drop-shadow-sm">
                          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-purple-100">+971 2662262622</p>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-3 drop-shadow-sm">
                          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-purple-100">Dubai</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Contact Form */}
                <div className="p-8 rounded-lg bg-white w-full sm:max-w-sm">
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange("name")}
                        placeholder="Your Full Name"
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange("email")}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          value={formData.category}
                          onChange={handleInputChange("category")}
                          className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm appearance-none pr-10"
                        >
                          <option value="">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="sales">Sales Inquiry</option>
                          <option value="partnership">Partnership</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange("subject")}
                        placeholder="Brief Description of your inquiry"
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Message *
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={handleInputChange("message")}
                        placeholder="Please provide details about your inquiry..."
                        rows={4}
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm resize-vertical"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 text-base font-medium transition-colors"
                      >
                        Send Message
                      </Button>
                    </div>
                  </form>

                  <div className="p-2 bg-purple-100 my-4 rounded-lg block sm:hidden">
                    <h3 className="text-sm text-purple font-semibold mb-2 drop-shadow-lg">
                      Response Time
                    </h3>
                    <p className="text-xs">
                      We typically respond to messages within 24 hours during
                      business days. For urgent matters, please call us
                      directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
