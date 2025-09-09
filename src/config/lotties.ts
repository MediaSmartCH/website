export type LottiePair = { light: string; dark?: string };

export const LOTTIES = {
  "home.hero": {
    light: "/assets/Home_light.lottie",
    dark: "/assets/Home_dark.lottie",
  },
  "home.about": {
    light: "/assets/About_light.lottie",
    dark: "/assets/About_dark.lottie",
  },
  "it.hero": {
    light: "/assets/IT_light.lottie",
    dark: "/assets/IT_dark.lottie",
  },
  "it.about": {
    light: "/assets/Introduction_light.lottie",
    dark: "/assets/Introduction_dark.lottie",
  },
  "it.services.website": {
    light: "/assets/Website_light.lottie",
    dark: "/assets/Website_dark.lottie",
  },
  "it.services.maintenance": {
    light: "/assets/Maintenance_light.lottie",
    dark: "/assets/Maintenance_dark.lottie",
  },
  "it.services.optimization": {
    light: "/assets/Optimization_light.lottie",
    dark: "/assets/Optimization_dark.lottie",
  },
  "it.services.security": {
    light: "/assets/Security_light.lottie",
    dark: "/assets/Security_dark.lottie",
  },
  "it.services.backup": {
    light: "/assets/Backup_light.lottie",
    dark: "/assets/Backup_dark.lottie",
  },
  "it.services.support": {
    light: "/assets/Support_light.lottie",
    dark: "/assets/Support_dark.lottie",
  },
  "it.process": {
    light: "/assets/Process_light.lottie",
    dark: "/assets/Process_dark.lottie",
  },
  "video.editing": {
    light: "/assets/Editing_light.lottie",
    dark: "/assets/Editing_dark.lottie",
  },
  "video.live": {
    light: "/assets/Live_light.lottie",
    dark: "/assets/Live_dark.lottie",
  },
  "video.photography": {
    light: "/assets/Photography_light.lottie",
    dark: "/assets/Photography_dark.lottie",
  },
  "video.rental": {
    light: "/assets/Rental_light.lottie",
    dark: "/assets/Rental_dark.lottie",
  },
  "video.retransmission": {
    light: "/assets/Retransmission_light.lottie",
    dark: "/assets/Retransmission_dark.lottie",
  },
  "video.production": {
    light: "/assets/Video_light.lottie",
    dark: "/assets/Video_dark.lottie",
  },
  "video.header": {
    light: "/assets/VideoHeader_light.lottie",
    dark: "/assets/VideoHeader_dark.lottie",
  },
} as const;

export type LottieKey = keyof typeof LOTTIES;