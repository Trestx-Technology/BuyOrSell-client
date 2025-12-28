import { useMutation } from "@tanstack/react-query";
import {
  submitContactForm,
  ContactUsPayload,
  ContactUsResponse,
} from "@/app/api/contact-us/contact-us.services";

// ============================================================================
// MUTATION HOOKS
// ============================================================================

// Submit contact form
export const useSubmitContactForm = () => {
  return useMutation<ContactUsResponse, Error, ContactUsPayload>({
    mutationFn: submitContactForm,
  });
};
