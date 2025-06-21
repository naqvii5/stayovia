import React from "react";
import LoginSection from "./subcomponents/LoginSection";
import FeaturesSection from "./subcomponents/FeaturesSection";
import AboutSection from "./subcomponents/AboutSection";
import FooterSection from "./subcomponents/FooterSection";

function LoginPage() {
  return (
    <div>
      <LoginSection />
      <FeaturesSection />
      <AboutSection />
      <FooterSection />
    </div>
  );
}

export default LoginPage;
