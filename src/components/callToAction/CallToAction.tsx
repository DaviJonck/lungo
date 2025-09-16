import styled from "styled-components";

const StyledCallToAction = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md};
`;

const CallToAction = () => {
  return <StyledCallToAction></StyledCallToAction>;
};

export default CallToAction;
