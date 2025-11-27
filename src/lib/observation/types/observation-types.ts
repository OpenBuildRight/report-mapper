import {locationSchema} from "@/lib/validation/schemas";
import {
    observationCreatedBySchema,
    observationFormDataSchema,
    observationPhotoSchema, observationSchema,
    photoWithMetadataSchema
} from "@/lib/observation/schemas/observation-schemas";
import {z} from "zod";

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
