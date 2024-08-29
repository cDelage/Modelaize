export type ApplicationDescriptionSheet = {
    name: string; //Name of the application.
    description: string; //Short description of the application.
    features: string[]; //List of features. For each feature it describe what is the feature and who use this feature.
    actors: string[];//List of all kind of actors that use the application.
}