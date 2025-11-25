export interface PasswordStrength {
  score: number;
  label: string;
  progress: number;
  requirements: string[];
}

/**
 * Calculates password strength based on various criteria
 * @param password - The password to evaluate
 * @returns PasswordStrength object with score, label, progress, and missing requirements
 */
export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, label: "", progress: 0, requirements: [] };
  }

  let score = 0;
  const requirements: string[] = [];

  // Length check (minimum 8, better if 12+)
  if (password.length >= 8) {
    score += 1;
    if (password.length >= 12) score += 1;
  } else {
    requirements.push("At least 8 characters");
  }

  // Character variety checks
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    requirements.push("One lowercase letter");
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    requirements.push("One uppercase letter");
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    requirements.push("One number");
  }

  // Special characters (required for strong password)
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    requirements.push("One special character (!@#$%^&*)");
  }

  // Additional checks for very strong passwords
  if (
    password.length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  ) {
    score += 1;
  }

  // Calculate progress percentage (0-100)
  const progress = Math.min((score / 7) * 100, 100);

  // Determine strength level
  let label: string;
  if (score <= 3) {
    label = "Weak";
  } else if (score <= 5) {
    label = "Strong";
  } else {
    label = "Excellent";
  }

  return { score, label, progress, requirements };
};

