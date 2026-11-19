import { lazy, Suspense } from "react";

import { LottieKey } from "@shared/config/lotties";

// Hoisted to module scope: declaring lazy() inside the component body creates a
// new component type on every render, which remounts the Lottie player.
const DotAnim = lazy(() => import("@shared/components/dot-anim"));

export interface OverviewCardProps {
  anim: LottieKey;
  title: string;
  description: string;
  /** AOS entrance for the card text. The two homepage sections differ here. */
  textAnimation: "fade-up" | "zoom-in";
}

/**
 * One service card in a homepage overview section: an animation above a title
 * and a short description.
 *
 * Colours come from the theme tokens, so this renders identically in both
 * themes without knowing which one is active.
 */
export default function OverviewCard({
  anim,
  title,
  description,
  textAnimation,
}: OverviewCardProps) {
  return (
    // h-full + flex so six cards in two rows end level with each other: the
    // animation box is already a fixed ratio, so the titles line up and only
    // the descriptions differ in length.
    <div className="bg-surface rounded-[15px] lg:rounded-[15px] xl:rounded-[20px] 2xl:rounded-[25px] px-5 py-6 md:py-8 2xl:py-10 h-full flex flex-col">
      {/* Fixed aspect ratio container keeps animation size consistent across card widths */}
      <div className="relative w-full aspect-[4/3] lg:aspect-[16/11] xl:aspect-[5/4]">
        <div className="absolute inset-0 flex items-center justify-center">
          <Suspense
            fallback={
              <div className="h-[220px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
              </div>
            }
          >
            <DotAnim anim={anim} className="h-full w-full max-w-[85%]" crisp protect />
          </Suspense>
        </div>
      </div>

      <div className="mt-4 text-heading-strong flex flex-1 flex-col">
        <p
          className="w-full xl:w-[90%] 2xl:w-[75%] mx-auto text-center font-redDisplay font-bold text-[20px] md:text-[20px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px] mb-3"
          data-aos={textAnimation}
          data-aos-duration="1300"
          data-aos-easing="ease-in-sine"
        >
          {title}
        </p>
        <p
          className="w-full xl:w-[90%] 2xl:w-[90%] mx-auto text-center font-poppins font-light text-[14px] md:text-[15px] xl:text-[15px] 2xl:text-[16px] leading-relaxed"
          data-aos={textAnimation}
          data-aos-duration="1500"
          data-aos-easing="ease-in-sine"
        >
          {description}
        </p>
      </div>
    </div>
  );
}
