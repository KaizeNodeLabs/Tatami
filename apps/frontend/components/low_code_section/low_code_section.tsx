import React from "react";
import Image from "next/image";
import LowCode from "../../public/Group 68.svg";

const low_code_section = () => {
  return (
    <div className="w-full h-auto bg-black text-secondary py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
            Tatami as low-code tool
          </h2>
          <p className="text-secondary-foreground lg:text-lg md:text-base mx-auto">
            Tatami provides a low-code tool to developt the on-chain logic layer
            for your next on-chain game
          </p>
        </div>

        <div className="flex items-center justify-center ">
          <Image
            src={LowCode}
            width={700}
            height={700}
            alt={"low cod section"}
          />
        </div>
        {/* </div>
             ))} */}
      </div>
    </div>
  );
};

export default low_code_section;
