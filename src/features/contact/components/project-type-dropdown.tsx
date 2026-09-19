/**
 * Custom select for the project type, shown only in the "quote" intent.
 *
 * Hand-rolled rather than a native <select> so the option list can be themed
 * and can render a check mark next to the current choice. Closes on an outside
 * click, which a native select gets for free.
 */

import React from "react";
import { Check, ChevronDown } from "lucide-react";

const ProjectTypeDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  selectedLabel,
  isLight,
  isValid,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  selectedLabel: string | undefined;
  isLight: boolean;
  isValid: boolean;
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside its container.
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative mb-[16px] lg:mb-[22px]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex justify-between items-center border-2 rounded-[11px] px-[24px] lg:px-[28px] py-[15px] lg:py-[20px] transition-all
          ${isValid ? "contact-field" : "contact-field-surface border-red-500"}`}
      >
        <span className={`custom-contact-input !w-auto text-body-on-surface`}>
          {selectedLabel ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} contact-segment-idle`}
        />
      </button>

      {open && (
        <div className={`absolute z-50 w-full mt-[6px] rounded-[11px] border-2 overflow-hidden shadow-lg
          contact-menu`}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-[24px] py-[13px] custom-contact-input transition-colors
                ${isLight
                  ? "text-[#222222] hover:bg-[#F4F4FF]"
                  : "text-[#F1EFFA] hover:bg-[#3E3873]"
                }`}
            >
              {opt.label}
              {value === opt.value && (
                <Check size={14} className={isLight ? "text-[#677DFF]" : "text-[#A89FFF]"} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectTypeDropdown;
