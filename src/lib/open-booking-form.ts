export const BOOKING_FORM_EVENT = "solupair:open-booking";

/** Open the home-page booking form and scroll it into view. */
export function openBookingForm() {
  if (typeof window === "undefined") return;

  if (window.location.pathname !== "/") {
    window.location.assign("/#book");
    return;
  }

  if (window.location.hash !== "#book") {
    window.history.replaceState(null, "", "#book");
  }

  window.dispatchEvent(new Event(BOOKING_FORM_EVENT));
}
