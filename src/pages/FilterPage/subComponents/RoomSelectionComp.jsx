// RoomSelectionComp.jsx
import React, { useState, useRef, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import { MyButton } from "../../../components/MyButton";

const RoomsWrapper = styled.div`
  grid-area: rooms;
  position: relative;
  // align-self: stretch;
`;

const SummaryInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  //   border: 0.5px solid ${({ theme }) => theme.colors.secondaryText};
  border: 0.5px solid #dddddd;
  background: ${({ theme }) => theme.colors.mainBackground};
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  border-radius: 0.8rem;
  cursor: pointer;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  height: 250px;
  overflow-y: auto;
  right: calc(0%);
  width: 350px;
  background: ${({ theme }) => theme.colors.mainBackground};
  border: 1px solid #e5e4e4;
  //   border: 1px solid ${({ theme }) => theme.colors.secondaryText};
  border-radius: 0.8rem;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: -webkit-fill-available;
  }
`;

const RoomRow = styled.div`
  &:not(:first-child) {
    border-top: 0.5px solid ${({ theme }) => theme.colors.primary};
    margin-top: 1rem;
    padding-top: 1rem;
  }
`;

const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 500;

  .header-label {
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
  .remove-btn {
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.secondaryText};
    cursor: pointer;
    font-size: 1rem;
  }
`;

const CounterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  .label {
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
    margin:0 5px;
  }
  span {
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
    margin:0 6px;
  }
  .controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    button {
      width: 2.1rem;
      height: 2.1rem;
      // border: 1px solid ${({ theme }) => theme.colors.secondaryText};
      background: none;
      border-radius: 0.45rem;
      cursor: pointer;
      font-size: ${({ theme }) => theme.fontSizes.small};
    }
  }
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  // border: 1px solid ${({ theme }) => theme.colors.secondaryText};
  margin-top: 1rem;
`;
const CartBottomRow = styled.div`
  // border: 1px solid ${({ theme }) => theme.colors.primaryHeading};
  border: none;
  padding: 3px;
  border-radius: 1rem;
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.primary};
`;

const AddRoomButton = styled.button`
  padding: 0.75rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px dashed ${({ theme }) => theme.colors.secondaryText};
  background: none;
  border-radius: 0.8rem;
  cursor: pointer;
`;

const CloseButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.primaryText};
  background: none;
  border: none;
  cursor: pointer;
`;

