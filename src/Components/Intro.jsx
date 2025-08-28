import React from "react";
import kittysplit from "../assets/kittysplit.svg";
import { Link } from "react-router-dom";

const Intro = () => {
  return (
    <div className="bg-[#fffff0]">
      <div className="container mx-auto px-6 lg:px-12 py-4 lg:py-10 h-screen flex flex-col items-center justify-center space-y-4 lg:space-y-8">
        <div className="flex gap-2 lg:gap-5 items-center justify-center">
          <h1 className="text-xl lg:text-4xl font-montserrat whitespace-nowrap">
            Welcome to
          </h1>
          <img src={kittysplit} alt="kitty" className="size-28 lg:size-full" />
        </div>
        <div className="flex flex-col items-center justify-center space-y-3 lg:space-y-8 text-center">
          <h1 className="text-xl lg:text-5xl font-light text-[#444444] font-montserrat">
            Easy splitting of group expenses
          </h1>
          <p className="text-base lg:text-3xl font-light text-[#894693] font-raleway ">
            The simplest way to calculate who owes what
          </p>
        </div>
        <div>
          <Link to="/expenses">
            <button className="bg-[#70e7ff] text-black text-lg lg:text-2xl  px-4 lg:px-5 py-3 rounded-2xl font-montserrat font-light hover:bg-[#75c2d2] transition duration-300 hover:cursor-pointer shadow2 ">
              Start Splitting
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Intro;
