import { z } from "zod";

// Nested schemas for complex objects
const jobseekerExperienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
    .optional(),
  isCurrent: z.boolean().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  url: z.string().url("Invalid URL").optional().nullable(),
  employmentType: z.string().optional(),
  employmentTypeAr: z.string().optional(),
  department: z.string().optional(),
  departmentAr: z.string().optional(),
  jobType: z.string().optional(),
  noticePeriodDays: z.number().int().min(0).optional(),
  currentCtc: z.number().nonnegative().optional(),
  ctcCurrency: z.string().optional(),
  servingNotice: z.boolean().optional(),
  lastWorkingDay: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Last working day must be in YYYY-MM-DD format",
    )
    .optional()
    .nullable(),
  skills: z.array(z.string()).optional(),
});

const jobseekerEducationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  institution: z.string().min(1, "Institution is required"),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
    .optional(),
  isCurrent: z.boolean().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
  courseType: z.string().optional(),
  scoreType: z.string().optional(),
  score: z.number().nonnegative().optional(),
  yearOfPassing: z.number().int().min(1900).max(2100).optional(),
});

const jobseekerProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  role: z.string().optional(),
  description: z.string().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format")
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
    .optional(),
  url: z.string().url("Invalid URL").optional().nullable(),
  techStack: z.array(z.string()).optional(),
  projectType: z.string().optional(),
  teamSize: z.number().int().min(1).optional(),
});

const jobseekerCertificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().optional(),
  issueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Issue date must be in YYYY-MM-DD format")
    .optional(),
  expiryDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry date must be in YYYY-MM-DD format")
    .optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url("Invalid URL").optional().nullable(),
  url: z.string().url("Invalid URL").optional().nullable(),
  description: z.string().optional(),
});

const jobseekerLanguageSchema = z.object({
  name: z.string().min(1, "Language name is required"),
  proficiency: z.string().min(1, "Proficiency level is required"),
  readLevel: z.number().int().min(0).max(10).optional(),
  writeLevel: z.number().int().min(0).max(10).optional(),
  speakLevel: z.number().int().min(0).max(10).optional(),
});

const jobseekerAwardSchema = z.object({
  title: z.string().min(1, "Award title is required"),
  organization: z.string().optional(),
  issuer: z.string().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  issueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Issue date must be in YYYY-MM-DD format")
    .optional(),
  description: z.string().optional(),
  url: z.string().url("Invalid URL").optional().nullable(),
});

const jobseekerPublicationSchema = z.object({
  title: z.string().min(1, "Publication title is required"),
  publisher: z.string().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  description: z.string().optional(),
  url: z.string().url("Invalid URL").optional().nullable(),
});

const jobseekerLinkSchema = z.object({
  label: z.string().min(1, "Link label is required"),
  url: z.string().url("Invalid URL"),
});

export const workStatusSchema = z.enum([
  "actively_looking",
  "open_to_opportunities",
  "not_looking",
]);

// Main jobseeker profile schema
export const jobseekerProfileSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    name: z.string().min(1, "Name is required"),
    headline: z.string().optional(),
    skills: z.array(z.string()).optional(),
    experienceYears: z.number().int().min(0).optional(),
    education: z.string().optional(),
    isFresher: z.boolean().optional(),
    workStatus: z.enum(workStatusSchema.options).optional(),
    location: z.string().optional(),
    contactEmail: z.string().email("Invalid email address").optional(),
    contactPhone: z.string().optional(),
    desiredRoles: z.array(z.string()).optional(),
    availability: z.string().optional(),
    noticePeriodDays: z.number().int().min(0).optional(),
    salaryExpectationMin: z.number().nonnegative().optional(),
    salaryExpectationMax: z.number().nonnegative().optional(),
    currentCtc: z.number().nonnegative().optional(),
    expectedCtc: z.number().nonnegative().optional(),
    ctcCurrency: z.string().optional(),
    preferredJobTypes: z.array(z.string()).optional(),
    preferredShifts: z.array(z.string()).optional(),
    preferredLocations: z.array(z.string()).optional(),
    keywords: z.array(z.string()).optional(),
    visibility: z.enum(["public", "private"]).default("public").optional(),
    websiteUrl: z.string().url("Invalid URL").optional().nullable(),
    industryId: z.string().optional(),
    summary: z.string().optional(),
    photoUrl: z.string().url("Invalid URL").optional().nullable(),
    githubUrl: z.string().url("Invalid URL").optional().nullable(),
    twitterUrl: z.string().url("Invalid URL").optional().nullable(),
    portfolioUrl: z.string().url("Invalid URL").optional().nullable(),
    linkedinUrl: z.string().url("Invalid URL").optional().nullable(),
    links: z.array(jobseekerLinkSchema).optional(),
    experiences: z.array(jobseekerExperienceSchema).optional(),
    educations: z.array(jobseekerEducationSchema).optional(),
    projects: z.array(jobseekerProjectSchema).optional(),
    certifications: z.array(jobseekerCertificationSchema).optional(),
    languages: z.array(jobseekerLanguageSchema).optional(),
    awards: z.array(jobseekerAwardSchema).optional(),
    publications: z.array(jobseekerPublicationSchema).optional(),
    resumeText: z.string().optional(),
    resumeFileUrl: z.string().url("Invalid URL").optional().nullable(),
  })
  .refine(
    (data) => {
      // Validate that salaryExpectationMax is greater than or equal to salaryExpectationMin if both are provided
      if (
        data.salaryExpectationMin !== undefined &&
        data.salaryExpectationMax !== undefined
      ) {
        return data.salaryExpectationMax >= data.salaryExpectationMin;
      }
      return true;
    },
    {
      message:
        "Maximum salary expectation must be greater than or equal to minimum salary expectation",
      path: ["salaryExpectationMax"],
    },
  )
  .refine(
    (data) => {
      // Validate that expectedCtc is greater than or equal to currentCtc if both are provided
      if (data.currentCtc !== undefined && data.expectedCtc !== undefined) {
        return data.expectedCtc >= data.currentCtc;
      }
      return true;
    },
    {
      message: "Expected CTC must be greater than or equal to current CTC",
      path: ["expectedCtc"],
    },
  );

