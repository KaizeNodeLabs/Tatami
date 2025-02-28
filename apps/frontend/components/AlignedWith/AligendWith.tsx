import React from 'react';
import DojoImag from "@/public/dojo-icon.svg"
import CatrigeImage from "@/public/catridge_logo.png"
import CairoImage from "@/public/Cairo-logo.png"
import StarkNet from "@/public/starknet.png"
import Image from 'next/image';

const PartnersSection = () => {
  const partners = [
    {
      name: "Dojo Engine",
      logo: DojoImag,
      bgColor: "bg-red-600",
      buttonBg: "#EE2D3F66"
    },
    {
      name: "Catridge",
      logo: CatrigeImage,
      bgColor: "bg-yellow-600",
      buttonBg: "#FBCB4A66"
    },
    {
      name: "Cairo",
      logo: CairoImage,
      bgColor: "bg-red-500",
      buttonBg: "#EE2D3F66"
    },
    {
      name: "Starknet",
      logo: StarkNet,
      bgColor: "bg-blue-600",
      buttonBg:"#0C0C4F66" 
    }
  ];

  return (
    <div className="w-full h-auto md:h-[280px] bg-black text-secondary py-12 md:py-20 px-4 md:px-8">
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
          We are aligned with
        </h2>
        <p className="text-secondary text-sm md:text-base max-w-2xl mx-auto">
          Lorem Ipsum dolor sit ammet isterashai yut et mortem lortem vitae lid perplexit
        </p>
      </div>
  
      {/* Partners Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="bg-black flex flex-col md:flex-row items-center gap-3 p-4 rounded-lg  transition-colors duration-200"
          >
            {/* Partner Logo */}
            <div
              className={`w-12 h-12 rounded-full ${partner.bgColor} flex items-center justify-center flex-shrink-0`}
            >
              <Image
                src={partner.logo}
                width={500}
                height={500}
                alt={`${partner.name} logo`}
                className="w-6 h-6 md:w-8 md:h-8 object-contain"
              />
            </div>

            {/* Partner Info */}
            <div className="flex flex-col md:items-start items-center text-center md:text-left">
              <span className="text-white text-sm md:text-base font-semibold truncate">
                {partner.name}
              </span>
              <button
                className="text-xs sm:text-[10px] px-3 sm:px-2 py-1 rounded-full mt-2 md:mt-1 text-white opacity-80 hover:opacity-100 transition-opacity w-fit"
                style={{ backgroundColor: partner.buttonBg }}
              >
                Learn more
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default PartnersSection;