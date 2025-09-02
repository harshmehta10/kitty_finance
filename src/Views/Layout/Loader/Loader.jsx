import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loader = () => {
  return (
    <div className="container mx-auto px-12 py-5 h-screen flex items-center justify-center">
      <DotLottieReact
        src="https://lottie.host/50dceb27-d74e-4981-9210-1414573baedf/rCX6XMMSOQ.lottie"
        loop
        autoplay
      />
    </div>
  );
};

export default Loader;
