"use client";

import { useState, useTransition } from "react";
import { Switch, Timeline } from "antd";
import ActusCard from "./ActusCard";
import EscapeCard from "./EscapeCard";
import { mergeEscapesIntoTimeline } from "../lib/actions";

/**
 * T406 — le rendu initial (liste des actus) vient du serveur (voir
 * app/news/page.js) pour le SEO ; seul le toggle "Inclure nos tests" reste
 * une interaction client, qui va chercher les escapes via une Server Action.
 */
export default function NewsTimeline({ initialList }) {
  const [list, setList] = useState(initialList);
  const [includeEscapes, setIncludeEscapes] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onSwitchChange(value) {
    setIncludeEscapes(value);
    startTransition(async () => {
      if (value) {
        const merged = await mergeEscapesIntoTimeline(initialList);
        setList(merged);
      } else {
        setList(initialList);
      }
    });
  }

  return (
    <div>
      <div className="toggle-actu">
        <Switch checked={includeEscapes} loading={isPending} onChange={onSwitchChange} size="small" />
        {" "}Inclure nos tests
      </div>
      <Timeline
        items={list.map((n) => {
          if (n.isDate) return { key: "D" + n.id, children: <h2>{n.label}</h2> };
          if (n.channel) return { key: "A" + n.id, children: <ActusCard details={n} /> };
          return { key: "E" + n.id, children: <EscapeCard date escape={n} enseigne={n.enseigne} reduce compact /> };
        })}
      />
    </div>
  );
}
