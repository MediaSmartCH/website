// import Lottie from "react-lottie";
// import DotAnim from "components/common/DotAnim";
import { lazy, Suspense } from "react";
import { LottieKey } from "config/lotties";

// interface LottieOptions {
//     loop: boolean;
//     autoplay: boolean;
//     animationData: any;
//     rendererSettings: {
//         preserveAspectRatio: string;
//     };
// }

interface OverviewCardProps {
    themeReducer: string;
    // lottieOptions: LottieOptions;
    anim: LottieKey;
    title: string;
    description: string;
}

export default function VideoOverviewCard({ themeReducer, anim, title, description }: OverviewCardProps) {
    const DotAnim = lazy(() => import('components/common/DotAnim'));
    return (
        <div
            className={`${themeReducer === "light" ? "bg-[#F4F4FF]" : "bg-[#2B284C]"
                } rounded-[15px] lg:rounded-[15px] xl:rounded-[20px] 2xl:rounded-[25px] px-5 py-6 md:py-8 2xl:py-10`}
        >
            <div className="relative w-full aspect-[4/3] lg:aspect-[16/11] xl:aspect-[5/4]">
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* <Lottie options={lottieOptions} /> */}
                    <Suspense
                        fallback={
                            <div className="h-[220px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                            </div>
                        }
                    >
                        <DotAnim
                            anim={anim}
                            className="h-full w-auto max-w-[85%]"
                            crisp
                            protect
                        />
                    </Suspense>
                </div>
            </div>
            <div className={`mt-4 ${themeReducer === "light" ? "text-[#1F2326]" : "text-[#F6F6F6]"}`}>
                <p className="w-full xl:w-[90%] 2xl:w-[75%] mx-auto text-center font-redDisplay font-bold text-[20px] md:text-[20px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px] mb-3"
                    data-aos="zoom-in"
                    data-aos-duration="1300"
                    data-aos-easing="ease-in-sine"
                >
                    {title}
                </p>
                <p className="w-full xl:w-[90%] 2xl:w-[90%] mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px] leading-relaxed"
                    data-aos="zoom-in"
                    data-aos-duration="1500"
                    data-aos-easing="ease-in-sine"
                >
                    {description}
                </p>
            </div>
        </div>
    )
}