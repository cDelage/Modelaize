export type Service = {
    serviceName: string;
    path: string;//Exemple : /book, /library...
    endpoints: EndPoint[]
}

export type EndPoint = {
    method: Method;
    path: string;// Path of the endpoint into service (DO NOT include the service path here), exemple : /{book_id}, /all, / ...
    endpointName: string; //Exemple : getBookById, postBook, getAllLibrary ...
    description: string;//Describe what feature is for.
    actorsAllowed: string[];
    inputs: EndpointObjectType[];
    outputs: EndpointObjectType[];
    businessRules: string[];//adds business rules only if they are mentioned in the description or prompt.
}

export type EndpointObjectType = {
    name: string;
    type: "string" | "number" | "boolean" | string;// Can be a string, number, boolean or an entity of the model.
}

export type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE" | "HEAD"