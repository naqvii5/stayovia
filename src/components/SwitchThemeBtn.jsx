import React from "react";
import styled from "styled-components";
import { useThemeContext } from "../theme/ThemeProvider";
import { FiMoon, FiSun } from "react-icons/fi";

const ToggleWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  // background: ${({ theme }) => theme.colors.cardColor2};
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ active, theme }) =>
    active ? theme.colors.primaryHeading : theme.colors.secondaryText};
  cursor: ${({ active }) => (active ? "default" : "pointer")};
  opacity: ${({ active }) => (active ? 1 : 0.4)};
  transition: all 0.2s ease;

  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    cursor: default;
  }
`;

export default function SwitchThemeBtn() {
  const { mode, toggleMode } = useThemeContext();

  return (
    <ToggleWrapper>
      <IconButton
        active={mode === "light"}
        disabled={mode === "light"}
        onClick={toggleMode}
        aria-label="Set Light Mode"
      >
        <FiSun />
      </IconButton>

      <span style={{ color: "gray", fontSize: '20px' }}>⇄</span>

      <IconButton
        active={mode === "dark"}
        disabled={mode === "dark"}
        onClick={toggleMode}
        aria-label="Set Dark Mode"
      >
        <FiMoon />
      </IconButton>
    </ToggleWrapper>
  );
}
