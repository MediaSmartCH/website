import { lazy, Suspense } from "react";
import RichText from "components/common/RichText";
import { useAppSelector } from "services/hooks/hooks";
import { useTranslations } from "services/locales/safe";

export default function Process() {
    const DotAnim = lazy(() => import('components/common/DotAnim'));
    const languageReducer = useAppSelector(
        (state) => state.language.currentLanguage
    );

    const themeReducer = useAppSelector((state) => state.theme.currentTheme);
    type ProcessItem = { title: string; description: string; icon?: string };
    const t = useTranslations(languageReducer);

    return (
        <div className="w-full homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[70px] 2xl:px-[100px] pt-[40px] pb-[50px] mx-auto">
            <div
                className={`${themeReducer === "light" ? "bg-[#F4F4FF]" : "bg-[#2B284C]"
                    } rounded-[15px] lg:rounded-[20px] xl:rounded-[25px] 2xl:rounded-[30px] py-[30px] px-[30px] md:px-[100px] lg:px-[50px] 2xl:px-[100px]`}
            >
                <div>
                    <RichText
                        as="h2"
                        className={`${themeReducer === "light" ? "text-[#1F2326]" : "text-[#F6F6F6]"
                            } w-full it-service-process-title text-center mx-auto mb-[0px] lg:mb-[0px] font-redDisplay font-bold text-[26px] md:text-[32px] lg:text-[32px] xl:text-[36px] 2xl:text-[48px]`}
                        html={t.text("it.itServicesProcessTitle")}
                    />
                    <p
                        className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                            } w-full mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px] `}
                    >
                        {t.text("it.itServicesProcessDescription")}
                    </p>
                </div>

                <div className="mt-10 flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-x-8 gap-y-12">
                    <div className="w-full lg:w-[50%] flex items-center justify-center">
                        <div className="w-[80%] md:w-[80%] lg:w-[75%] xl:w-[70%] 2xl:w-[65%] aspect-[3/5]">
                            <Suspense
                                fallback={
                                    <div className="h-[220px] flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                                    </div>
                                }
                            >
                                <DotAnim
                                    anim="it.process"
                                    style={{ width: "100%", height: "auto" }}
                                    crisp
                                    protect
                                />
                            </Suspense>
                        </div>
                    </div>
                    <div className="w-full lg:w-[50%] relative">
                        {/* Dashed vertical line running behind all step number badges */}
                        <div className="absolute left-[34px] 2xl:left-[44px] top-0 bottom-0 w-0.5 opacity-40 z-20">
                            <svg className="w-full h-full" viewBox="0 0 2 100" preserveAspectRatio="none" fill="none">
                                <line
                                    x1="1"
                                    y1="0"
                                    x2="1"
                                    y2="100"
                                    stroke="#A8A8A8"
                                    strokeDasharray="4 4"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        </div>
                        {t.array<ProcessItem>("it.processData").map((step, i) => {
                            return (
                                <div key={i} className={`flex items-start space-x-8 ${themeReducer === "light" ? "text-[#1F2326]" : "text-[#F6F6F6]"
                                    }`}
                                >
                                    {/* Step number badge sits above the dashed line (z-50) */}
                                    <div className={`relative z-50 flex-shrink-0 w-[68px] h-[52px] md:w-[68px] md:h-[52px] 2xl:w-[88px] 2xl:h-[72px] rounded-[48px] flex items-center justify-center font-poppins font-normal text-[20px] md:text-[24px] 2xl:text-[28px] ${themeReducer === "light" ? "process-bg-light" : "process-bg-dark"
                                        }`}>
                                        {i + 1}
                                    </div>

                                    <div className="flex-1 pb-[40px] 2xl:pb-[50px] pt-[7px] md:pt-[5px] lg:pt-[2px] 2xl:pt-[5px]"
                                        data-aos="fade-up"
                                        data-aos-easing="ease-in-sine"
                                        data-aos-duration={`${900 + (i * 200)}`}
                                    >
                                        <h3 className={`font-redDisplay font-medium text-[24px] md:text-[28px] lg:text-[32px] 2xl:text-[40px] mb-4 ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                                            }`}>
                                            {step.title}
                                        </h3>
                                        <p className={`w-[95%] xl:w-[75%] font-poppins font-light text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] leading-relaxed ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                                            }`}>
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}
