// MyButton.jsx
import React from "react";
import styled from "styled-components";

const StyledButton = styled.button.attrs(({ name, disabled }) => ({
  name,
  disabled,
}))`
  /* LAYOUT & SIZING */
  padding: ${({ padding }) => padding};
  width: ${({ width }) => width};
  font-size: ${({ fontSize, theme }) => fontSize || theme.fontSizes.medium};

  /* COLORS & BACKGROUND */
  background: ${({ bgColor, theme }) => bgColor || theme.colors.primary};
  color: ${({ textColor, theme }) => textColor || theme.colors.secondary};

  /* BORDERS & RADIUS */
  border: none;
  border-radius: ${({ borderRadius }) => borderRadius};

  /* SHADOW & TRANSITION */
  box-shadow: ${({ boxShadow }) => boxShadow};
  transition: ${({ transition }) => transition};

  /* CURSOR & OPACITY */
cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled, opacity }) => (disabled ? opacity || 0.6 : opacity)};

  /* HOVER STATE */
  &:hover {
    ${({ hoverBgColor, bgColor, theme }) =>
    `background: ${hoverBgColor || bgColor || theme.colors.primary};`}
    ${({ hoverTextColor }) => hoverTextColor && `color: ${hoverTextColor};`}
  }

  /* ACTIVE STATE */
  &:active {
    ${({ activeBgColor, bgColor, theme }) =>
    `background: ${activeBgColor || bgColor || theme.colors.primary};`}
    transform: ${({ activeTransform }) => activeTransform || "scale(0.97)"};

  }
  /* FOCUS STATE */
  &:focus {
    outline: ${({ focusOutline, theme }) =>
    focusOutline || `2px solid ${theme.colors.secondary}`};
    box-shadow: ${({ focusBoxShadow, theme }) =>
    focusBoxShadow || `0 0 0 4px ${theme.colors.primary}55`};
  }
`;

// Default values for all props:
StyledButton.defaultProps = {
  name: undefined,
  padding: "0.6rem 1.2rem",
  width: "auto",
  fontSize: undefined, // falls back to theme.fontSizes.medium
  bgColor: undefined, // falls back to theme.colors.primary
  textColor: undefined, // falls back to theme.colors.secondary
  borderRadius: "6px",
  boxShadow: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
  opacity: 1,
  hoverBgColor: undefined,
  hoverTextColor: undefined,
  activeBgColor: undefined,
  activeTransform: "scale(0.98)",
  focusOutline: undefined,
  focusBoxShadow: undefined,
  disabled: false,
};

export const MyButton = ({ onClick, children, ...rest }) => (
  <StyledButton onClick={onClick} {...rest}>
    {children}
  </StyledButton>
);
