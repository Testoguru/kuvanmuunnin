export type Conversion = {
  slug: string;
  title: string;
  description: string;
  from: string;
  to: string;
};

export const CONVERSIONS: Conversion[] = [
  {
    slug: "png-to-jpg",
    title: "Muuta PNG JPG-muotoon ilmaiseksi",
    description:
      "Muunna PNG JPG-muotoon sekunneissa suoraan selaimessa. Nopea ja ilmainen kuvanmuunnin tekee tiedostoista kevyempia jakamiseen, lahettamiseen ja verkkokayttoon.",
    from: "image/png",
    to: "image/jpeg",
  },
  {
    slug: "jpg-to-png",
    title: "Muuta JPG PNG-muotoon ilmaiseksi",
    description:
      "Muuta JPG PNG-muotoon helposti ilman asennuksia. Saat tarkat ja laadukkaat kuvat esimerkiksi grafiikkaan, muokkaukseen ja tilanteisiin, joissa tarvitset parempaa laatua.",
    from: "image/jpeg",
    to: "image/png",
  },
  {
    slug: "webp-to-jpg",
    title: "Muuta WebP JPG-muotoon ilmaiseksi",
    description:
      "Muunna WebP JPG-muotoon, jotta kuvat toimivat varmasti kaikilla laitteilla ja sovelluksilla. Erinomainen valinta, kun haluat maksimaalisen yhteensopivuuden nopeasti.",
    from: "image/webp",
    to: "image/jpeg",
  },
  {
    slug: "heic-to-jpg",
    title: "Muuta HEIC JPG-muotoon ilmaiseksi",
    description:
      "Muunna HEIC JPG-muotoon vaivattomasti iPhonen kuvista. Tee kuvista heti yhteensopivia Windowsin, Androidin ja yleisimpien palveluiden kanssa ilman laadusta tinkimista.",
    from: "image/heic",
    to: "image/jpeg",
  },
  {
    slug: "png-to-webp",
    title: "Muuta PNG WebP-muotoon ilmaiseksi",
    description:
      "Muuta PNG WebP-muotoon ja pienennä kuvatiedostojen kokoa nopeasti. Sopii erityisesti verkkosivuille, kun haluat nopeammat latausajat ja paremman kayttajakokemuksen.",
    from: "image/png",
    to: "image/webp",
  },
];
