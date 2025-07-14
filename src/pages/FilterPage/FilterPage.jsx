import Header from '../../components/Header';
// import Container from "../../components/Container";
import FeaturesSection from '../Login/subcomponents/FeaturesSection';
import React from 'react';
// import styled from "styled-components";
import AboutSection from '../Login/subcomponents/AboutSection';
import FooterSection from '../Login/subcomponents/FooterSection';
import FilterSection from './subComponents/FilterSection';
import Container_NoGradient from '../../components/Container_NoGradient';
// import { usePermissions } from "../../context/PermissionsContext";
// import { useNavigate } from "react-router-dom";
// import { checkAuth } from "../../api/checkAuth";
// import { clearAuthToken } from "../../utils/authCookies";
// import { useState } from "react";
// import { useEffect } from "react";
// import { useAuthContext } from "../../context/AuthContext";
// import toast from "react-hot-toast";

function FilterPage() {
  // Full-width top bar for filter page

  // const FullWidthHeader = styled.div`
  //   width: 100%;
  //   // background: ${({ theme }) => theme.colors.header};
  //   display: flex;
  //   align-items: center;
  //   padding: 1rem 0;
  // `;
  // const FeatureWrapper = styled.div`
  //   position: relative;
  //   z-index: 0;
  // `;

  // const { permissions, hasPermission } = usePermissions();
  // const { token, setToken } = useAuthContext()

  // const navigate = useNavigate()
  // const [authChecked, setAuthChecked] = useState(false);

  // useEffect(() => {
  //   const verifyAuth = async () => {
  //     try {
  //       const res = await checkAuth();
  //       // console.log('res', res.authenticated)
  //       if (!res?.authenticated) {
  //         toast.error("Session expired!\nPlease login to continue", {
  //           style: { fontSize: "1.25rem", padding: "16px 24px" },
  //         });
  //         clearAuthToken(),
  //           setToken()
  //         // setIsAuthenticated(false);
  //         navigate("/"); // redirect to login
  //       }
  //     } catch (err) {
  //       toast.error("Session expired!\nPlease login to continue", {
  //         style: { fontSize: "1.25rem", padding: "16px 24px" },
  //       });
  //       clearAuthToken(),
  //         setToken()
  //       navigate("/");
  //     } finally {
  //       setAuthChecked(true);
  //     }
  //   };

  //   verifyAuth();
  // }, [token]);

  // if (!authChecked) {
  //   navigate('/')
  // };

  return (
    <>
      {/* Header will be on top  */}
      {/* <Container_NoGradient>
        <Header />
        <FullWidthHeader>
         
        </FullWidthHeader>
      </Container_NoGradient> */}
      {
        // hasPermission("booking.create") &&
        <FilterSection />
      }

      {/* <FeatureWrapper>
        <FeaturesSection />
      </FeatureWrapper> */}

      {/* <AboutSection /> */}

      {/* <FooterSection /> */}
    </>
  );
}

export default FilterPage;
