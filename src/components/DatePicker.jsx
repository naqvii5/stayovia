// src/components/Datepicker.jsx
import React, { useEffect, useState, useRef } from "react";
import { DateRange } from "react-date-range";
import format from "date-fns/format";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import styled from "styled-components";

// Styled‐components (converted from your old Datepicker.css)

const PickerWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Dates = styled.div`
  display: flex;
  border: 0.5px solid #dddddd;
  border-radius: 0.8rem;
  overflow: hidden;
  align-self: stretch;

  & > input {
    flex: 1;
    border: none;
    padding: 0.75rem;
    border-radius: 0;
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
    background: ${({ theme }) => theme.colors.mainBackground};
    color: ${({ theme }) => theme.colors.primaryText};

    &::placeholder {
      color: ${({ theme }) => theme.colors.secondaryText};
      font-size: ${({ theme }) => theme.fontSizes.xsmall};
    }
  }

  & > input + input {
    border-left: 0.5px solid #dddddd;
    border-radius: 0;
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  background-color: #fff;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const CalendarOverlay = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  // right: 0;
  z-index: 10;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 10px;

  @media (min-width: 769px) {
    right: 0;
  }

  @media (max-width: 768px) {
    top: 105%;
    padding: 10px;
    border-radius: 0;
    max-height: 90vh;
    overflow-y: auto;
  }
  @media (max-width: 450px) {
    max-width: -webkit-fill-available;
  }
`;

const StyledDateRange = styled(DateRange)`
  width: auto;

  @media (max-width: 768px) {
    width: 100% !important;
  }
`;

// Datepicker component

export default function Datepicker({ isModal = false, onDatesChange = null }) {
  const formatInput = (d) => format(d, "MMM dd, yyyy");

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [selectionStep, setSelectionStep] = useState("start"); // 'start' or 'end'
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const calendarRef = useRef(null);
  const wrapperRef = useRef(null);

  // Update mobile flag on resize
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    // Default dates setting  checkin today , checkout next day
    if (onDatesChange && dateRange) {
      const checkInDate = format(dateRange[0].startDate, "yyyy-MM-dd");
      const checkOutDate = format(dateRange[0].endDate, "yyyy-MM-dd");
      const totalNights =
        (dateRange[0].endDate - dateRange[0].startDate) / (1000 * 60 * 60 * 24);

      // console.log("date", dateRange, checkInDate, checkOutDate, totalNights);
      onDatesChange({
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights: totalNights,
      });
    }
  }, [dateRange]);

  // Close the calendar when clicking outside
  useEffect(() => {
    if (isModal) return;
    const handler = (e) => {
      if (wrapperRef.current?.contains(e.target)) return;
      if (calendarRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isModal]);

  // Handle date selection
  const handleChange = (ranges) => {
    setDateRange([ranges.selection]);
    if (selectionStep === "start") {
      setSelectionStep("end");
    } else {
      setSelectionStep("start");
      setOpen(false);
      if (onDatesChange) {
        onDatesChange({
          checkIn: format(ranges.selection.startDate, "yyyy-MM-dd"),
          checkOut: format(ranges.selection.endDate, "yyyy-MM-dd"),
          nights:
            (ranges.selection.endDate - ranges.selection.startDate) /
            (1000 * 60 * 60 * 24),
        });
      }
    }
  };

  return (
    <PickerWrapper ref={wrapperRef}>
      {!isModal && (
        <>
          <div onClick={() => open || setOpen(true)}>
            <Dates>
              <DateInput readOnly value={formatInput(dateRange[0].startDate)} />
              <DateInput readOnly value={formatInput(dateRange[0].endDate)} />
            </Dates>
          </div>
          {open && (
            <CalendarOverlay ref={calendarRef}>
              <StyledDateRange
                editableDateInputs={false}
                onChange={handleChange}
                months={isMobile ? 1 : 2}
                direction="horizontal"
                moveRangeOnFirstSelection={false}
                minDate={new Date()}
                ranges={dateRange}
              />
            </CalendarOverlay>
          )}
        </>
      )}

      {isModal && (
        <StyledDateRange
          editableDateInputs={true}
          onChange={handleChange}
          months={1}
          direction="horizontal"
          moveRangeOnFirstSelection={false}
          minDate={new Date()}
          ranges={dateRange}
        />
      )}
    </PickerWrapper>
  );
}
