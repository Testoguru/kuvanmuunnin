"use client";

import dynamic from "next/dynamic";

const ImageConverter = dynamic(
  () => import("./ImageConverter").then((mod) => mod.ImageConverter),
  { ssr: false }
);

type ClientImageConverterProps = {
  from: string;
  to: string;
};

export function ClientImageConverter({ from, to }: ClientImageConverterProps) {
  return <ImageConverter from={from} to={to} />;
}
