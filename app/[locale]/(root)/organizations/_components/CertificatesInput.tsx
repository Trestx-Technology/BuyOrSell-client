"use client";

import { useState } from "react";
import { Plus, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/app/(root)/post-ad/details/_components/TextInput";
import { FormField } from "@/app/(root)/post-ad/details/_components/FormField";
import { DatePicker } from "./DatePicker";
import { SingleImageUpload, SingleImageItem } from "./SingleImageUpload";

export interface Certificate {
  name: string;
  issuer: string;
  issuedOn: string; // YYYY-MM-DD
  expiresOn?: string; // YYYY-MM-DD
  fileId?: string;
  url?: string;
}

interface CertificatesInputProps {
  value?: Certificate[];
  onChange?: (certificates: Certificate[]) => void;
  disabled?: boolean;
}

export function CertificatesInput({
  value = [],
  onChange,
  disabled = false,
}: CertificatesInputProps) {
  const [certificates, setCertificates] = useState<Certificate[]>(value);
  const [certificateImages, setCertificateImages] = useState<
    Record<number, SingleImageItem | null>
  >({});

  const updateCertificates = (newCertificates: Certificate[]) => {
    setCertificates(newCertificates);
    onChange?.(newCertificates);
  };

  const addCertificate = () => {
    // Limit to max 5 certificates
    if (certificates.length >= 5) {
      return;
    }
    const newCert: Certificate = {
      name: "",
      issuer: "",
      issuedOn: "",
      expiresOn: "",
    };
    updateCertificates([...certificates, newCert]);
  };

  const removeCertificate = (index: number) => {
    // Remove associated image
    const newImages = { ...certificateImages };
    delete newImages[index];
    setCertificateImages(newImages);

    // Remove certificate
    updateCertificates(certificates.filter((_, i) => i !== index));
  };

  const updateCertificate = (
    index: number,
    field: keyof Certificate,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newValue: any
  ) => {
    const updated = certificates.map((cert, i) =>
      i === index ? { ...cert, [field]: newValue } : cert
    );
    updateCertificates(updated);
  };

  const handleImageChange = (index: number, image: SingleImageItem | null) => {
    setCertificateImages((prev) => ({ ...prev, [index]: image }));

    if (image?.presignedUrl) {
      updateCertificate(index, "url", image.presignedUrl);
      // fileId can be extracted from URL if needed, or left empty
      updateCertificate(index, "fileId", image.presignedUrl.split("/").pop() || "");
    } else {
      updateCertificate(index, "url", undefined);
      updateCertificate(index, "fileId", undefined);
    }
  };

  return (
    <div className="space-y-4">
      {certificates.map((cert, index) => (
        <div
          key={index}
          className="border border-[#E5E5E5] rounded-lg p-4 space-y-4 bg-white"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple" />
              <span className="text-sm font-medium text-[#1D2939]">
                Certificate {index + 1}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeCertificate(index)}
              disabled={disabled}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Certificate Name"
              htmlFor={`cert-name-${index}`}
              required
            >
              <TextInput
                value={cert.name}
                onChange={(value) =>
                  updateCertificate(index, "name", value)
                }
                placeholder="e.g., ISO 9001"
                disabled={disabled}
              />
            </FormField>

            <FormField label="Issuer" htmlFor={`cert-issuer-${index}`} required>
              <TextInput
                value={cert.issuer}
                onChange={(value) =>
                  updateCertificate(index, "issuer", value)
                }
                placeholder="e.g., Bureau Veritas"
                disabled={disabled}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Issued On"
              htmlFor={`cert-issued-${index}`}
              required
            >
              <DatePicker
                value={cert.issuedOn}
                onChange={(val) => updateCertificate(index, "issuedOn", val)}
                placeholder="Select issue date"
                disabled={disabled}
              />
            </FormField>

            <FormField label="Expires On" htmlFor={`cert-expires-${index}`}>
              <DatePicker
                value={cert.expiresOn || ""}
                onChange={(val) =>
                  updateCertificate(index, "expiresOn", val || undefined)
                }
                placeholder="Select expiry date (optional)"
                disabled={disabled}
              />
            </FormField>
          </div>

          <FormField
            label="Certificate File"
            htmlFor={`cert-file-${index}`}
            required
            error={
              !certificateImages[index]?.presignedUrl && !certificateImages[index]?.url
                ? "Certificate file is required"
                : undefined
            }
          >
            <SingleImageUpload
              image={certificateImages[index] || null}
              onImageChange={(image) => handleImageChange(index, image)}
              maxFileSize={10}
              acceptedFileTypes={["image/jpeg", "image/png", "application/pdf"]}
              disabled={disabled}
              label="Upload Certificate"
            />
          </FormField>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addCertificate}
        disabled={disabled || certificates.length >= 5}
        icon={<Plus className="w-4 h-4" />}
        iconPosition="center"
        className="w-full"
      >
        Add Certificate {certificates.length >= 5 ? "(Max 5)" : `(${certificates.length}/5)`}
      </Button>
    </div>
  );
}

