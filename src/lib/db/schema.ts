/**
 * Central schema entry point.
 * Each module maintains its own schema file; all schemas are re-exported
 * from here so Drizzle Kit and the db instance share a single source.
 *
 */
export * from "@/modules/auth/schema";
