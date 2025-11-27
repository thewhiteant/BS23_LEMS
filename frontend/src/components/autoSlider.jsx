import { useEffect, useState } from "react";

import cover from "../assets/images/cover.jpg";
import cover1 from "../assets/images/cover1.jpg";
import cover2 from "../assets/images/cover2.jpg";
import cover3 from "../assets/images/cover3.jpg";

const HeroSlider = () => {
  const slides = [
    {
      img: cover,
      title: "Welcome to Our Platform",
      subtitle: "Discover amazing features tailored for your needs.",
    },
    {
      img: cover1,
      title: "Advanced Event Management",
      subtitle: "Plan, organize, and track events effortlessly.",
    },
    {
      img: cover2,
      title: "Connect With People",
      subtitle: "Join communities and grow your network.",
    },
    {
      img: cover3,
      title: "Your Journey Starts Here",
      subtitle: "Simple. Fast. Powerful.",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden h-[70vh] md:h-[60vh] lg:h-[60vh]">

      {/* Slider */}
      <div
        className="flex transition-transform duration-[1200ms] ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-full h-full relative object-cover object-center flex-shrink-0">
            <img
              src={slide.img}
              alt="Hero Slide"
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Hero Content */}
            <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-20 text-white">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg mb-4">
                {slide.title}
              </h1>
              <p className="text-lg md:text-2xl opacity-90 max-w-2xl mb-6">
                {slide.subtitle}
              </p>
              <button className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-lg text-white border border-white/40 hover:bg-white/30 transition">
                Get Started →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-300 
              ${index === i ? "bg-white scale-125 shadow-xl" : "bg-white/40"}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
