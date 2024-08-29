import styled from "styled-components";
import { useGetProjectById } from "../project/ProjectQueries";
import { useParams, useSearchParams } from "react-router-dom";
import Loader from "../../ui/layout/Loader";
import EntityTab from "./EntitiesTab";
import { Column } from "../../ui/layout/Flexbox";
import RelationTab from "./RelationTab";
import ActiveEntityTable from "./ActiveEntityTable";
import ActiveRelationTable from "./ActiveRelationTable";

const EntitiesRelationsContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const TabsContainer = styled.div`
  height: 100%;
  width: 260px;
  border-right: 1px solid var(--stroke-main);
  display: flex;
  flex-direction: column;
  gap: var(--space-7);
  padding: var(--space-7) var(--space-2);
  box-sizing: border-box;
  overflow: auto;
`;

const ContainerHeader = styled.div`
  color: var(--text-light);
  font-weight: var(--font-weight-bold);
`;

function EntitiesAndRelations() {
  const { projectId } = useParams();
  const { project, isLoadingProject } = useGetProjectById(projectId as string);
  const [searchParams] = useSearchParams();
  const activeTable = searchParams.get("activeTable")

  if (isLoadingProject) return <Loader />;
  if (!project) return null;

  const {
    model: { entities },
  } = project;

  return (
    <EntitiesRelationsContainer>
      <TabsContainer>
        <Column $gap="var(--space-2)">
          <ContainerHeader>Entities</ContainerHeader>
          <Column $gap="var(--space-1)">
            {entities.map((entity) => (
              <EntityTab key={entity.id} entity={entity} />
            ))}
          </Column>
        </Column>
        <Column $gap="var(--space-2)">
          <ContainerHeader>Relations</ContainerHeader>
          <RelationTab />
        </Column>
      </TabsContainer>
      <Column
        $gap="var(--space-9)"
        $padding="var(--space-8) var(--space-8)"
        $overflow="auto"
        $width="100%"
        $height="100%"
        $boxSizing="border-box"
      >
        {
          activeTable === "relation-tab" ? <ActiveRelationTable/> : <ActiveEntityTable />
        }
        
      </Column>
    </EntitiesRelationsContainer>
  );
}

export default EntitiesAndRelations;
