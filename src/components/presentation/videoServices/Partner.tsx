import React from "react";

import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/resources/multiLanguages";
import PartnerSlider from "../../common/carousel/PartnerCarousel";


const Partner = () => {
  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );
  
const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  return (
    <div className="mt-[40px]">
      <p 
      className={`${
              themeReducer === "light" ? "text-[#5E5E5E]" : "text-[#E5E5E5]"
            } w-full mx-auto text-center mb-[20px] lg:mb-[32px] font-poppins font-regular text-[12px] md:text-[16px] xl:text-[17px] 2xl:text-[18px] `}>
       {/* className="font-helvetica font-normal text-[14px] md:text-[16px] xl:text-[17px] 2xl:text-[18px] text-[#14172D] text-center w-full pt-[30px] lg:pt-[35px] xl:pt-[43px] mb-[25px] lg:mb-[30px] 2xl:mb-[38px]"> */}
        {dictionary["partners"][languageReducer]["title"]}
      </p>
      <PartnerSlider />
    </div>
  );
};

export default Partner;
