import configuration from "../../publication.json";
/** Unset publication locations are text, never invented live links. */
export function publicationUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href.replace(/\/$/, "")
      : null;
  } catch {
    return null;
  }
}
export const publication = {
  ...configuration,
  repositoryUrl: publicationUrl(configuration.repositoryUrl),
  websiteUrl: publicationUrl(configuration.websiteUrl),
};
