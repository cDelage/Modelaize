import { useGetRelationWithEntities } from "../project/ProjectQueries";
import { Column, Row } from "../../ui/layout/Flexbox";
import { H2Bold } from "../../ui/titles/H2Bold";
import { Table, Td, Th, THead, TrBody, TrHeader } from "../../ui/tables/Table";

function ActiveRelationTable() {
  const relations = useGetRelationWithEntities();

  return (
    <Column $gap="var(--space-4)">
      <Row>
        <H2Bold>Relationship table</H2Bold>
      </Row>
      <Table>
        <THead>
          <TrHeader>
            <Th>Parent</Th>
            <Th>Parent key</Th>
            <Th>Parent Cardinality</Th>
            <Th>Children</Th>
            <Th>Children key</Th>
            <Th>Children cardinality</Th>
            <Th>Relation description</Th>
          </TrHeader>
        </THead>
        <tbody>
          {relations.map((relationInfo) => (
            <TrBody key={relationInfo.relation.id}>
              <Td>{relationInfo.parentEntity?.entityName}</Td>
              <Td>{relationInfo.parentField?.name}</Td>
              <Td>{relationInfo.relation.data?.source.cardinalitySource}</Td>
              <Td>{relationInfo.childrenEntity?.entityName}</Td>
              <Td>{relationInfo.childrenField?.name}</Td>
              <Td>{relationInfo.relation.data?.target.cardinalityTarget}</Td>
              <Td>{relationInfo.relation.data?.relationDescriptionVerb}</Td>
            </TrBody>
          ))}
        </tbody>
      </Table>
    </Column>
  );
}

export default ActiveRelationTable;
