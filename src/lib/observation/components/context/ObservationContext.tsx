import {createContext} from "react";
import {ObservationManager} from "@/lib/observation/types/observation-types"

export const ObservationManagerContext = createContext<ObservationManager>({actions: null});