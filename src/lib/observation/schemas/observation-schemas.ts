import { z } from "zod";

/**
 * Schema for location coordinates
 * Used across various observation and photo types
 */
export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

/**
 * Schema for PhotoWithMetadata
 * Used for photos being uploaded with metadata during observation creation
 */
export const photoWithMetadataSchema = z.object({
  id: z.string(),
  file: z.instanceof(File),
  preview: z.string().url(),
  description: z.string().optional(),
  location: locationSchema.optional(),
});

/**
 * Schema for ObservationFormData
 * Used for observation form submission data
 */
export const observationFormDataSchema = z.object({
  description: z.string().min(1, "Description is required"),
  location: locationSchema.nullable(),
  photos: z.array(photoWithMetadataSchema),
});

/**
 * Schema for ObservationPhoto
 * Used for displaying photos from the API
 */
export const observationPhotoSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  description: z.string().optional(),
  location: locationSchema.optional(),
});

/**
 * Schema for the createdBy user information
 */
export const observationCreatedBySchema = z.object({
  id: z.string(),
  name: z.string(),
});

/**
 * Schema for Observation
 * Used for displaying observations from the API
 */
export const observationSchema = z.object({
  id: z.string(),
  description: z.string(),
  location: locationSchema,
  photos: z.array(observationPhotoSchema),
  createdAt: z.iso.datetime(),
  createdBy: observationCreatedBySchema,
  canEdit: z.boolean().optional(),
});

/**
 * Type exports inferred from schemas
 * These can be used alongside the existing TypeScript interfaces
 */
export type LocationSchema = z.infer<typeof locationSchema>;
export type PhotoWithMetadataSchema = z.infer<typeof photoWithMetadataSchema>;
export type ObservationFormDataSchema = z.infer<typeof observationFormDataSchema>;
export type ObservationPhotoSchema = z.infer<typeof observationPhotoSchema>;
export type ObservationCreatedBySchema = z.infer<typeof observationCreatedBySchema>;
export type ObservationSchema = z.infer<typeof observationSchema>;