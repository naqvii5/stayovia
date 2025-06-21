import React from "react";
import styled from "styled-components";
import Datepicker from "../../../components/DatePicker";

function DateSelectionSection({ onDatesChange }) {
  return (
    <>
      <Datepicker onDatesChange={onDatesChange} />
    </>
  );
}

export default DateSelectionSection;
