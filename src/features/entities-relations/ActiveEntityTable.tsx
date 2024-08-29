import { Table, Td, Th, THead, TrBody, TrHeader } from "../../ui/tables/Table";
import { Column, Row } from "../../ui/layout/Flexbox";
import Loader from "../../ui/layout/Loader";
import { useParams, useSearchParams } from "react-router-dom";
import {
  useActiveEntityTable,
  useGetProjectById,
} from "../project/ProjectQueries";
import { Checkbox } from "../../ui/forms/Checkbox";
import { IoKey } from "react-icons/io5";
import { H2Bold } from "../../ui/titles/H2Bold";

function ActiveEntityTable() {
  const { entity, fieldsAndRelations } = useActiveEntityTable();

  if (!entity) return null;
  const {
    data: { entityName },
  } = entity;

  return (
    <Column $gap="var(--space-4)">
      <Row>
        <H2Bold>{entityName}</H2Bold>
      </Row>
      <Table>
        <THead>
          <TrHeader>
            <Th>Field</Th>
            <Th>Type</Th>
            <Th>Unique</Th>
            <Th>Nullable</Th>
            <Th>Primary key</Th>
            <Th>Foreign key</Th>
          </TrHeader>
        </THead>
        <tbody>
          {fieldsAndRelations.map(({ field, parentEntity, parentPk }) => (
            <TrBody>
              <Td>{field.name}</Td>
              <Td>{field.type}</Td>
              <Td>
                <Checkbox type="checkbox" checked={field.unique} />
              </Td>
              <Td>
                <Checkbox type="checkbox" checked={field.nullable} />
              </Td>
              <Td>
                {field.primaryKey && (
                  <IoKey color="var(--color-secondary-500)" />
                )}
              </Td>
              <Td>
                {parentEntity && (
                  <Row $align="center" $gap="var(--space-2)">
                    <div>
                      {parentEntity}.{parentPk}
                    </div>
                    <IoKey color="var(--color-gray-500)" />
                  </Row>
                )}
              </Td>
            </TrBody>
          ))}
        </tbody>
      </Table>
    </Column>
  );
}

export default ActiveEntityTable;
