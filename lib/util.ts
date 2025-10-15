export const getDomain = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace("www.", "");
  } catch (e) {
    return "Okänd källa";
  }
};
