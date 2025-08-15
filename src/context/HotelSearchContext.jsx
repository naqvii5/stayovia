import { useState } from 'react';
import { createContext, useContext } from 'react';

const HotelSearchContext = createContext();

export const HotelSearchProvider = ({ children }) => {
  const [hotelSearchData, setHotelSearchData] = useState([]);
  const [specificHotelSearchData, setSpecificHotelSearchData] = useState([]);
  const [filteringData, setFilteringData] = useState([]);
  const [buyersGroupData, setBuyersGroupData] = useState([]);
  const [exchangeGroupData, setExchangeGroupData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [grandTotalWithBuyersGroup, setGrandTotalWithBuyersGroup] = useState(0);

  return (
    <HotelSearchContext.Provider
      value={{
        hotelSearchData,
        filteringData,
        specificHotelSearchData,
        buyersGroupData,
        grandTotal,
        grandTotalWithBuyersGroup,
        exchangeGroupData,
        setExchangeGroupData,
        setBuyersGroupData,
        setGrandTotal,
        setGrandTotalWithBuyersGroup,
        setSpecificHotelSearchData,
        setHotelSearchData,
        setFilteringData,
      }}
    >
      {children}
    </HotelSearchContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useHotelSearch = () => useContext(HotelSearchContext);
