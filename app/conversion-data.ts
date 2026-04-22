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
      "Muunna PNG-kuvat JPG-muotoon nopeasti selaimessa ilman asennuksia. Kevyt ja helppokäyttoinen työkalu arjen kuvamuunnoksiin.",
    from: "image/png",
    to: "image/jpeg",
  },
  {
    slug: "jpg-to-png",
    title: "Muuta JPG PNG-muotoon ilmaiseksi",
    description:
      "Vaihda JPG-kuvat PNG-muotoon kätevästi verkossa. Säilytä kuvanlaatu ja hyödynnä läpinäkyvyyttä tukevat PNG-tiedostot.",
    from: "image/jpeg",
    to: "image/png",
  },
  {
    slug: "webp-to-jpg",
    title: "Muuta WebP JPG-muotoon ilmaiseksi",
    description:
      "Muunna WebP-kuvat JPG-muotoon sekunneissa. Sopii erityisesti kuville, jotka haluat avata laajasti eri laitteilla ja sovelluksilla.",
    from: "image/webp",
    to: "image/jpeg",
  },
  {
    slug: "heic-to-jpg",
    title: "Muuta HEIC JPG-muotoon ilmaiseksi",
    description:
      "Muunna iPhonen HEIC-kuvat JPG-muotoon helposti. Saat yhteensopivammat kuvat jakamiseen, tulostamiseen ja arkistointiin.",
    from: "image/heic",
    to: "image/jpeg",
  },
  {
    slug: "png-to-webp",
    title: "Muuta PNG WebP-muotoon ilmaiseksi",
    description:
      "Muuta PNG-kuvat WebP-muotoon pienempiä tiedostokokoja varten. Erinomainen valinta verkkosivuille ja nopeampiin latausaikoihin.",
    from: "image/png",
    to: "image/webp",
  },
];
