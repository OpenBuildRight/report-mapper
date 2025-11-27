'use client'

import {ObservationManagerContext} from "@/lib/observation/components/context/ObservationManagerContext";
import {useCallback, useMemo} from "react";
import {ObservationQuery} from "@/lib/observation/types/observation-types";
import {getObservationsAction} from "@/lib/observation/actions/observation-actions";

export const ObservationManagerProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const getObservations = useCallback(
        // ToDo: Deal with async promise properly.
        ({location, createdById, published} : ObservationQuery) => getObservationsAction({location, createdById, published}),
        []
    );
    const actions = useMemo(() => ({getObservations}), [getObservations]);
    const manager = useMemo(() => {
        return {actions};
    }, [actions]);
    return (
        <ObservationManagerContext value={manager}>
            {children}
        </ObservationManagerContext>
    )
}