// Partial schema for updates (all fields optional)
export const updateJobseekerProfileSchema = jobseekerProfileSchema.partial();

// Form-specific schema (matches the form structure, not API payload)
// This schema is for form validation and matches the JobseekerProfileFormData type
export const jobseekerProfileFormSchema = z
  .object({
    _id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").optional(),
    phoneNo: z.string().optional(),
    professionalTitle: z.string().optional(),
    currentCompany: z.string().optional(),
    bio: z.string().optional(),
    resumeUrl: z.string().url("Invalid URL").optional().nullable(),
    workExperience: z
      .array(
        z.object({
          _id: z.string().optional(),
          position: z.string().optional(),
          company: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          current: z.boolean().optional(),
          location: z.string().optional(),
          achievements: z.array(z.string()).optional(),
          description: z.string().optional(),
        }),
      )
      .optional(),
    education: z
      .array(
        z.object({
          _id: z.string().optional(),
          institution: z.string().optional(),
          degree: z.string().optional(),
          fieldOfStudy: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          current: z.boolean().optional(),
          grade: z.string().optional(),
          description: z.string().optional(),
        }),
      )
      .optional(),
    skills: z.array(z.string()).optional(),
    certifications: z
      .array(
        z.object({
          _id: z.string().optional(),
          name: z.string().optional(),
          issuingOrganization: z.string().optional(),
          issueDate: z.string().optional(),
          expiryDate: z.string().optional(),
          credentialId: z.string().optional(),
          credentialUrl: z.string().url("Invalid URL").optional().nullable(),
        }),
      )
      .optional(),
    portfolio: z
      .array(
        z.object({
          _id: z.string().optional(),
          name: z.string().optional(),
          role: z.string().optional(),
          description: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          url: z.string().url("Invalid URL").optional().nullable(),
          techStack: z.array(z.string()).optional(),
          projectType: z.string().optional(),
          teamSize: z.number().int().min(1).optional(),
        }),
      )
      .optional(),
    languages: z
      .array(
        z.object({
          _id: z.string().optional(),
          name: z.string().optional(),
          proficiency: z.string().optional(),
          readLevel: z.number().int().min(0).max(5).optional(),
          writeLevel: z.number().int().min(0).max(5).optional(),
          speakLevel: z.number().int().min(0).max(5).optional(),
        }),
      )
      .optional(),
    jobPreferences: z.unknown().optional(),
    profileCompletion: z.number().optional(),
  })
  .partial(); // Make all fields optional for flexible form validation

// Type exports
export type JobseekerProfileSchemaType = z.infer<typeof jobseekerProfileSchema>;
export type UpdateJobseekerProfileSchemaType = z.infer<
  typeof updateJobseekerProfileSchema
>;
export type JobseekerProfileFormSchemaType = z.infer<
  typeof jobseekerProfileFormSchema
>;

// Section-specific schemas for independent form instances
export const basicDetailsSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(1, "Name is required"),
  contactEmail: z
    .string({ message: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  contactPhone: z
    .string({ message: "Phone number is required" })
    .trim()
    .min(1, "Phone number is required"),
  resumeFileUrl: z
    .string({ message: "Resume is required" })
    .trim()
    .min(1, "Resume is required")
    .url("Invalid URL"),
  workStatus: z.enum(workStatusSchema.options, {
    message: "Work status is required",
  }),
  experienceYears: z
    .number({ message: "Experience is required" })
    .int()
    .min(0, "Invalid experience"),
  currentCtc: z
    .number({ message: "Salary is required" })
    .nonnegative("Invalid salary"),
  location: z
    .string({ message: "Location is required" })
    .trim()
    .min(1, "Location is required"),
  noticePeriodDays: z
    .union([
      z.number().int().min(0, "Invalid notice period"),
      z.literal("serving"),
    ])
    .optional(),
});

