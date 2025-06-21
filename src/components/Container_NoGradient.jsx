import styled from "styled-components";

const Container_NoGradient = styled.section`
  position: relative;
  width: 100%;
  // max-width: 1440px;
  margin: 0 auto;
  padding: 20px 100px 0 100px;
  // background: linear-gradient(
  //   to top,
  //   ${({ theme }) => theme.colors.primary} 0%,
  //   ${({ theme }) => theme.colors.secondary} 100%
  // );
  // background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primaryText};
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 10px 10px 0 10px;
  }
`;
export default Container_NoGradient;
