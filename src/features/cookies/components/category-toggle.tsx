import type { ToggleState } from "@features/cookies/hooks/use-consent-preferences";

const TRACK_CLASSES: Record<ToggleState, string> = {
  active: "bg-gradient-to-r from-purple-500 to-pink-500 justify-end pr-1",
  partial: "bg-gradient-to-r from-purple-300 to-pink-300 justify-center",
  inactive: "bg-toggle-track justify-start pl-1",
};

export interface CategoryToggleProps {
  state: ToggleState;
  onClick: () => void;
}

/**
 * Three-state switch for a consent category.
 *
 * "partial" exists because the functionality category groups two services and
 * can be half enabled; the knob sits centred in that case.
 *
 * Previously declared inside the banner's own body, which made React treat it as
 * a new component type on every render and remount the button each time.
 */
export default function CategoryToggle({ state, onClick }: CategoryToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-5 rounded-full flex items-center transition-all duration-200 ${TRACK_CLASSES[state]}`}
    >
      <div className="w-3 h-3 bg-white rounded-full transition-all duration-200" />
    </button>
  );
}
