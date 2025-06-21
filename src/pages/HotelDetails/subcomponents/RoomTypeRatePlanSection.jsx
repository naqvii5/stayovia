import React, { useState } from 'react';
import {
    TableBody,
    TableRow,
    TableCell,
    Box,
} from '@mui/material';

import { MyButton } from '../../../components/MyButton';
import { useTheme } from 'styled-components';

function RoomTypeRatePlanSection({
    room,
    cart,
    setCart,
    applyMarginFunc,
    applyExchange,
    updateCartQty,
    addRatePlan,
    makeKey,
    buyersGroupData,
    cartHasRefundable,
    cartHasNonRefundable
}) {
    const styledTheme = useTheme();

    const totalBookedForThisRoomType = cart
        .filter((item) => item.roomTypeId === room.RoomTypeId)
        .reduce((sum, item) => sum + item.rooms, 0);

    const remainingCapacity = room.RoomAvaiabile - totalBookedForThisRoomType;

    return (
        <TableBody>
            {room.rateplans.map((rt, index) => {
                const key = makeKey(room.RoomTypeId, rt.RatePlanId, index);
                const inCart = cart.find((item) => item.key === key);
                const bookedThisPlan = inCart ? inCart.rooms : 0;
                const disableIncrement = remainingCapacity <= 0;

                const disableAdd =
                    remainingCapacity <= 0 ||
                    (cartHasRefundable && rt.NonRefundableRate) ||
                    (cartHasNonRefundable && !rt.NonRefundableRate);

                const fontStyle = {
                    color: styledTheme.colors.primaryText,
                    fontSize: styledTheme.fontSizes.xsmall,
                    fontWeight: 400,
                };

                // Price calculation logic
                const basePrice = rt.TotalPrice - rt.TotalTax;
                const tax = rt.TotalTax;
                let finalPrice = basePrice;

                if (applyMarginFunc(rt)) {
                    if (buyersGroupData.type_charged === 'fixed') {
                        finalPrice += buyersGroupData.margin;
                    } else {
                        finalPrice += (basePrice * buyersGroupData.margin) / 100;
                    }
                }

                finalPrice += tax;

                const convertedPrice = applyExchange(finalPrice);

                return (
                    <TableRow key={`${rt.RatePlanId}_${index}`}>
                        <TableCell sx={fontStyle}>{rt.RatePlanName}</TableCell>

                        <TableCell sx={fontStyle}>
                            {rt.BreakfastIncluded ? 'Included' : 'Not Included'}
                        </TableCell>

                        <TableCell sx={fontStyle}>
                            {rt.CancellationPolicy && rt.CancellationPolicy.Hours - 24 > 0
                                ? `${rt.CancellationPolicy.Hours - 24} hours`
                                : ''}
                        </TableCell>

                        <TableCell sx={fontStyle}>
                            PKR {convertedPrice.toFixed(2)}
                        </TableCell>

                        <TableCell sx={fontStyle}>
                            Adults: {rt.Adults} <br />
                            Children: {rt.Children}
                        </TableCell>

                        <TableCell sx={fontStyle}>
                            {rt.NonRefundableRate ? 'Non Refundable' : 'Refundable'}
                        </TableCell>

                        <TableCell>
                            {inCart ? (
                                <Box display="flex" alignItems="center" gap={1}>
                                    <MyButton
                                        bgColor="none"
                                        padding="6px 14px"
                                        borderRadius="16px"
                                        fontSize={styledTheme.fontSizes.large}
                                        textColor={styledTheme.colors.primary}
                                        onClick={() => updateCartQty(key, -1, index, room.RoomAvaiabile)}
                                    >
                                        -
                                    </MyButton>
                                    <span style={{ ...fontStyle }}>{inCart.rooms}</span>
                                    <MyButton
                                        bgColor="none"
                                        padding="6px 12px"
                                        borderRadius="16px"
                                        fontSize={styledTheme.fontSizes.large}
                                        textColor={styledTheme.colors.primary}
                                        onClick={() => updateCartQty(key, +1, index, room.RoomAvaiabile)}
                                        disabled={disableIncrement}
                                    >
                                        +
                                    </MyButton>
                                </Box>
                            ) : (
                                <MyButton
                                    bgColor={styledTheme.colors.primary}
                                    padding="10px 18px"
                                    borderRadius="16px"
                                    fontSize={styledTheme.fontSizes.xsmall}
                                    onClick={() => addRatePlan(room, rt, index)}
                                    disabled={disableAdd}
                                >
                                    ADD
                                </MyButton>
                            )}
                        </TableCell>
                    </TableRow>
                );
            })}
        </TableBody>
    );
}

export default RoomTypeRatePlanSection;
