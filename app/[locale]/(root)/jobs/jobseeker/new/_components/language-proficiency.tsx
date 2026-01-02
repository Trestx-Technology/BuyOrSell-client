"use client";

import React, { useEffect, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import {
  useGetJobseekerProfile,
  useReplaceLanguagesByUserId,
} from "@/hooks/useJobseeker";
import {
  languagesFormSchema,
  type LanguagesFormSchemaType,
} from "@/schemas/jobseeker.schema";
import { toast } from "sonner";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";

type LanguageFormData = {
  languages?: Array<{
    _id?: string;
    name?: string;
    proficiency?: string;
    readLevel?: number;
    writeLevel?: number;
    speakLevel?: number;
  }>;
};

export default function LanguageProficiency() {
  const { data: profileData, isLoading: isLoadingProfile } =
    useGetJobseekerProfile();
  const { mutate: replaceLanguages, isPending: isSubmitting } =
    useReplaceLanguagesByUserId();

  const form = useForm<LanguageFormData>({
    resolver: zodResolver(languagesFormSchema),
    defaultValues: {
      languages: [],
    },
  });

  const { handleSubmit, control, formState, register } = form;
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });

  // Load initial data from profile
  useEffect(() => {
    if (profileData?.data?.profile && !isLoadingProfile) {
      const profile = profileData.data.profile;
      const languages = profile.languages || [];
      const formLanguages = languages.map((lang) => ({
        _id: lang._id,
        name: lang.name,
        proficiency: lang.proficiency,
        readLevel: lang.readLevel,
        writeLevel: lang.writeLevel,
        speakLevel: lang.speakLevel,
      }));

      form.reset({
        languages: formLanguages,
      });
    }
  }, [profileData, isLoadingProfile, form]);

  const languageOptions = [
    "English",
    "Arabic",
    "Hindi",
    "Urdu",
    "French",
    "Spanish",
    "German",
    "Chinese",
    "Japanese",
    "Portuguese",
    "Italian",
    "Russian",
  ];

  const proficiencyLevels = [
    { value: "basic", label: "Basic" },
    { value: "conversational", label: "Conversational" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "fluent", label: "Fluent" },
    { value: "native", label: "Native" },
  ];

  const onSubmit = useCallback(
    (data: LanguageFormData) => {
      const userId = profileData?.data?.profile?.userId;
      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      const languages = (data.languages || []).map((lang) => {
        const language: Record<string, unknown> = {
          ...(lang._id && { _id: lang._id }),
          name: lang.name || "",
          proficiency: lang.proficiency || "",
        };

        if (lang.readLevel !== undefined) language.readLevel = lang.readLevel;
        if (lang.writeLevel !== undefined)
          language.writeLevel = lang.writeLevel;
        if (lang.speakLevel !== undefined)
          language.speakLevel = lang.speakLevel;

        return language;
      });

      replaceLanguages(
        { userId, data: languages },
        {
          onSuccess: () => {
            toast.success("Languages updated successfully");
          },
          onError: (error: unknown) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to update languages";
            toast.error(errorMessage);
          },
        }
      );
    },
    [replaceLanguages, profileData]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Typography
            variant="h2"
            className="text-dark-blue font-bold text-2xl"
          >
            Language Proficiency
          </Typography>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
            onClick={() =>
              append({
                name: "",
                proficiency: "",
                readLevel: 0,
                writeLevel: 0,
                speakLevel: 0,
              })
            }
          >
            Add Language
          </Button>
          <Button type="submit" disabled={isSubmitting || isLoadingProfile}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => {
            return (
              <div
                key={field.id}
                className="border border-[#E2E2E2] rounded-lg p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <Typography
                    variant="body-large"
                    className="text-dark-blue font-semibold"
                  >
                    Language {index + 1}
                  </Typography>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-error-100 hover:text-error-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Language"
                    error={
                      errors.languages?.[index]?.name?.message as
                        | string
                        | undefined
                    }
                  >
                    <Controller
                      name={`languages.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languageOptions.map((lang) => (
                              <SelectItem key={lang} value={lang}>
                                {lang}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                  <FormField
                    label="Proficiency Level"
                    error={
                      errors.languages?.[index]?.proficiency?.message as
                        | string
                        | undefined
                    }
                  >
                    <Controller
                      name={`languages.${index}.proficiency`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select proficiency" />
                          </SelectTrigger>
                          <SelectContent>
                            {proficiencyLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                  <FormField
                    label="Read Level (0-10)"
                    error={
                      errors.languages?.[index]?.readLevel?.message as
                        | string
                        | undefined
                    }
                  >
                    <Input
                      {...register(`languages.${index}.readLevel`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      min="0"
                      max="10"
                      placeholder="e.g., 9"
                    />
                  </FormField>
                  <FormField
                    label="Write Level (0-10)"
                    error={
                      errors.languages?.[index]?.writeLevel?.message as
                        | string
                        | undefined
                    }
                  >
                    <Input
                      {...register(`languages.${index}.writeLevel`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      min="0"
                      max="10"
                      placeholder="e.g., 8"
                    />
                  </FormField>
                  <FormField
                    label="Speak Level (0-10)"
                    error={
                      errors.languages?.[index]?.speakLevel?.message as
                        | string
                        | undefined
                    }
                  >
                    <Input
                      {...register(`languages.${index}.speakLevel`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      min="0"
                      max="10"
                      placeholder="e.g., 9"
                    />
                  </FormField>
                </div>
              </div>
            );
          })}

          {fields.length === 0 && (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <Typography variant="body-small" className="text-grey-blue">
                No languages added yet. Add your language proficiency above.
              </Typography>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
