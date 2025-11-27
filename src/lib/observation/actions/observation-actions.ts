'use server'

import {Observation, ObservationQuery} from "@/lib/observation/types/observation-types";

export async function getObservationsAction({
    location,
    createdById,
    published
                                      } : ObservationQuery) : Promise<Observation> {
    // ToDo: Implement
}