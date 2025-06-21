import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import { getCities } from "../../../api/getCities"; // adjust path as needed

// Styled components
const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 0.75rem;
  border-radius: 0.8rem;
  border: 0.5px solid #dddddd;
  background: ${({ theme }) => theme.colors.mainBackground};
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.small};
  height: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondaryText};
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const DestWrapper = styled.div`
  grid-area: dest;
  position: relative;
  align-self: stretch;
`;

const ClearIcon = styled(AiOutlineClose)`
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  cursor: pointer;
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const SuggestionList = styled.ul`
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  width: 100%;
  background: ${({ theme }) => theme.colors.mainBackground};
  border: 1px solid ${({ theme }) => theme.colors.secondaryText};
  border-radius: 0.8rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 2;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const SuggestionItem = styled.li`
  padding: 0.5rem 0.75rem;
  background: ${({ highlighted, theme }) =>
    highlighted ? theme.colors.primary : theme.colors.mainBackground};
  color: ${({ highlighted, theme }) =>
    highlighted ? "#fff" : theme.colors.primaryText};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`;

export default function DestinationSection({ dest, setDest, setCityName }) {
  const wrapper = useRef(null);
  const inputRef = useRef(null);

  const [cities, setCities] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [highlight, setHighlight] = useState(-1);

  // Fetch cities on mount
  useEffect(() => {
    getCities()
      .then(({ status, data }) => {
        if (status && Array.isArray(data)) setCities(data);
        else toast.error("Failed to load cities");
      })
      .catch(() =>
        console.log('Network')
        // toast.error("Network error")
      );
  }, []);

  // Hide dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapper.current && !wrapper.current.contains(e.target)) {
        setFiltered([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Set display name from selected dest
  useEffect(() => {
    if (dest != null && cities.length) {
      const sel = cities.find((c) => c.AddressId === dest);
      if (sel) setDisplayName(sel.CityName);
    } else if (dest == null) {
      setDisplayName("");
    }
  }, [dest, cities]);

  // Filter dropdown suggestions
  useEffect(() => {
    if (displayName && cities.length > 0) {
      const q = displayName.toLowerCase();
      setFiltered(cities.filter((c) => c.CityName.toLowerCase().includes(q)));
    } else {
      setFiltered([]);
    }
    setHighlight(-1);
  }, [displayName, cities]);

  // Sync city name upward
  useEffect(() => {
    if (displayName) setCityName(displayName);
  }, [displayName]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!filtered.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? filtered.length - 1 : h - 1));
    } else if (e.key === "Enter" && highlight >= 0) {
      e.preventDefault();
      const choice = filtered[highlight];
      setDisplayName(choice.CityName);
      setDest(choice.AddressId);
      setFiltered([]); // ✅ close dropdown
    }
  };

  return (
    <DestWrapper ref={wrapper}>
      <StyledInput
        ref={inputRef}
        placeholder="Destination"
        value={displayName}
        onChange={(e) => {
          setDisplayName(e.target.value);
          const q = e.target.value.toLowerCase();
          setFiltered(cities.filter((c) => c.CityName.toLowerCase().includes(q)));
        }}
        onKeyDown={handleKeyDown}
      />
      {displayName && (
        <ClearIcon
          onClick={() => {
            setDisplayName("");
            setDest(null);
            inputRef.current?.focus();
          }}
        />
      )}
      {filtered.length > 0 && (
        <SuggestionList>
          {filtered.map((c, i) => (
            <SuggestionItem
              key={c.AddressId}
              highlighted={i === highlight}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(e) => {
                e.preventDefault(); // 👈 prevent refocus
                setDisplayName(c.CityName);
                setDest(c.AddressId);
                setFiltered([]); // ✅ force dropdown to close
              }}
            >
              {c.CityName}
            </SuggestionItem>
          ))}
        </SuggestionList>
      )}
    </DestWrapper>
  );
}
