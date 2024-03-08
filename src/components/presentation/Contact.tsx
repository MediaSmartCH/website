import React from "react";
import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";
import { useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/resources/multiLanguages";
import email from "../../assets/icons/email.svg";
import address from "../../assets/icons/address.svg";
import phone from "../../assets/icons/phone.svg";
import insta from "../../assets/icons/contactInsta.svg";
import linkedin from "../../assets/icons/contactLinkedin.svg";
import contactUser from "../../assets/icons/contactUser.svg";
import contactEmail from "../../assets/icons/contactEmail.svg";
import contactPhone from "../../assets/icons/contactPhone.svg";
import contactMessage from "../../assets/icons/contactMessage.svg";
import arrow from "../../assets/icons/rightArrow.svg";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(e.target.checked);
  };
  const languageReducer = useAppSelector((state) => state.language.currentLanguage);

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [contact, setContact] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const handleInvalid = (e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) => {
    console.log('Invalid event triggered');
    e.preventDefault();
    const target = e.currentTarget;
    
    if (target.name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (target.value === '') {
        target.setCustomValidity(dictionary["contact"][languageReducer]["requiredEmailError"]);
      } else if (!emailRegex.test(target.value)) {
        target.setCustomValidity(dictionary["contact"][languageReducer]["invalidEmailError"]);
      } else {
        target.setCustomValidity('');
      }
    }
  
    if (target.name === 'name') {
      if (target.value === '') {
        target.setCustomValidity(dictionary["contact"][languageReducer]["requiredNameError"]);
      } else {
        target.setCustomValidity('');
      }
    }
  
    if (target.name === 'phone') {
      const phoneRegex = /^(\+\d{6,}|\d{4})$/; // Regex for the phone validation
      if (target.value === '') {
        target.setCustomValidity(dictionary["contact"][languageReducer]["requiredMobileError"]);
      } else if (!phoneRegex.test(target.value)) {
        target.setCustomValidity(dictionary["contact"][languageReducer]["invalidMobileError"]);
      } else {
        target.setCustomValidity('');
      }
    }

    if (target.name === 'message') {
      if (target.value === '') {
        target.setCustomValidity(dictionary["contact"][languageReducer]["requiredMessageError"]);
      } else {
        target.setCustomValidity('');
      }
    }
  
    target.reportValidity(); // This will force the browser to report the custom validity message
  };
  
  
  const handleChange = (e: any) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };
  const handleClick = () => {
    // setDone(false);
    setTimeout(() => {
      setDone(false);
    }, 3000);
  };
  const [isChecked, setIsChecked] = React.useState(false);
  const [error, setError] = React.useState("");

  const onCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
    setError(""); // Reset error message when checkbox is checked
  };
  return (
    <div className={`${themeReducer === "light" ? "bg-[#F7F7FF]" : "bg-[#2B284C]"} `} id="contact">
      <div className="md:px-[20px] lg:px-[40px] xl:px-[60px] 2xl:px-[90px] mt-[32px] lg:mt-[42px] 2xl:mt-[54px]">
        <div className="w-full homepage-container px-[25px] md:px-[40px] lg:px-[50px] xl:px-[60px] 2xl:px-[70px] mx-auto pt-[32px] pb-[45px] lg:pt-[62px] lg:pb-[75px] 2xl:pt-[87px] 2xl:pb-[103px]">
          <p
            className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#F6F6F6]"
              } w-full mx-auto text-center mb-[18px] lg:mb-[32px] 2xl:mb-[47px] leading-[36px] lg:leading-[46px] xl:leading-[72px] font-redDisplay font-bold text-[24px] md:text-[28px] lg:text-[32px] xl:text-[34px] 2xl:text-[36px] `}
          >
            {dictionary["contact"][languageReducer]["title"]}
          </p>
          <div
            className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#E5E5E5]"
              } flex flex-col-reverse lg:flex-row items-center justify-center lg:justify-between gap-y-[35px] `}
          >
            <div className="w-full lg:w-[50%]" data-aos="fade-right" data-aos-duration="1000">
              <div className="flex items-center gap-x-[18px]">
                <img src={email} alt="email" className="" />
                <p className="font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] text-[#]">
                  <a href="mailto:hello@mediasmart.ch" className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#F6F6F6]"}`}>hello@mediasmart.ch</a>
                </p>
              </div>
              <div className="flex items-center gap-x-[18px] my-[15px] lg:my-[31px]">
                <img src={address} alt="address" className="" />
                <p className="font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]">
                  <a href="https://maps.app.goo.gl/CthoJ9r99naTzbTA9" className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#F6F6F6]"}`} target="_blank">Route Principale 3, 1903 Collonges</a>
                </p>
              </div>
              <div className="flex items-center gap-x-[18px]">
                <img src={phone} alt="phone" className="" />
                <p className="font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px]">
                  <a href="tel:+41796578612" className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#F6F6F6]"}`}>+41 79 657 86 12</a>
                </p>
              </div>
              <div className="flex items-center gap-x-[13px] mt-[25px] lg:mt-[45px]">
                <a
                  className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"
                    } h-[58px] lg:h-[65px] xl:h-[71px] px-[24px] lg:px-[29px] border-2 border-[#677DFF33] hover:border-[#5f75f5] transition delay-150 duration-300 ease-in-out rounded-[11px] flex items-center justify-center gap-x-[8px] lg:gap-x-[10px] font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] `}
                  href="https://www.instagram.com/MediaSmartCH"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    <img src={insta} alt="insta" className="w-[23px] h-[23px] lg:w-[27px] lg:h-[27px]" />
                  </span>
                  <span>Instagram</span>
                </a>
                <a
                  className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"
                    } h-[58px] lg:h-[65px] xl:h-[71px] px-[24px] lg:px-[29px] border-2 border-[#677DFF33] hover:border-[#5f75f5] transition delay-150 duration-300 ease-in-out rounded-[11px] flex items-center justify-center gap-x-[8px] lg:gap-x-[13px] font-poppins font-light text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] `}
                  href="https://www.linkedin.com/company/MediaSmartCH"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    <img src={linkedin} alt="insta" className="w-[23px] h-[23px] lg:w-[27px] lg:h-[27px]" />
                  </span>
                  <span>Linkedin</span>
                </a>
              </div>
            </div>
            <form
              className="w-full lg:w-[50%]"
              data-aos="fade-up"
              data-aos-duration="1200"
              onSubmit={(e) => {
                e.preventDefault();
                if (!isChecked) {
                  setError(dictionary["contact"][languageReducer]["errorText"]);
                  return;
                }
                setLoading(true);
                emailjs.send("REMOVED_EMAILJS_SERVICE_ID", "REMOVED_EMAILJS_TEMPLATE_ID", contact, "REMOVED_EMAILJS_PUBLIC_KEY").then(
                  (response) => {
                    setLoading(false);
                    setDone(true);
                    setContact({
                      name: "",
                      email: "",
                      phone: "",
                      message: "",
                    });
                    handleClick();
                    setIsChecked(false)
                  },
                  (error) => {
                    console.log("FAILED...", error);
                  }
                );
              }}
            >
              <div
                className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"
                  } relative flex justify-between items-center border-2 border-[#C8CAE4] rounded-[11px] px-[24px] lg:px-[28px] py-[15px] lg:py-[20px] mb-[16px] lg:mb-[22px] `}
              >

                <input
                  placeholder={dictionary["contact"][languageReducer]["name"]}
                  className={`custom-contact-input ${themeReducer === "light"
                      ? "text-[#222222] placeholder:text-[#222222]"
                      : "text-[#E5E5E5 placeholder:text-[#E5E5E5]"
                    } `}
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onInvalid={handleInvalid}
                  value={contact.name}
                  required
                />
                <img src={contactUser} alt="User" className="" />
              </div>
              <div
                className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"
                  } relative flex justify-between items-center border-2 border-[#C8CAE4] rounded-[11px] px-[24px] lg:px-[28px] py-[15px] lg:py-[20px] mb-[16px] lg:mb-[22px] `}
              >
                <input
                  placeholder={dictionary["contact"][languageReducer]["email"]}
                  className={`custom-contact-input ${themeReducer === "light" ? "text-[#222222] placeholder:text-[#222222]" : "text-[#E5E5E5] placeholder:text-[#E5E5E5]"
                    } `}
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onInvalid={handleInvalid}
                  value={contact.email}
                  required
                />
                <img src={contactEmail} alt="Email" className="" />
              </div>
              <div
                className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"
                  } relative flex justify-between items-center border-2 border-[#C8CAE4] rounded-[11px] px-[24px] lg:px-[28px] py-[15px] lg:py-[20px] mb-[16px] lg:mb-[22px] `}
              >
                <input
                  placeholder={dictionary["contact"][languageReducer]["mobile"]}
                  className={`custom-contact-input ${themeReducer === "light"
                      ? "text-[#222222] placeholder:text-[#222222]"
                      : "text-[#E5E5E5 placeholder:text-[#E5E5E5]"
                    } `}
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  onInvalid={handleInvalid}
                  value={contact.phone}
                />
                <img src={contactPhone} alt="Mobile" className="" />
              </div>
              <div
                className={`${themeReducer === "light" ? "bg-white" : "bg-[#685A9C]"
                  } relative flex justify-between items-center border-2 border-[#C8CAE4] rounded-[11px] px-[24px] lg:px-[28px] py-[15px] lg:py-[20px] mb-[16px] lg:mb-[22px] `}
              >
                <textarea
                  placeholder={dictionary["contact"][languageReducer]["message"]}
                  className={`custom-contact-input ${themeReducer === "light"
                      ? "text-[#222222] placeholder:text-[#222222]"
                      : "text-[#E5E5E5 placeholder:text-[#E5E5E5]"
                    } `}
                  rows={4}
                  style={{ resize: "none" }}
                  name="message"
                  onChange={handleChange}
                  onInvalid={handleInvalid}
                  value={contact.message}
                  required
                />
                <img src={contactMessage} alt="help" className="absolute right-[24px] top-[24px]" />
              </div>
              <div className="contact-checkbox">
                <Checkbox onChange={onCheckboxChange} checked={isChecked}>
                  <p
                    className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#E5E5E5]"
                      } font-poppins font-light text-[14px] md:text-[15px] 2xl:text-[16px] ml-[6px]`}
                  >
                    {dictionary["contact"][languageReducer]["checkboxText"]}
                  </p>
                </Checkbox>
              </div>
              <div className="required-text mt-[16px] lg:mt-[22px]">
                <p
                  className={`${themeReducer === "light" ? "text-[#222222]" : "text-[#E5E5E5]"
                    } font-poppins font-light text-[14px] md:text-[15px] 2xl:text-[16px] `}
                >
                  {dictionary["contact"][languageReducer]["required"]}
                </p>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="mt-[16px] lg:mt-[22px] flex justify-center lg:justify-start">
                <button
                  type="submit"
                  className="custom-btn rounded-[80px] text-white px-[50px] lg:px-[54px] py-[11px] lg:py-[16px]"
                >
                  {done ? (
                    <span className="flex items-center gap-x-[10px] lg:gap-x-[24px] custom-btn-inner">Done</span>
                  ) : loading ? (
                    <span className="flex items-center gap-x-[10px] lg:gap-x-[24px] custom-btn-inner">Loading...</span>
                  ) : (
                    <span className="flex items-center gap-x-[10px] lg:gap-x-[24px] custom-btn-inner">
                      {dictionary["contact"][languageReducer]["contactBtn1"]}
                      <span>
                        <img src={arrow} alt="arrow" className="" />
                      </span>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
