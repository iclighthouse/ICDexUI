export function addGoogleAnalytics(
  eventAction: string,
  eventCategory: string,
  eventLabel: string,
  eventValue = 1
) {
  (window as any).gtag('event', eventAction, {
    event_category: eventCategory,
    event_label: eventLabel,
    value: eventValue
  });
}
