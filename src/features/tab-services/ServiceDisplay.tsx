import { Service } from "../../../electron/types/Services.type";
import { Column } from "../../ui/layout/Flexbox";
import { H2Bold } from "../../ui/titles/H2Bold";
import Endpoint from "./Endpoint";

function ServiceDisplay({service : {serviceName, endpoints, path}}:{service : Service}){

    return <Column $gap="var(--space-6)">
        <H2Bold>{serviceName}</H2Bold>
        <Column $gap="var(--space-4)">
            {endpoints.map(endpoint => <Endpoint key={endpoint.endpointName} endpoint={endpoint} apiPath={path}/>)}
        </Column>
    </Column>
}

export default ServiceDisplay;