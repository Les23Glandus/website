"use client";

import { Result } from "antd";
import ShareLinks from "../components/meta/ShareLinks";
import Slice from "../components/meta/Slice";

// T504 — remplace pages/Page500.js
export default function ErrorPage({ reset }) {
  return (
    <Slice>
      <Result
        status="500"
        title="Maintenance en cours"
        subTitle="Désolé, on bloque sur une énigme, merci de revenir dans quelques instants !"
        extra={
          <div>
            En attendant, <ShareLinks />
            <p><a onClick={() => reset()}>Réessayer</a></p>
          </div>
        }
      />
    </Slice>
  );
}
