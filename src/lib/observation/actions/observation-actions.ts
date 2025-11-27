'use server'

import {Observation, ObservationQuery} from "@/lib/observation/types/observation-types";
import {ObservationController} from "@/lib/db/observations";
import {observationSchema} from "@/lib/observation/schemas/observation-schemas";
import {getRevisionWithUrl} from "@/lib/actions/image-actions";
import {getAuthContext} from "@/lib/middleware/auth";
import {canEditEntity} from "@/lib/rbac/permissions";
import type {ObservationRevisionDocument} from "@/types/models";

/**
 * Factory functions for different location query types
 */
type LocationQueryHandler = (
    controller: ObservationController,
    location: NonNullable<ObservationQuery['location']>,
    published?: boolean,
    createdById?: string
) => Promise<ObservationRevisionDocument[]>;

const boundingBoxHandler: LocationQueryHandler = async (controller, location, published, createdById) => {
    if (location.type !== "boundingBox") throw new Error("Invalid location type");
    return controller.searchByBoundingBox(
        location.minLat,
        location.maxLat,
        location.minLng,
        location.maxLng,
        published,
        createdById
    );
};

const nearPointHandler: LocationQueryHandler = async (controller, location, published, createdById) => {
    if (location.type !== "nearPoint") throw new Error("Invalid location type");
    return controller.searchNearPoint(
        location.longitude,
        location.latitude,
        location.maxDistanceMeters,
        published,
        createdById
    );
};

const radiusHandler: LocationQueryHandler = async (controller, location, published, createdById) => {
    if (location.type !== "radius") throw new Error("Invalid location type");
    return controller.searchWithinRadius(
        location.longitude,
        location.latitude,
        location.radiusMeters,
        published,
        createdById
    );
};

const locationQueryHandlers = new Map<string, LocationQueryHandler>([
    ["boundingBox", boundingBoxHandler],
    ["nearPoint", nearPointHandler],
    ["radius", radiusHandler],
]);

/**
 * Transform database observation document to frontend Observation type
 */
async function transformObservation(
    obs: ObservationRevisionDocument,
    authContext: Awaited<ReturnType<typeof getAuthContext>>
): Promise<Observation> {
    // Fetch all images in parallel
    const photos = await Promise.all(
        (obs.imageIds || []).map(async (img) => {
            const image = await getRevisionWithUrl(img.id, img.revisionId);
            return {
                id: img.id,
                url: image.presignedUrl,
                description: image.description,
                location: image.location
                    ? {
                        latitude: image.location.coordinates[1],
                        longitude: image.location.coordinates[0],
                    }
                    : undefined,
            };
        })
    );

    const observation = {
        id: obs.itemId,
        description: obs.description || "",
        location: obs.location
            ? {
                latitude: obs.location.coordinates[1],
                longitude: obs.location.coordinates[0],
            }
            : { latitude: 0, longitude: 0 },
        photos,
        createdAt: obs.createdAt?.toISOString() || new Date().toISOString(),
        createdBy: {
            id: obs.owner,
            name: "", // We don't have name in this context yet
        },
        canEdit: canEditEntity(
            authContext.roles,
            { owner: obs.owner },
            authContext.userId,
        ),
    };

    // Validate the observation against the schema
    return observationSchema.parse(observation);
}

export async function getObservationsAction({
    location,
    createdById,
    published
                                      } : ObservationQuery) : Promise<Observation[]> {
    const controller = new ObservationController();
    const authContext = await getAuthContext();

    // Fetch observations using appropriate handler
    let observations: ObservationRevisionDocument[];

    if (location) {
        const handler = locationQueryHandlers.get(location.type);
        if (!handler) {
            throw new Error(`Unknown location query type: ${location.type}`);
        }
        observations = await handler(controller, location, published, createdById);
    } else {
        observations = await controller.searchObjects(createdById, published);
    }

    // Transform database observations to frontend Observation type
    return Promise.all(
        observations.map(obs => transformObservation(obs, authContext))
    );
}