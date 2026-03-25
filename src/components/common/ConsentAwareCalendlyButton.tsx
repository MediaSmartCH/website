import React from "react";
import { PopupButton } from "react-calendly";

import useCookieConsent from "services/hooks/useCookieConsent";
import {
  canLoadEmbeddedCalendly,
  requestCookieSettingsOpen,
} from "store/slices/common/cookieUtils";

type PopupButtonProps = React.ComponentProps<typeof PopupButton>;

type ConsentAwareCalendlyButtonProps = Omit<PopupButtonProps, "rootElement" | "url"> & {
  rootElement?: HTMLElement | null;
  embedUrl?: string;
  blockedTitle?: string;
};

const DEFAULT_EMBED_URL = "https://calendly.com/mediasmartch/30min?hide_gdpr_banner=1";

const ConsentAwareCalendlyButton = ({
  rootElement,
  embedUrl = DEFAULT_EMBED_URL,
  blockedTitle,
  className,
  text,
  ...popupProps
}: ConsentAwareCalendlyButtonProps) => {
  const consent = useCookieConsent();
  const shouldLoadEmbeddedCalendly = canLoadEmbeddedCalendly(consent);
  const resolvedRootElement =
    rootElement ??
    (typeof document !== "undefined"
      ? (document.getElementById("root") as HTMLElement | null)
      : null);

  // Do not mount the embedded Calendly widget until the visitor explicitly
  // opts into the related Calendly cookies shown in the consent center.
  if (shouldLoadEmbeddedCalendly && resolvedRootElement) {
    return (
      <PopupButton
        {...popupProps}
        className={className}
        rootElement={resolvedRootElement}
        text={text}
        url={embedUrl}
      />
    );
  }

  return (
    <button
      type="button"
      className={className}
      data-calendly-consent-required="true"
      onClick={requestCookieSettingsOpen}
      title={blockedTitle}
    >
      {text}
      {blockedTitle && <span className="sr-only"> - {blockedTitle}</span>}
    </button>
  );
};

export default ConsentAwareCalendlyButton;
