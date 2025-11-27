import {locationSchema} from "@/lib/validation/schemas";
import {
    observationCreatedBySchema,
    observationFormDataSchema,
    observationPhotoSchema, observationQuerySchema, observationSchema,
    photoWithMetadataSchema
} from "@/lib/observation/schemas/observation-schemas";
import {z} from "zod";

/**
 * Type exports inferred from schemas
 * These can be used alongside the existing TypeScript interfaces
 */
export type Location = z.infer<typeof locationSchema>;
export type PhotoWithMetadata = z.infer<typeof photoWithMetadataSchema>;
export type ObservationFormData = z.infer<typeof observationFormDataSchema>;
export type ObservationPhoto = z.infer<typeof observationPhotoSchema>;
export type ObservationCreatedBy = z.infer<typeof observationCreatedBySchema>;
export type Observation = z.infer<typeof observationSchema>;
export type ObservationQuerySchema = z.infer<typeof observationQuerySchema>;


export interface ObservationManagerActions {
    getObservations: ({location, createdBy, published}: ObservationQuerySchema) => Promise<Observation[]>;
}

export interface ObservationManager {
    actions: ObservationManagerActions | null;
}