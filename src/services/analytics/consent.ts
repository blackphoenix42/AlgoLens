export function hasConsent() {
  return localStorage.getItem("analytics_consent") !== "false";
}
export function setConsent(allow: boolean) {
  localStorage.setItem("analytics_consent", String(allow));
  location.reload();
}
