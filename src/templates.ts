import { useEffect, useState } from "react";
import { t } from "vitest/dist/index-4a906fa4";
import { isOccupied } from "./utils/immutable-array";
import { isTruthy } from "./utils/isTruthy";

const VITE_PATH_PREFIX = <"/some-repo-path/" | undefined>(
  import.meta.env.VITE_PATH_PREFIX
);

export type UnionOfArrayElements<T extends Readonly<{ templateId: string }[]>> =
  T[number]["templateId"];

export type TemplateObject = {
  templateId: string;
  originalCopy: string;
  alteredCopy?: string;
  uid?: string;
};

const fetcher = async (path: string) =>
  fetch(
    [VITE_PATH_PREFIX, `${path}`]
      .filter(isTruthy)
      .join("/")
      .replace(/\/{2,}/g, "/")
  ).then((data) => data.text());

export const useLoadTemplates = (url: string): [boolean, TemplateObject[]] => {
  const [templates, setTemplates] = useState<TemplateObject[]>([]);

  useEffect(() => {
    (async () => {
      const templateIndex: string[] = await fetch(url + "_index.json").then(
        (d) => d.json()
      );

      const promises = await Promise.allSettled<Promise<TemplateObject>[]>(
        templateIndex.map(async (t) => {
          return { templateId: t, originalCopy: await fetcher(url + t) };
        })
      );

      const templates = promises
        .filter(({ status }) => status === "fulfilled")
        .map((p) => (p as { value: TemplateObject }).value)
        .map((t) => ({
          ...t,
          templateId: t.templateId.replace(/\.(md|json)$/, ""),
        }));

      setTemplates(templates);
    })();
  }, []);

  const isLoading = !isOccupied(templates);

  return [isLoading, templates];
};
