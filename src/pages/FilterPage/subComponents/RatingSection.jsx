// RatingSection.jsx
import React, { useState } from "react";
import styled, { css } from "styled-components";

// container
const RatingGroup = styled.div`
  grid-area: rating;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// each option
const StarButton = styled.button`
  position: relative;
  flex: 1;
  padding: 0.65rem;
  border-radius: 0.8rem;
  background: ${({ theme }) => theme.colors.mainBackground};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;

  /* default (unselected): gray text & border */
  ${({ theme }) => css`
    color: ${theme.colors.secondaryText};
    border: 0.5px solid #dddddd;
  `}

  /* always show a little underline */
  &::after {
    content: "";
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 3px;
    // background: ${({ theme }) => theme.colors.secondaryText};
    background: #f4f4f4;
    border-radius: 0.5rem;
  }

  /* when selected: primary text, primary border, and primary underline */
  ${({ selected, theme }) =>
    selected &&
    css`
      color: ${theme.colors.primaryText};
      border-color: ${theme.colors.primary};

      &::after {
        background: ${theme.colors.primary};
      }
    `}

  &:hover {
    background: ${({ theme }) => theme.colors.header};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function RatingSection({ selectedStars, setSelectedStars }) {
  // const [selectedStars, setSelectedStars] = useState([]);
  const options = [
    { label: "1 star", value: 1 },
    { label: "2 stars", value: 2 },
    { label: "3 stars", value: 3 },
    { label: "4 stars", value: 4 },
    { label: "5 stars", value: 5 },
  ];

  const toggleStar = (val) => {
    setSelectedStars((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  return (
    <RatingGroup>
      {options.map(({ label, value }) => (
        <StarButton
          key={value}
          selected={selectedStars.includes(value)}
          onClick={() => toggleStar(value)}
        >
          {label}
        </StarButton>
      ))}
    </RatingGroup>
  );
}