export default function RoomSelectionComp({ rooms, setRooms }) {
  const theme = useTheme();
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  // const [rooms, setRooms] = useState([
  //   { label: "Room 1", Adults: 1, Children: 0 },
  // ]);
  // NEW: guestRoomInfo state
  const [guestRoomInfo, setGuestRoomInfo] = useState([]);

  // close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ANY time `rooms` changes, rebuild guestRoomInfo:
  useEffect(() => {
    const info = rooms.map((r, i) => ({
      Room: i + 1,
      index: i + 1,
      adults: r.Adults,
      children: r.Children,
    }));
    setGuestRoomInfo(info);
  }, [rooms]);

  // (Optional) watch it:
  // useEffect(() => {
  //   console.log("guestRoomInfo:", guestRoomInfo);
  // }, [guestRoomInfo]);

  const toggleOpen = () => setOpen((o) => !o);

  const changeCount = (idx, type, delta) => {
    setRooms((rs) =>
      rs.map((r, i) =>
        i === idx
          ? {
            ...r,
            [type]: Math.max(
              type === "Adults" ? 1 : 0,
              Math.min(4, r[type] + delta)
            ),
          }
          : r
      )
    );
  };

  const addRoom = () => {
    if (rooms.length >= 5) return;
    setRooms((rs) => [
      ...rs,
      { label: `Room ${rs.length + 1}`, Adults: 1, Children: 0 },
    ]);
  };

  const removeRoom = (idx) => {
    if (idx === 0) return; // can’t remove Room 1
    setRooms((rs) =>
      rs
        .filter((_, i) => i !== idx)
        .map((r, i) => ({ ...r, label: `Room ${i + 1}` }))
    );
  };

  const summaryText = () => {
    const adults = rooms.reduce((s, r) => s + r.Adults, 0);
    const children = rooms.reduce((s, r) => s + r.Children, 0);
    return `${rooms.length} Room${rooms.length > 1 ? "s" : ""
      }, ${adults} Adult${adults > 1 ? "s" : ""}, ${children} Child${children !== 1 ? "ren" : ""
      }`;
  };

  return (
    <RoomsWrapper ref={wrapperRef}>
      <SummaryInput
        readOnly
        value={`${guestRoomInfo.length} Room${guestRoomInfo.length > 1 ? "s" : ""
          }, ${guestRoomInfo.reduce((s, r) => s + r.adults, 0)} Adult${guestRoomInfo.reduce((s, r) => s + r.adults, 0) > 1 ? "s" : ""
          }, ${guestRoomInfo.reduce((s, r) => s + r.children, 0)} Child${guestRoomInfo.reduce((s, r) => s + r.children, 0) !== 1 ? "ren" : ""
          }`}
        onClick={() => setOpen((o) => !o)}
      />

      {open && (
        <Dropdown>
          {rooms.map((room, i) => (
            <RoomRow key={i}>
              <RoomHeader>
                <span className="header-label">{room.label}</span>
                {i > 0 && (
                  <button
                    className="remove-btn"
                    onClick={() => removeRoom(i)}
                    aria-label={`Remove ${room.label}`}
                  >
                    <AiOutlineClose size={16} />
                  </button>
                )}
              </RoomHeader>

              <CounterRow>
                <span className="label">Adults</span>
                <div className="controls">
                  <CartBottomRow>
                    <MyButton
                      bgColor="none"
                      border="none"
                      fontSize={theme.fontSizes.xsmall}
                      textColor={theme.colors.primaryText}
                      onClick={() => changeCount(i, "Adults", -1)}
                    >
                      -{" "}
                    </MyButton>
                    {/* <button onClick={() => changeCount(i, "Adults", -1)}>
                    -
                  </button> */}
                    <span>{room.Adults}</span>
                    <MyButton
                      bgColor="none"
                      border="none"
                      fontSize={theme.fontSizes.xsmall}
                      textColor={theme.colors.primaryText}
                      onClick={() => changeCount(i, "Adults", +1)}
                    >
                      +{" "}
                    </MyButton>
                    {/* <button onClick={() => changeCount(i, "Adults", +1)}>
                    +
                  </button> */}
                  </CartBottomRow>
                </div>
              </CounterRow>

              <CounterRow>
                <span className="label">Children</span>
                <div className="controls">
                  <CartBottomRow>
                    {/* <button onClick={() => changeCount(i, "Children", -1)}>
                    -{" "}
                    </button> */}
                    <MyButton
                      bgColor="none"
                      border="none"
                      fontSize={theme.fontSizes.xsmall}
                      textColor={theme.colors.primaryText}
                      onClick={() => changeCount(i, "Children", -1)}
                    >
                      -{" "}
                    </MyButton>
                    <span>{room.Children}</span>
                    <MyButton
                      bgColor="none"
                      border="none"
                      fontSize={theme.fontSizes.xsmall}
                      textColor={theme.colors.primaryText}
                      onClick={() => changeCount(i, "Children", +1)}
                    >
                      +{" "}
                    </MyButton>
                    {/* <button onClick={() => changeCount(i, "Children", +1)}>
                    +
                  </button> */}
                  </CartBottomRow>
                </div>
              </CounterRow>
            </RoomRow>
          ))}

          <BottomRow>
            {/* <MyButton
              name="my-action"
              padding="1rem 2rem"
              width="200px"
              fontSize="1.8rem"
              bgColor="#ff5722"
              textColor="#fff"
              borderRadius="12px"
              boxShadow="0 4px 6px rgba(0,0,0,0.1)"
              cursor="pointer"
              transition="background 0.3s ease"
              opacity={0.9}
              hoverBgColor="#e64a19"
              activeTransform="scale(0.95)"
              focusBoxShadow="0 0 0 3px #327ff3"
              onClick={addRoom}
            >
              + Add a Room
            </MyButton> */}
            <MyButton
              bgColor="none"
              fontSize={theme.fontSizes.xsmall}
              textColor="#327ff3"
              onClick={addRoom}
            >
              + Add a Room
            </MyButton>

            {/* <AddRoomButton onClick={addRoom}>+ Add a Room</AddRoomButton> */}
            <CloseButton onClick={() => setOpen(false)}>Close</CloseButton>
          </BottomRow>
        </Dropdown>
      )}
    </RoomsWrapper>
  );
}
