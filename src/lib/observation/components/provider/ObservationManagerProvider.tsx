'use client'

import {ObservationManagerContext} from "@/lib/observation/components/context/ObservationManagerContext";
import {useCallback, useMemo} from "react";
import {ObservationQuery} from "@/lib/observation/types/observation-types";
import {getObservationsAction} from "@/lib/observation/actions/observation-actions";

export const ObservationManagerProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const getObservations = useCallback(
        ({location, createdById, published} : ObservationQuery) => {
            return getObservationsAction({location, createdById, published});
        },
        []
    );

    const actions = useMemo(() => ({getObservations}), [getObservations]);

    const manager = useMemo(() => ({
        actions
    }), [actions]);

    return (
        <ObservationManagerContext.Provider value={manager}>
            {children}
        </ObservationManagerContext.Provider>
    );
}