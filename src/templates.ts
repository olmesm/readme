import { useEffect, useState } from "react";
import { isOccupied } from "./utils/immutable-array";

const PATH_PREFIX = <"/some-repo-path/" | undefined>import.meta.env.PATH_PREFIX;

export type UnionOfArrayElements<T extends Readonly<{ templateId: string }[]>> =
  T[number]["templateId"];

export type TemplateObject = {
  templateId: string;
  originalCopy: string;
  alteredCopy?: string;
  uid?: string;
};

const fetcher = async (mdFile: string) =>
  fetch([PATH_PREFIX, `/templates/${mdFile}.md`].filter(Boolean).join("")).then(
    (data) => data.text()
  );

export const useLoadTemplates = (
  templateList: string[]
): [boolean, TemplateObject[]] => {
  const [templates, setTemplates] = useState<TemplateObject[]>([]);

  useEffect(() => {
    Promise.allSettled<Promise<TemplateObject>[]>(
      templateList.map(async (t) => {
        return { templateId: t, originalCopy: await fetcher(t) };
      })
    ).then((promises) => {
      setTemplates(
        promises
          .filter(({ status }) => status === "fulfilled")
          .map((p) => (p as { value: TemplateObject }).value)
      );
    });
  }, []);

  const isLoading = !isOccupied(templates);

  return [isLoading, templates];
};
