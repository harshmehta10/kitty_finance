import React, { useEffect } from "react";
import kittysplit from "../assets/kittysplit.svg";
import { Link } from "react-router-dom";

const Intro = () => {
  // Create floating particles
  useEffect(() => {
    const createParticles = () => {
      const particleCount = 25;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.style.cssText = `
          position: fixed;
          width: 3px;
          height: 3px;
          background: rgba(137, 70, 147, 0.3);
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
          z-index: 1;
          animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
          animation-delay: ${Math.random() * 4}s;
        `;

        document.body.appendChild(particle);
      }
    };

    const twinkleStyle = document.createElement("style");
    twinkleStyle.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      .gradient-bg {
        background: linear-gradient(-45deg, #dfebed, #e8f4f8, #f0e6ff, #dfebed);
        background-size: 400% 400%;
        animation: gradient-shift 15s ease infinite;
      }
    `;
    document.head.appendChild(twinkleStyle);

    createParticles();

    // Cleanup function
    return () => {
      document
        .querySelectorAll('[style*="twinkle"]')
        .forEach((el) => el.remove());
    };
  }, []);

  // Mouse movement parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const floatingElements = document.querySelectorAll(".floating-element");
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      floatingElements.forEach((el, index) => {
        const speed = (index + 1) * 0.3;
        const x = mouseX * speed * 10;
        const y = mouseY * speed * 10;

        el.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="gradient-bg h-screen flex items-center justify-center px-12 py-5 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="floating-element absolute top-20 left-10 w-32 h-32 bg-purple-400 opacity-10 rounded-full transition-transform duration-300 ease-out"
          style={{ animation: "float 8s ease-in-out infinite" }}
        ></div>
        <div
          className="floating-element absolute top-60 right-10 w-24 h-24 bg-teal-400 opacity-10 rounded-lg transition-transform duration-300 ease-out"
          style={{
            animation: "float 8s ease-in-out infinite",
            animationDelay: "2s",
          }}
        ></div>
        <div
          className="floating-element absolute bottom-20 left-20 w-20 h-20 bg-pink-400 opacity-10 rounded-full transition-transform duration-300 ease-out"
          style={{
            animation: "float 8s ease-in-out infinite",
            animationDelay: "4s",
          }}
        ></div>
        <div
          className="floating-element absolute top-1/3 right-1/4 w-16 h-16 bg-indigo-400 opacity-10 rounded-xl transition-transform duration-300 ease-out"
          style={{
            animation: "float 8s ease-in-out infinite",
            animationDelay: "6s",
          }}
        ></div>
      </div>

      {/* Animated Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-1/3 w-32 h-32 bg-gradient-to-br from-teal-300/20 to-blue-300/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Your Original Content */}
      <div className="container mx-auto space-y-4 lg:space-y-8 py-12 px-12 flex flex-col items-center justify-center  relative z-10">
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
          <p className="text-base lg:text-3xl font-light text-[#894693] font-raleway">
            The simplest way to calculate who owes what
          </p>
        </div>
        <div>
          <Link to="/expenses">
            <button className="bg-[#70e7ff] text-black text-lg lg:text-2xl px-4 lg:px-5 py-3 rounded-2xl font-montserrat font-light hover:bg-[#75c2d2] transition duration-300 hover:cursor-pointer shadow2 hover:translate-y-2 hover:scale-105">
              Start Splitting
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Intro;
