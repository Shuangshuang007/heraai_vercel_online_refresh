// 删除redux相关代码，因为实际没有使用

export interface Settings {
  themeColor: string;
  fontFamily: string;
  fontSize: string;
  documentSize: string;
  formToShow: {
    workExperiences: boolean;
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
  };
  formToHeading: {
    workExperiences: string;
    educations: string;
    projects: string;
    skills: string;
    custom: string;
  };
  formsOrder: ShowForm[];
  showBulletPoints: {
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
  };
}

export type ShowForm = keyof Settings["formToShow"];
export type FormWithBulletPoints = keyof Settings["showBulletPoints"];
export type GeneralSetting = Exclude<
  keyof Settings,
  "formToShow" | "formToHeading" | "formsOrder" | "showBulletPoints"
>;

export const DEFAULT_THEME_COLOR = "#38bdf8"; // sky-400
export const DEFAULT_FONT_FAMILY = "Roboto";
export const DEFAULT_FONT_SIZE = "11"; // text-base https://tailwindcss.com/docs/font-size
export const DEFAULT_FONT_COLOR = "#171717"; // text-neutral-800

export const initialSettings: Settings = {
  themeColor: DEFAULT_THEME_COLOR,
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_FONT_SIZE,
  documentSize: "Letter",
  formToShow: {
    workExperiences: true,
    educations: true,
    projects: true,
    skills: true,
    custom: false,
  },
  formToHeading: {
    workExperiences: "WORK EXPERIENCE",
    educations: "EDUCATION",
    projects: "PROJECT",
    skills: "SKILLS",
    custom: "CUSTOM SECTION",
  },
  formsOrder: ["workExperiences", "educations", "projects", "skills", "custom"],
  showBulletPoints: {
    educations: true,
    projects: true,
    skills: true,
    custom: true,
  },
};

// 删除redux相关代码，因为实际没有使用
