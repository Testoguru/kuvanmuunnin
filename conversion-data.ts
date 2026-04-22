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
  {
    slug: "jpeg-to-pdf",
    title: "Muuta JPEG PDF-muotoon ilmaiseksi",
    description:
      "Muunna JPEG-kuvat PDF-muotoon helposti suoraan selaimessa. Luo siistit dokumentit jakamiseen, tulostamiseen ja arkistointiin ilman erillisia ohjelmia.",
    from: "image/jpeg",
    to: "application/pdf",
  },
  {
    slug: "png-to-pdf",
    title: "Muuta PNG PDF-muotoon ilmaiseksi",
    description:
      "Muuta PNG-kuvat PDF-muotoon nopeasti ja turvallisesti. Erinomainen valinta, kun haluat yhdesta kuvasta helposti lahetettavan tai tulostettavan tiedoston.",
    from: "image/png",
    to: "application/pdf",
  },
  {
    slug: "heic-to-pdf",
    title: "Muuta HEIC PDF-muotoon ilmaiseksi",
    description:
      "Muunna iPhonen HEIC-kuvat PDF-muotoon vaivattomasti. Saat yhteensopivan tiedoston sopimuksiin, lomakkeisiin ja muuhun dokumenttijakoon.",
    from: "image/heic",
    to: "application/pdf",
  },
];
