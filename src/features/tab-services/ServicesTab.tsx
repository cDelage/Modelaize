import { useParams } from "react-router-dom";
import { useGetProjectById } from "../project/ProjectQueries";
import ServiceDisplay from "./ServiceDisplay";
import styled from "styled-components";

const ServicesTabContainer = styled.div`
  padding: var(--space-7);
  display: flex;
  flex-direction: column;
  gap: var(--space-9);
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: var(--background-main2);
`

function ServicesTab() {
  const { projectId } = useParams();
  const { project } = useGetProjectById(projectId as string);

  if (!project) return null;

  return (
    <ServicesTabContainer>
      {project.services.map((service) => (
        <ServiceDisplay key={service.serviceName} service={service} />
      ))}
    </ServicesTabContainer>
  );
}

export default ServicesTab;