export type BasicDetailsSchemaType = z.infer<typeof basicDetailsSchema>;

export const skillsSchema = z
  .object({
    skills: z.array(z.string({ message: "Skill must be a string" })).optional(),
  })
  .partial();

export type SkillsSchemaType = z.infer<typeof skillsSchema>;

export const profileSummarySchema = z
  .object({
    summary: z
      .string({ message: "Summary must be a string" })
      .max(2000, "Summary must be 2000 characters or less")
      .optional(),
  })
  .partial();

export type ProfileSummarySchemaType = z.infer<typeof profileSummarySchema>;

// Form schema for Employment (uses form field names)
export const employmentFormSchema = z.object({
  workExperience: z
    .array(
      z.object({
        _id: z.string().optional(),
        position: z
          .string({ message: "Position is required" })
          .min(1, "Position is required"),
        company: z
          .string({ message: "Company is required" })
          .min(1, "Company is required"),
        startDate: z
          .string({ message: "Start date is required" })
          .min(1, "Start date is required"),
        endDate: z.string().optional(),
        current: z.boolean().optional(),
        location: z
          .string({ message: "Location is required" })
          .min(1, "Location is required"),
        description: z.string().optional(),
        descriptionAr: z.string().optional(),
        url: z.string().url("Invalid URL").optional().nullable(),
        employmentType: z.string().optional(),
        employmentTypeAr: z.string().optional(),
        department: z.string().optional(),
        departmentAr: z.string().optional(),
        jobType: z
          .string({ message: "Job type is required" })
          .min(1, "Job type is required"),
        noticePeriodDays: z.number().int().min(0).optional(),
        currentCtc: z.number().nonnegative().optional(),
        ctcCurrency: z.string().optional(),
        servingNotice: z.boolean().optional(),
        lastWorkingDay: z.string().optional().nullable(),
        skills: z.array(z.string()).optional(),
      }),
    )
    .optional(),
});

export const employmentSchema = z
  .object({
    experiences: z.array(jobseekerExperienceSchema).optional(),
  })
  .partial();

export type EmploymentFormSchemaType = z.infer<typeof employmentFormSchema>;
export type EmploymentSchemaType = z.infer<typeof employmentSchema>;

// Form schema for Education (uses form field names)
export const educationFormSchema = z.object({
  education: z
    .array(
      z.object({
        _id: z.string().optional(),
        institution: z
          .string({ message: "Institution is required" })
          .min(1, "Institution is required"),
        degree: z
          .string({ message: "Degree is required" })
          .min(1, "Degree is required"),
        fieldOfStudy: z.string().optional(),
        startDate: z
          .string({ message: "Start date is required" })
          .min(1, "Start date is required"),
        endDate: z.string().optional(),
        current: z.boolean().optional(),
        grade: z.string().optional(),
        description: z.string().optional(),
        courseType: z.string().optional(),
        scoreType: z.string().optional(),
        score: z.number().nonnegative().optional(),
        yearOfPassing: z.number().int().min(1900).max(2100).optional(),
      }),
    )
    .optional(),
});

export const educationSchema = z
  .object({
    educations: z.array(jobseekerEducationSchema).optional(),
  })
  .partial();

export type EducationFormSchemaType = z.infer<typeof educationFormSchema>;
export type EducationSchemaType = z.infer<typeof educationSchema>;

// Form schema for Projects (uses form field names)
export const projectsFormSchema = z.object({
  portfolio: z
    .array(
      z.object({
        _id: z.string().optional(),
        name: z
          .string({ message: "Project name is required" })
          .min(1, "Project name is required"),
        role: z.string().optional(),
        description: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        url: z.string().url("Invalid URL").optional().or(z.literal("")),
        techStack: z.array(z.string()).optional(),
        projectType: z.string().optional(),
        teamSize: z.number().int().min(1).optional(),
      }),
    )
    .optional(),
});

export const projectsSchema = z
  .object({
    projects: z.array(jobseekerProjectSchema).optional(),
  })
  .partial();

export type ProjectsFormSchemaType = z.infer<typeof projectsFormSchema>;
export type ProjectsSchemaType = z.infer<typeof projectsSchema>;

// Form schema for Languages (uses form field names)
export const languagesFormSchema = z.object({
  languages: z
    .array(
      z.object({
        _id: z.string().optional(),
        name: z
          .string({ message: "Language is required" })
          .min(1, "Language is required"),
        proficiency: z
          .string({ message: "Proficiency is required" })
          .min(1, "Proficiency is required"),
        readLevel: z.number().int().min(0).max(10).optional(),
        writeLevel: z.number().int().min(0).max(10).optional(),
        speakLevel: z.number().int().min(0).max(10).optional(),
      }),
    )
    .optional(),
});

export const languagesSchema = z
  .object({
    languages: z.array(jobseekerLanguageSchema).optional(),
  })
  .partial();

export type LanguagesFormSchemaType = z.infer<typeof languagesFormSchema>;
export type LanguagesSchemaType = z.infer<typeof languagesSchema>;
