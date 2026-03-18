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
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { useSubmitContactForm } from "@/hooks/useContactUs";
import { toast } from "sonner";
import { Container1080 } from "@/components/layouts/container-1080";

export const ContactUsContent = () => {
  const { localePath, t } = useLocale();
  const ct = t.contactUs;
  const router = useRouter();
  const submitContactMutation = useSubmitContactForm();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    message: "",
    orderId: "",
  });

  const handleInputChange =
    (field: keyof typeof formData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(ct.messages.requiredFields);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(ct.messages.invalidEmail);
      return;
    }

    try {
      await submitContactMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        category: formData.category || undefined,
        subject: formData.subject || undefined,
        message: formData.message,
        orderId: formData.orderId || undefined,
      });

      toast.success(ct.messages.success);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        subject: "",
        message: "",
        orderId: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(ct.messages.error);
    }
  };

  const handleBack = () => {
    router.push(localePath("/"));
  };

  return (
    <Container1080 className="bg-grey-50">
      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant={"ghost"}
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size={"icon-sm"}
          className="absolute left-4 text-purple"
          onClick={handleBack}
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          {ct.title}
        </Typography>
      </div>
      <div className="sm:px-4 xl:px-0 flex flex-col gap-5 sm:py-8">
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href={localePath("/")}
            className="text-gray-400 font-semibold text-sm hover:text-purple"
          >
            {ct.breadcrumb.home}
          </Link>
          <ChevronsRight className="size-6 text-purple" />
          <Link
            href={localePath("/contact-us")}
            className="text-purple-600 font-semibold text-sm"
          >
            {ct.breadcrumb.contactUs}
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
                        {ct.title}
                      </h1>
                      <p className="text-lg text-purple-100 drop-shadow-sm leading-relaxed">
                        {ct.subtitle}
                      </p>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-xl font-semibold mb-6 drop-shadow-lg">
                        {ct.info.title}
                      </h3>
                      <div className="space-y-4">
                        {/* Email */}
                        <div className="flex items-center gap-3 drop-shadow-sm">
                          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-purple-100">
                              {ct.info.email}
                            </p>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-3 drop-shadow-sm">
                          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-purple-100">{ct.info.phone}</p>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-3 drop-shadow-sm">
                          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-purple-100">{ct.info.address}</p>
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
                        {ct.form.name}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange("name")}
                        placeholder={ct.form.namePlaceholder}
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {ct.form.email}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange("email")}
                        placeholder={ct.form.emailPlaceholder}
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {ct.form.phone}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange("phone")}
                        placeholder={ct.form.phonePlaceholder}
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {ct.form.category}
                      </label>
                      <div className="relative">
                        <select
                          value={formData.category}
                          onChange={handleInputChange("category")}
                          className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm appearance-none pr-10"
                        >
                          <option value="">{ct.form.categories.general}</option>
                          <option value="support">{ct.form.categories.support}</option>
                          <option value="sales">{ct.form.categories.sales}</option>
                          <option value="partnership">{ct.form.categories.partnership}</option>
                          <option value="feedback">{ct.form.categories.feedback}</option>
                          <option value="other">{ct.form.categories.other}</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {ct.form.subject}
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange("subject")}
                        placeholder={ct.form.subjectPlaceholder}
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                      />
                    </div>

                    {/* Order ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {ct.form.orderId}
                      </label>
                      <input
                        type="text"
                        value={formData.orderId}
                        onChange={handleInputChange("orderId")}
                        placeholder={ct.form.orderIdPlaceholder}
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {ct.form.message}
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={handleInputChange("message")}
                        placeholder={ct.form.messagePlaceholder}
                        rows={4}
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm resize-vertical"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={submitContactMutation.isPending}
                        className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitContactMutation.isPending
                          ? ct.form.sending
                          : ct.form.submit}
                      </Button>
                    </div>
                  </form>

                  <div className="p-2 bg-purple-100 my-4 rounded-lg block sm:hidden">
                    <h3 className="text-sm text-purple font-semibold mb-2 drop-shadow-lg">
                      {ct.responseTime.title}
                    </h3>
                    <p className="text-xs">
                      {ct.responseTime.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container1080>
  );
};
