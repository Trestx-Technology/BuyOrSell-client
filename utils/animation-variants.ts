import { Variants } from "framer-motion";

/**
 * Common Framer Motion animation variants for consistent reveal animations
 * Used across multiple components for smooth, coordinated transitions
 */

/**
 * Container variant for staggered children animations
 * Use this as the parent container to stagger child animations
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

/**
 * Header variant for section headers/titles
 * Smooth spring animation with slight scale and vertical movement
 */
export const headerVariants: Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
      delay: 0.1,
    },
  },
};

/**
 * Tabs variant for tab navigation elements
 * Similar to header but with less vertical movement
 */
export const tabsVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
      delay: 0.3,
    },
  },
};

/**
 * Content variant for main content areas
 * Used for carousels, card grids, and other content sections
 */
export const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
      delay: 0.5,
    },
  },
};

/**
 * Item variant for individual items in lists/grids
 * Use this for child items within a container with containerVariants
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
    },
  },
};

/**
 * Card variant for card components
 * Similar to item but optimized for card layouts
 */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
    },
  },
};

