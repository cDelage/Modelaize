import styled from "styled-components";
import { EndPoint } from "../../../electron/types/Services.type";
import { Column, Row } from "../../ui/layout/Flexbox";
import MethodLabel from "./MethodLabel";
import { TextBold, TextNormal } from "../../ui/text/Text";
import { IoChevronBack } from "react-icons/io5";
import { useState } from "react";
import InputField from "../../ui/forms/InputField";
import BoxLabel from "../../ui/forms/BoxLabel";

const EndpointContainer = styled.div`
  background-color: var(--background-main);
  box-sizing: border-box;
  border-radius: var(--radius);
  box-shadow: var(--shadow-solid);
`;

function Endpoint({
  endpoint: {
    endpointName,
    path,
    method,
    description,
    actorsAllowed,
    businessRules,
    inputs,
    outputs,
  },
  apiPath,
}: {
  endpoint: EndPoint;
  apiPath: string;
}) {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <EndpointContainer>
      <Row
        $gap="var(--space-4)"
        $align="center"
        $cursor="pointer"
        $padding="var(--space-2)"
        onClick={() => setIsExpand((isExp) => !isExp)}
      >
        <MethodLabel method={method} />
        <TextBold>
          {apiPath}
          {path}
        </TextBold>
        <TextNormal $color="var(--text-light)">{endpointName}</TextNormal>
        <Row $justify="end" $grow={1}>
          <IoChevronBack
            style={{
              transform: isExpand ? "rotate(-90deg)" : "",
              transition: "transform 200ms ease-in-out",
            }}
          />
        </Row>
      </Row>
      {isExpand && (
        <Column $padding="var(--space-4)" $gap="var(--space-5)">
          <InputField label="Description">{description}</InputField>
          <InputField label="Actors">
            <Row $gap="var(--space-2)" $flexWrap="wrap">
              {actorsAllowed.map((actor, index) => (
                <BoxLabel key={`${actor}-${index}`}>{actor}</BoxLabel>
              ))}
            </Row>
          </InputField>
          <InputField label="Business rules">
            {businessRules.length === 0 && "No business rules defined"}
            {businessRules.map((businessRules, index) => (
              <Row key={index}>- {businessRules}</Row>
            ))}
          </InputField>
          <InputField label="Input">
            {inputs.length === 0 && "No inputs defined"}
            {inputs.map((input, index) => (
              <Row key={index}>- <TextBold>{input.name}</TextBold> : {input.type}</Row>
            ))}
          </InputField>
          <InputField label="Output">
            {outputs.length === 0 && "No outputs defined"}
            {outputs.map((output, index) => (
              <Row key={index}>- <TextBold>{output.name}</TextBold> : {output.type}</Row>
            ))}
          </InputField>
        </Column>
      )}
    </EndpointContainer>
  );
}

export default Endpoint;
