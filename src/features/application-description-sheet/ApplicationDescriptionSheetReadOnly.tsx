import styled from "styled-components";
import { H2Bold } from "../../ui/titles/H2Bold";
import InputField from "../../ui/forms/InputField";
import BoxLabel from "../../ui/forms/BoxLabel";
import { Column, Row } from "../../ui/layout/Flexbox";
import { ApplicationDescriptionSheet } from "../../../electron/types/ApplicationDescriptionSheet.type";

const ApplicationDescriptionSheetStyled = styled.div`
  border-radius: var(--radius);
  background-color: var(--background-main2);
  box-shadow: var(--shadow-solid);
  border: 1px solid var(--stroke-light);
  padding: var(--space-4);
  width: 100%;
  height: fit-content;
  resize: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-7);
  margin-bottom: var(--space-8);
  box-sizing: border-box;
`;

function ApplicationDescriptionSheetReadOnly({
  applicationDescriptionSheet: { actors, description, features, name },
}: {
  applicationDescriptionSheet: ApplicationDescriptionSheet;
}) {
  return (
    <ApplicationDescriptionSheetStyled>
      <H2Bold>Application Description Sheet</H2Bold>
      <InputField label="Name">{name}</InputField>
      <InputField label="Description">{description}</InputField>
      <InputField label="Features">
        <Column $gap="var(--space-4)">
          {features?.map((feature, index) => <Row key={index}>{feature}</Row>)}
        </Column>
      </InputField>
      <InputField label="Actors">
        <Row $gap="var(--space-2)" $flexWrap="wrap">
          {actors.map((actor, index) => (
            <BoxLabel key={`${actor}-${index}`}>{actor}</BoxLabel>
          ))}
        </Row>
      </InputField>
    </ApplicationDescriptionSheetStyled>
  );
}

export default ApplicationDescriptionSheetReadOnly;
