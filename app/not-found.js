"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Result } from "antd";
import Search from "antd/es/input/Search";
import Slice from "../components/meta/Slice";

// T503 — remplace pages/Page404.js
export default function NotFound() {
  const router = useRouter();

  return (
    <Slice className="page-404">
      <Result
        status="404"
        title="404"
        subTitle="Désolé, cette page n'existe pas. Besoin d'un indice ?"
        extra={<Link href="/">Accueil</Link>}
      />
      <Search onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)} />
    </Slice>
  );
}
