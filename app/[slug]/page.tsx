import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CONVERSIONS } from "../../conversion-data";
import { ClientImageConverter } from "../../components/ClientImageConverter";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getConversionBySlug(slug: string) {
  return CONVERSIONS.find((conversion) => conversion.slug === slug);
}

export function generateStaticParams() {
  return CONVERSIONS.map((conversion) => ({
    slug: conversion.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const conversion = getConversionBySlug(slug);

  if (!conversion) {
    return {
      title: "Muunnosta ei loytynyt",
      description: "Pyydettya kuvanmuunnosta ei loytynyt.",
    };
  }

  return {
    title: conversion.title,
    description: conversion.description,
  };
}

export default async function ConversionPage({ params }: PageProps) {
  const { slug } = await params;
  const conversion = getConversionBySlug(slug);

  if (!conversion) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
      >
        <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
        Takaisin kaikkiin muuntimiin
      </Link>
      
      <h1 className="text-3xl font-semibold tracking-tight">{conversion.title}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">{conversion.description}</p>
      <ClientImageConverter from={conversion.from} to={conversion.to} />
    </main>
  );
}
