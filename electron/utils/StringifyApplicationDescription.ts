import { ApplicationDescriptionSheet } from "../types/ApplicationDescriptionSheet.type";

export function applicationDescriptionToString(applicationDescription: ApplicationDescriptionSheet){
    return `
        application name: ${applicationDescription.name}
        description: ${applicationDescription.description}
        features: ${applicationDescription.features.map(feature => `-${feature}\n`)}
        actors: ${applicationDescription.actors.map(actor => `${actor}, `)}
    `
}