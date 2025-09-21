import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import { PopupButton } from "react-calendly";

import { useAppDispatch, useAppSelector } from "services/hooks/hooks";
import { dictionary } from "services/locales";
import { setLanguage } from "store/slices/common/languageSlice";
import { setTheme } from "store/slices/common/themeSlice";
import logo from "assets/images/logo-header.png";
import logoDark from "assets/images/logo-footer.png";
import toggler from "assets/icons/toggler.svg";
import flag1 from "assets/images/flag1.png";
import flag2 from "assets/images/french.png";
import dropdown from "assets/icons/dropdown.svg";
import dropdownDark from "assets/icons/dropdownDark.svg";
import light from "assets/images/light.png";
import dark from "assets/images/dark.png";

import { useLangLink } from "services/router/langPath"; 

import "components/preLoader/preLoader.css"

// import { debounce } from 'lodash';

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();
  const { L, Lhash } = useLangLink();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isThemeChanging, setIsThemeChanging] = React.useState(false);

  const rootElement = document.getElementById("root");
  const dispatch = useAppDispatch();

  const languageReducer = useAppSelector(
    (state) => state.language.currentLanguage
  );

  const themeReducer = useAppSelector((state) => state.theme.currentTheme);

  const handleLanguageChange = (languageCode: string) => {
    const stripped = pathname.replace(/^\/(fr|en)/, "");
    navigate(`/${languageCode}${stripped}${search || ""}${hash || ""}`, { replace: true });
  };

  // const debouncedThemeChange = useCallback(
  //   debounce(() => {
  //     const newTheme = themeReducer === "light" ? "dark" : "light";
  //     dispatch(setTheme(newTheme));
  //   }, 300), // Attendre 300ms avant d'appliquer le changement
  //   [themeReducer, dispatch]
  // );

  // const handleThemeChange = () => {
  //   debouncedThemeChange();
  // };

  const handleThemeChange = () => {
    if (isThemeChanging) return; // Empêcher les clics multiples

    setIsThemeChanging(true);
    const newTheme = themeReducer === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));

    // Laisser le temps aux lotties de se charger
    setTimeout(() => {
      setIsThemeChanging(false);
    }, 500);
  };

  // const handleThemeChange = () => {
  //   const newTheme = themeReducer === "light" ? "dark" : "light";
  //   dispatch(setTheme(newTheme));
  // };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (document.documentElement.scrollTop > 100) {
        const header = document.querySelector("header");
        if (header) {
          header.classList.add("shrink");
        }
      } else {
        const header = document.querySelector("header");
        if (header) {
          header.classList.remove("shrink");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menu = (
    <Menu className="w-[80px]">
      <Menu.Item key="fr" onClick={() => handleLanguageChange("fr")}>
        <div className="flex items-center gap-x-[6px]">
          <img
            src={flag2}
            alt="flag2"
            className="w-[16px] h-[16px]  rounded-full"
          />
          FR
        </div>
      </Menu.Item>
      <Menu.Item key="en" onClick={() => handleLanguageChange("en")}>
        <div className="flex items-center gap-x-[6px]">
          <img
            src={flag1}
            alt="flag1"
            className="w-[16px] h-[16px]  rounded-full"
          />
          EN
        </div>
      </Menu.Item>
    </Menu>
  );

  const menuOptions = (
    <Menu className="w-full header-dropdown">
      <Menu.Item key="home">
        <Link
          to={Lhash("#home")}
          className={`${themeReducer === "light" ? "menu-text-light" : "menu-text-dark"
            } font-helvetica font-medium text-[16px] md:text-[16px] xl:text-[15px] 2xl:text-[16px] pl-[5px]`}
        >
          {dictionary["navbar"][languageReducer]["navItem1"]}
        </Link>
      </Menu.Item>
      <Menu.Item key="it-services">
        <Link
          to={L("/it-services")}
          className={`${themeReducer === "light" ? "menu-text-light" : "menu-text-dark"
            } font-helvetica font-medium text-[16px] md:text-[16px] xl:text-[15px] 2xl:text-[16px] pl-[5px]`}
        >
          {dictionary["navbar"][languageReducer]["navItem2"]}
        </Link>
      </Menu.Item>
      <Menu.Item key="video-services">
        <Link
          to={L("/video-services")}
          className={`${themeReducer === "light" ? "menu-text-light" : "menu-text-dark"
            } font-helvetica font-medium text-[16px] md:text-[16px] xl:text-[15px] 2xl:text-[16px] pl-[5px]`}
        >
          {dictionary["navbar"][languageReducer]["navItem3"]}
        </Link>
      </Menu.Item>
      <Menu.Item key="about">
        <Link
          to={Lhash("#about")}
          className={`${themeReducer === "light" ? "menu-text-light" : "menu-text-dark"
            } font-helvetica font-medium text-[16px] md:text-[16px] xl:text-[15px] 2xl:text-[16px] pl-[5px]`}
        >
          {dictionary["navbar"][languageReducer]["navItem4"]}
        </Link>
      </Menu.Item>
      <Menu.Item key="testimonials">
        <Link
          to={Lhash("#testimonials")}
          className={`${themeReducer === "light" ? "menu-text-light" : "menu-text-dark"
            } font-helvetica font-medium text-[16px] md:text-[16px] xl:text-[15px] 2xl:text-[16px] pl-[5px]`}
        >
          {dictionary["navbar"][languageReducer]["navItem5"]}
        </Link>
      </Menu.Item>
      <Menu.Item key="booking">
        <PopupButton
          className="navbar-btn px-[16px] h-[35px] rounded-[5px] text-[#fff] font-helvetica font-medium text-[16px]"
          url="https://calendly.com/mediasmartch/30min"
          rootElement={rootElement as HTMLElement}
          text={dictionary["navbar"][languageReducer]["navbarButton"]}
          pageSettings={{
            backgroundColor: themeReducer === "light" ? "#fff" : "#14172d",
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
            primaryColor: themeReducer === "light" ? "#14172D" : "#F6F6F6",
            textColor: themeReducer === "light" ? "#14172D" : "#F6F6F6",
          }}
        />
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {/* OVERLAY DE CHARGEMENT DU THÈME */}
      {isThemeChanging && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${themeReducer === 'light' ? 'bg-white/90' : 'bg-black/90'
            }`}
        >
          <div className={`text-center p-8 rounded-lg border shadow-2xl ${themeReducer === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-gray-800 border-gray-700'
            }`}>
            {/* Votre loader orbit personnalisé */}
            <div className="flex justify-center mb-6">
              <div className="preloader-orbit-loading">
                <div className="cssload-inner cssload-one"></div>
                <div className="cssload-inner cssload-two"></div>
                <div className="cssload-inner cssload-three"></div>
              </div>
            </div>

            <h3 className={`font-medium text-xl mb-2 ${themeReducer === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
              {languageReducer === 'fr' ? 'Changement de thème' : 'Changing theme'}
            </h3>
            <p className={`text-sm ${themeReducer === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
              {languageReducer === 'fr' ? 'Veuillez patienter...' : 'Please wait...'}
            </p>
          </div>
        </div>
      )}
      <header
        className={`${themeReducer === "light" ? "bg-white" : "bg-[#2B284C]"
          } navbar-shadow`}
      >
        <div className="w-full homepage-container mx-auto px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px]">
          {/* laptop */}
          <nav className="shift hidden lg:block lg:flex lg:items-center lg:justify-between h-[100px]">
            <Link to={L("/")}
              className="header-aos"
              data-aos="fade-down"
              data-aos-easing="ease-in-sine"
              data-aos-duration="700"
            >
              <img
                src={themeReducer === "light" ? logo : logoDark}
                alt="logo"
                className="w-[170px] xl:w-[190px] 2xl:w-[206px]"
              />
            </Link>
            <ul className="nav-list flex items-center justify-center lg:gap-x-[0px] xl:gap-x-[10px] 2xl:gap-x-[20px] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px] lg:ml-[50px] lg:mr-[34px] xl:ml-[75px] xl:mr-[44px]">
              <li
                className=""
                data-aos="fade-down"
                data-aos-easing="ease-in-sine"
                data-aos-duration="900"
              >
                <Link
                  to={L("/")}
                  className={
                    themeReducer === "light"
                      ? "text-[#14172D] hover:text-[#fff]"
                      : "text-[#FFFFFF] hover:text-[#fff]"
                  }
                >
                  {dictionary["navbar"][languageReducer]["navItem1"]}
                </Link>
              </li>
              <li
                className=""
                data-aos="fade-down"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1100"
              >
                <div className="btn-test from-bottom">
                  <Link
                    to={L("/it-services")}
                    className={
                      themeReducer === "light"
                        ? "text-[#14172D] hover:text-[#fff]"
                        : "text-[#FFFFFF] hover:text-[#fff]"
                    }
                  >
                    {dictionary["navbar"][languageReducer]["navItem2"]}
                  </Link>
                </div>
              </li>
              <li
                className=""
                data-aos="fade-down"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1300"
              >
                <div className="btn-test from-bottom">
                  <Link
                    to={L("/video-services")}
                    className={
                      themeReducer === "light"
                        ? "text-[#14172D] hover:text-[#fff]"
                        : "text-[#FFFFFF] hover:text-[#fff]"
                    }
                  >
                    {dictionary["navbar"][languageReducer]["navItem3"]}
                  </Link>
                </div>
              </li>
              <li
                className=""
                data-aos="fade-down"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1500"
              >
                <div className="btn-test from-bottom">
                  <Link
                    to={Lhash("#about")}
                    className={
                      themeReducer === "light"
                        ? "text-[#14172D] hover:text-[#fff]"
                        : "text-[#FFFFFF] hover:text-[#fff]"
                    }
                  >
                    {dictionary["navbar"][languageReducer]["navItem4"]}
                  </Link>
                </div>
              </li>
              {/* <li
                className=""
                data-aos="fade-down"
                data-aos-easing="ease-in-sine"
                data-aos-duration="1700"
              >
                <div className="btn-test from-bottom">
                  <Link
                    to={Lhash("#testimonials")}
                    className={
                      themeReducer === "light"
                        ? "text-[#14172D] hover:text-[#fff]"
                        : "text-[#FFFFFF] hover:text-[#fff]"
                    }
                  >
                    {dictionary["navbar"][languageReducer]["navItem5"]}
                  </Link>
                </div>
              </li> */}
            </ul>
            <div
              className="flex justify-center items-center gap-x-[26px] xl:gap-x-[30px] 2xl:gap-x-[36px]"
              data-aos="fade-down"
              data-aos-easing="ease-in-sine"
              data-aos-duration="1900"
            >
              <Dropdown overlay={menu} trigger={["click"]}>
                <a
                  className="ant-dropdown-link flex items-center gap-x-[6px] cursor-pointer font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]"
                  onClick={(e) => e.preventDefault()}
                >
                  <div role="img" aria-label="Selected Flag">
                    {languageReducer === "en" ? (
                      <img
                        src={flag1}
                        alt="flag1"
                        className="w-[16px] h-[16px]  rounded-full"
                      />
                    ) : (
                      <img
                        src={flag2}
                        alt="flag2"
                        className="w-[16px] h-[16px] rounded-full"
                      />
                    )}
                  </div>
                  <span
                    className={`${themeReducer === "light"
                      ? "text-[#14172D]"
                      : "text-[#FFFFFF]"
                      } uppercase`}
                  >
                    {languageReducer === "en" ? "EN" : "FR"}
                  </span>
                  <img
                    src={themeReducer === "light" ? dropdown : dropdownDark}
                    alt="dropdown"
                    className=""
                  />
                </a>
              </Dropdown>
              <button onClick={handleThemeChange}>
                {themeReducer === "light" ? (
                  <img
                    src={light}
                    width="20px"
                    height="20px"
                    className="rounded-full"
                  />
                ) : (
                  <img
                    src={dark}
                    width="20px"
                    height="20px"
                    className="rounded-full"
                  />
                )}
              </button>
              <PopupButton
                className="custom-btn2 middle-out px-[15px] xl:px-[18px] lg:h-[40px] xl:h-[44px] rounded-[5px] text-[#fff] font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]"
                url="https://calendly.com/mediasmartch/30min?hide_gdpr_banner=1"
                rootElement={rootElement as HTMLElement}
                text={
                  dictionary["navbar"][languageReducer]["navbarButton"]
                }
                pageSettings={{
                  backgroundColor: themeReducer === "light" ? "#fff" : "#14172d",
                  hideEventTypeDetails: false,
                  hideLandingPageDetails: false,
                  primaryColor: themeReducer === "light" ? "#14172D" : "#F6F6F6",
                  textColor: themeReducer === "light" ? "#14172D" : "#F6F6F6",
                }}
              />
            </div>
          </nav>
          {/* mobile */}
          <div className="block lg:hidden flex items-center justify-between h-[72px]">
            <Link to={L("/")} className="header-aos">
              <img
                src={themeReducer === "light" ? logo : logoDark}
                alt="logo"
                className="w-[130px]"
              />
            </Link>
            <div className="flex justify-center items-center gap-x-[20px]">
              <Dropdown overlay={menu} trigger={["click"]}>
                <div
                  className="ant-dropdown-link flex items-center gap-x-[6px] cursor-pointer  font-helvetica font-light text-[14px] md:text-[14px] xl:text-[15px] 2xl:text-[16px]"
                  onClick={(e) => e.preventDefault()}
                >
                  <div role="img" aria-label="Selected Flag">
                    {languageReducer === "en" ? (
                      <img
                        src={flag1}
                        alt="flag1"
                        className="w-[16px] h-[16px]  rounded-full"
                      />
                    ) : (
                      <img
                        src={flag2}
                        alt="flag2"
                        className="w-[16px] h-[16px] rounded-full"
                      />
                    )}
                  </div>
                  <span
                    className={`${themeReducer === "light"
                      ? "text-[#14172D]"
                      : "text-[#FFFFFF]"
                      } uppercase`}
                  >
                    {languageReducer === "en" ? "EN" : "FR"}
                  </span>
                  <img
                    src={themeReducer === "light" ? dropdown : dropdownDark}
                    alt="dropdown"
                    className=""
                  />
                </div>
              </Dropdown>
              <button onClick={handleThemeChange}>
                {themeReducer === "light" ? (
                  <img
                    src={light}
                    width="20px"
                    height="20px"
                    className="rounded-full"
                  />
                ) : (
                  <img
                    src={dark}
                    width="20px"
                    height="20px"
                    className="rounded-full"
                  />
                )}
              </button>
              <div className="">
                {/* <Dropdown overlay={menuOptions} trigger={["click"]}>
                <img
                  src={toggler}
                  alt="toggler"
                  className="w-[28px] h-[24px]"
                />
              </Dropdown> */}
                <Dropdown
                  overlay={menuOptions}
                  trigger={["click"]}
                  open={mobileMenuOpen}
                  onOpenChange={setMobileMenuOpen}
                  placement="bottomRight"
                  getPopupContainer={() => document.body}
                  overlayClassName="mobile-menu-dropdown"
                >
                  <img src={toggler} alt="toggler" className="w-[28px] h-[24px]" />
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <button
            aria-label="Fermer le menu"
            onClick={() => setMobileMenuOpen(false)}
          // className="fixed inset-0 lg:hidden z-[1500] bg-black/15 backdrop-blur-md"
          />
        )}
      </header>
    </>
  );
};

export default Navbar;
