import { OpenseesModel } from "@/lib/opensees/models/Model";
import { openseesModelSchema } from "@/lib/opensees/schema/schemas";
import { useEffect, useState } from "react";

interface Props {
  // TODO: temporary prop: json file public url
  jsonUrl: string;
}

export const useOpensees = ({ jsonUrl }: Props) => {
  const [model, setModel] = useState<OpenseesModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const json = await fetch(jsonUrl).then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
          }
          return res.json();
        });

        const data = openseesModelSchema.parse(json);
        const result = new OpenseesModel(data);

        if (!cancelled) {
          setModel(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setModel(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [jsonUrl]);

  return { loading, error, model };
};
