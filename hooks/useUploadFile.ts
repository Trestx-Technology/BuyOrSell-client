import { useState, useCallback } from "react";
import { uploadFile } from "@/app/api/media/media.services";
import { toast } from "sonner";
import { AxiosError } from "axios";

export interface UseUploadFileOptions {
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  onSuccess?: (fileUrl: string) => void;
  onError?: (error: string) => void;
  autoUpload?: boolean; // Auto-upload when file is selected
}

export interface UseUploadFileReturn {
  upload: (file: File) => Promise<string | null>;
  isUploading: boolean;
  fileUrl: string | null;
  error: string | null;
  reset: () => void;
  validateFile: (file: File) => boolean;
}

export function useUploadFile(options: UseUploadFileOptions = {}): UseUploadFileReturn {
  const {
    maxFileSize = 5,
    acceptedFileTypes = ["image/jpeg", "image/png", "image/gif"],
    onSuccess,
    onError,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file type
      if (!acceptedFileTypes.includes(file.type)) {
        const errorMsg = `File type ${file.type} not accepted. Accepted types: ${acceptedFileTypes.join(", ")}`;
        toast.error(errorMsg);
        setError(errorMsg);
        return false;
      }

      // Check file size
      const maxSizeBytes = maxFileSize * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        const errorMsg = `File size exceeds ${maxFileSize}MB limit`;
        toast.error(errorMsg);
        setError(errorMsg);
        return false;
      }

      return true;
    },
    [acceptedFileTypes, maxFileSize]
  );

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      // Validate file first
      if (!validateFile(file)) {
        return null;
      }

      setIsUploading(true);
      setError(null);

      try {
        const response = await uploadFile(file);
        const uploadedUrl = response.data.fileUrl;
        setFileUrl(uploadedUrl);
        onSuccess?.(uploadedUrl);
        toast.success("File uploaded successfully");
        return uploadedUrl;
      } catch (err) {
        console.error("Upload error:", err);
        const axiosError = err as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError?.response?.data?.message || "Failed to upload file";
        setError(errorMessage);
        onError?.(errorMessage);
        toast.error(`Failed to upload file: ${errorMessage}`);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [validateFile, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setFileUrl(null);
    setError(null);
    setIsUploading(false);
  }, []);

  return {
    upload,
    isUploading,
    fileUrl,
    error,
    reset,
    validateFile,
  };
}

