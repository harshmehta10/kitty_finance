import React from "react";
import kittysplit from "../assets/kittysplit.svg";
import { Link } from "react-router-dom";

const Intro = () => {
  return (
    <div className="bg-[#fffff0]">
      <div className="container mx-auto px-12 py-10 h-screen flex flex-col items-center justify-center space-y-8">
        <div className="flex  gap-5 items-center justify-center">
          <h1 className="text-4xl font-montserrat whitespace-nowrap">
            Welcome to
          </h1>
          <img src={kittysplit} alt="kitty" className="size-full" />
        </div>
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-5xl font-light text-[#444444] font-montserrat">
            Easy splitting of group expenses
          </h1>
          <p className="text-3xl font-light text-[#894693] font-raleway">
            The simplest way to calculate who owes what
          </p>
        </div>
        <div>
          <Link to="/expenses">
            <button className="bg-[#70e7ff] text-black text-2xl  px-5 py-3 rounded-2xl font-montserrat font-light hover:bg-[#75c2d2] transition duration-300 hover:cursor-pointer shadow-2xl/20  inset-shadow-sm">
              Start Splitting
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Intro;
