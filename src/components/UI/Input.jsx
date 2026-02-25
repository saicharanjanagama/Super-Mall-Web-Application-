import styled from "styled-components";

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 14px;
  font-size: 15px;
`;

export default StyledInput;
