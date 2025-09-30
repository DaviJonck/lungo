import styled from "styled-components";

const StyledLoginButton = styled.button`
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textBlack};
  padding: 0.15rem;
  width: 90px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  &:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease;
  }
`;

type LoginButtonProps = {
  onLogin?: () => void;
};

const LoginButton = ({ onLogin }: LoginButtonProps) => {
  return <StyledLoginButton onClick={onLogin}>Login</StyledLoginButton>;
};

export default LoginButton;
