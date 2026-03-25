// All Lottie animation assets must be imported before any other module-level
// code in this file because some bundlers resolve side-effect order based on
// import position.
import Home_light from "../assets/lotties/home/Home_light.lottie";
import Home_dark from "../assets/lotties/home/Home_dark.lottie";

import About_light from "../assets/lotties/home/About_light.lottie";
import About_dark from "../assets/lotties/home/About_dark.lottie";

import IT_light from "../assets/lotties/it/IT_light.lottie";
import IT_dark from "../assets/lotties/it/IT_dark.lottie";

import Introduction_light from "../assets/lotties/it/Introduction_light.lottie";
import Introduction_dark from "../assets/lotties/it/Introduction_dark.lottie";

import Website_light from "../assets/lotties/it/Website_light.lottie";
import Website_dark from "../assets/lotties/it/Website_dark.lottie";

import Maintenance_light from "../assets/lotties/it/Maintenance_light.lottie";
import Maintenance_dark from "../assets/lotties/it/Maintenance_dark.lottie";

import Optimization_light from "../assets/lotties/it/Optimization_light.lottie";
import Optimization_dark from "../assets/lotties/it/Optimization_dark.lottie";

import Security_light from "../assets/lotties/it/Security_light.lottie";
import Security_dark from "../assets/lotties/it/Security_dark.lottie";

import Backup_light from "../assets/lotties/it/Backup_light.lottie";
import Backup_dark from "../assets/lotties/it/Backup_dark.lottie";

import Support_light from "../assets/lotties/it/Support_light.lottie";
import Support_dark from "../assets/lotties/it/Support_dark.lottie";

import Process_light from "../assets/lotties/it/Process_light.lottie";
import Process_dark from "../assets/lotties/it/Process_dark.lottie";

import Editing_light from "../assets/lotties/video/Editing_light.lottie";
import Editing_dark from "../assets/lotties/video/Editing_dark.lottie";

import Live_light from "../assets/lotties/video/Live_light.lottie";
import Live_dark from "../assets/lotties/video/Live_dark.lottie";

import Photography_light from "../assets/lotties/video/Photography_light.lottie";
import Photography_dark from "../assets/lotties/video/Photography_dark.lottie";

import Rental_light from "../assets/lotties/video/Rental_light.lottie";
import Rental_dark from "../assets/lotties/video/Rental_dark.lottie";

import Retransmission_light from "../assets/lotties/video/Retransmission_light.lottie";
import Retransmission_dark from "../assets/lotties/video/Retransmission_dark.lottie";

import Video_light from "../assets/lotties/video/Video_light.lottie";
import Video_dark from "../assets/lotties/video/Video_dark.lottie";

import VideoHeader_light from "../assets/lotties/video/VideoHeader_light.lottie";
import VideoHeader_dark from "../assets/lotties/video/VideoHeader_dark.lottie";

export type LottiePair = { light: string; dark?: string };

// Keyed lookup used by DotAnim to resolve the correct asset pair for a given animation slot.
export const LOTTIES = {
  "home.hero": { light: Home_light, dark: Home_dark },
  "home.about": { light: About_light, dark: About_dark },

  "it.hero": { light: IT_light, dark: IT_dark },
  "it.about": { light: Introduction_light, dark: Introduction_dark },

  "it.services.website": { light: Website_light, dark: Website_dark },
  "it.services.maintenance": { light: Maintenance_light, dark: Maintenance_dark },
  "it.services.optimization": { light: Optimization_light, dark: Optimization_dark },
  "it.services.security": { light: Security_light, dark: Security_dark },
  "it.services.backup": { light: Backup_light, dark: Backup_dark },
  "it.services.support": { light: Support_light, dark: Support_dark },

  "it.process": { light: Process_light, dark: Process_dark },

  "video.editing": { light: Editing_light, dark: Editing_dark },
  "video.live": { light: Live_light, dark: Live_dark },
  "video.photography": { light: Photography_light, dark: Photography_dark },
  "video.rental": { light: Rental_light, dark: Rental_dark },
  "video.retransmission": { light: Retransmission_light, dark: Retransmission_dark },
  "video.production": { light: Video_light, dark: Video_dark },
  "video.header": { light: VideoHeader_light, dark: VideoHeader_dark },
} as const;

export type LottieKey = keyof typeof LOTTIES;
