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
 * Schema for bounding box location query
 * Used for searching observations within a rectangular area
 */
export const boundingBoxQuerySchema = z.object({
  minLat: z.number().min(-90).max(90),
  maxLat: z.number().min(-90).max(90),
  minLng: z.number().min(-180).max(180),
  maxLng: z.number().min(-180).max(180),
}).refine(
  (data) => data.minLat <= data.maxLat,
  { message: "minLat must be less than or equal to maxLat" }
).refine(
  (data) => data.minLng <= data.maxLng,
  { message: "minLng must be less than or equal to maxLng" }
);

/**
 * Schema for near point location query
 * Used for searching observations near a specific point with max distance
 */
export const nearPointQuerySchema = z.object({
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  maxDistanceMeters: z.number().min(0),
});

/**
 * Schema for radius location query
 * Used for searching observations within a radius from a point
 */
export const radiusQuerySchema = z.object({
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  radiusMeters: z.number().min(0),
});

/**
 * Union schema for all location query types
 * Can be one of: bounding box, near point, or radius
 */
export const locationQuerySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("boundingBox"),
    ...boundingBoxQuerySchema.shape,
  }),
  z.object({
    type: z.literal("nearPoint"),
    ...nearPointQuerySchema.shape,
  }),
  z.object({
    type: z.literal("radius"),
    ...radiusQuerySchema.shape,
  }),
]);

/**
 * Schema for observation query parameters
 * Used for searching/filtering observations
 */
export const observationQuerySchema = z.object({
  location: locationQuerySchema.optional(),
  createdBy: z.string().optional(), // User ID filter
  published: z.boolean().optional(),
});