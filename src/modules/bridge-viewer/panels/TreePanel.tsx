"use client";

import { useMemo } from "react";

import { Search } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type {
  BridgeModelExportV2,
  ViewerSelection,
} from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type TreePanelProps = {
  data: BridgeModelExportV2;
};

function makeSelection(
  kind: ViewerSelection["kind"],
  id: string | number,
  label: string,
  payload: unknown,
): ViewerSelection {
  return { kind, id, label, payload };
}

export function TreePanel({ data }: TreePanelProps) {
  const treeSearch = useBridgeViewerStore((state) => state.treeSearch);
  const setTreeSearch = useBridgeViewerStore((state) => state.setTreeSearch);
  const setSelected = useBridgeViewerStore((state) => state.setSelected);

  const groups = useMemo(() => {
    const needle = treeSearch.trim().toLowerCase();
    return Object.entries(data.groups).filter(([groupName]) =>
      groupName.toLowerCase().includes(needle),
    );
  }, [data.groups, treeSearch]);

  const nodes = useMemo(() => {
    const needle = treeSearch.trim().toLowerCase();
    return data.nodes
      .filter((node) => {
        if (!needle) return false;
        return (
          String(node.tag).includes(needle) ||
          node.groups.some((group) => group.toLowerCase().includes(needle)) ||
          node.roles.some((role) => role.toLowerCase().includes(needle))
        );
      })
      .slice(0, 80);
  }, [data.nodes, treeSearch]);

  const elements = useMemo(() => {
    const needle = treeSearch.trim().toLowerCase();
    return data.elements
      .filter((element) => {
        if (!needle) return false;
        return (
          String(element.tag).includes(needle) ||
          (element.group ?? "").toLowerCase().includes(needle) ||
          element.type.toLowerCase().includes(needle)
        );
      })
      .slice(0, 80);
  }, [data.elements, treeSearch]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 dark:bg-slate-900">
      <div className="relative ">
        <InputGroup>
          <InputGroupInput
            value={treeSearch}
            onChange={(event) => setTreeSearch(event.target.value)}
            placeholder="Search nodes, elements, groups, roles..."
            className="border-slate-800 bg-slate-950 pl-9 text-slate-50"
          />
          <InputGroupAddon align="inline-start">
            <Search className=" h-4 w-4 text-slate-500" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["components", "groups"]}
        className="w-full border-slate-600 border text-slate-50 "
      >
        <AccordionItem value="components">
          <AccordionTrigger >
            Components
          </AccordionTrigger>
          <AccordionContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Spans
              </div>
              {data.components.spans.map((span) => (
                <button
                  key={span.index}
                  className="block w-full rounded-lg border border-slate-800 px-3 py-2 text-left"
                  onClick={() =>
                    setSelected(
                      makeSelection(
                        "component",
                        `span-${span.index}`,
                        `Span ${span.index + 1}`,
                        span,
                      ),
                    )
                  }
                >
                  Span {span.index + 1} — {span.length} m
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Piers
              </div>
              {data.components.piers.map((pier) => (
                <button
                  key={pier.index}
                  className="block w-full rounded-md border border-slate-800 px-3 py-2 text-left"
                  onClick={() =>
                    setSelected(
                      makeSelection(
                        "component",
                        `pier-${pier.index}`,
                        `Pier ${pier.index + 1}`,
                        pier,
                      ),
                    )
                  }
                >
                  Pier {pier.index + 1} — x = {pier.x}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Support lines
              </div>
              {data.components.support_lines.map((support) => (
                <button
                  key={support.index}
                  className="block w-full rounded border border-slate-800 px-3 py-2 text-left hover:bg-slate-900"
                  onClick={() =>
                    setSelected(
                      makeSelection(
                        "component",
                        `support-${support.index}`,
                        `Support line ${support.index}`,
                        support,
                      ),
                    )
                  }
                >
                  {support.kind} — x = {support.x}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="groups" className="border-slate-800">
          <AccordionTrigger className="text-slate-200 ">Groups</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm">
            {groups.map(([groupName, ids]) => (
              <button
                key={groupName}
                className="block w-full rounded border border-slate-800 px-3 py-2 text-left"
                onClick={() =>
                  setSelected(
                    makeSelection("group", groupName, `Group: ${groupName}`, {
                      name: groupName,
                      ids,
                    }),
                  )
                }
              >
                {groupName} ({ids.length})
              </button>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="nodes">
          <AccordionTrigger className="text-slate-200">Nodes</AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm">
            {nodes.length === 0 ? (
              <div className="text-xs text-slate-500">
                Use search to locate nodes.
              </div>
            ) : (
              nodes.map((node) => (
                <button
                  key={node.tag}
                  className="block w-full rounded border border-slate-800 px-3 py-2 text-left"
                  onClick={() =>
                    setSelected(
                      makeSelection("node", node.tag, `Node ${node.tag}`, node),
                    )
                  }
                >
                  Node {node.tag} — {node.groups.join(", ")}
                </button>
              ))
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="elements">
          <AccordionTrigger className="text-slate-200">
            Elements
          </AccordionTrigger>
          <AccordionContent className="space-y-2 text-sm">
            {elements.length === 0 ? (
              <div className="text-xs text-slate-500">
                Use search to locate elements.
              </div>
            ) : (
              elements.map((element) => (
                <button
                  key={element.tag}
                  className="block w-full rounded border border-slate-800 px-3 py-2 text-left"
                  onClick={() =>
                    setSelected(
                      makeSelection(
                        "element",
                        element.tag,
                        `Element ${element.tag}`,
                        element,
                      ),
                    )
                  }
                >
                  Element {element.tag} — {element.group}
                </button>
              ))
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
