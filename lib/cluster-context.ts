export type ClusterContext = {
  displayName: string;
  aliases?: string[];
  type: string;
  context: string;
  distance?: string;
  age?: string;
  parallax?: string;
  visualUrl?: string;
  visualLabel?: string;
  sources: {
    label: string;
    url: string;
  }[];
};

export const clusterContext: Record<string, ClusterContext> = {
  NGC_2632: {
    displayName: "NGC 2632",
    aliases: ["Praesepe", "Beehive Cluster", "M44"],
    type: "Cúmulo abierto",
    context: "NGC 2632, también conocido como Praesepe o M44, es uno de los cúmulos abiertos cercanos y mejor estudiados.",
    distance: "~175–180 pc",
    age: "~600–700 millones de años",
    visualUrl: "https://aladin.cds.unistra.fr/AladinLite/?target=NGC%202632&fov=3&survey=P%2FDSS2%2Fcolor",
    visualLabel: "Ver campo astronómico",
    sources: [
      { label: "SIMBAD · NGC 2632", url: "https://simbad.u-strasbg.fr/simbad/sim-basic?Ident=NGC+2632&submit=display+all+measurements" },
      { label: "A&A · Praesepe y sus colas de marea", url: "https://doi.org/10.1051/0004-6361/201935502" },
    ],
  },
  NGC_2451A: {
    displayName: "NGC 2451A",
    type: "Cúmulo abierto joven",
    context: "NGC 2451A corresponde a la componente cercana del sistema visual NGC 2451 y es un cúmulo abierto joven.",
    age: "~65 ± 15 millones de años",
    visualUrl: "https://aladin.cds.unistra.fr/AladinLite/?target=NGC%202451A&fov=3&survey=P%2FDSS2%2Fcolor",
    visualLabel: "Ver campo astronómico",
    sources: [
      { label: "A&A · The Sco-CMa stream", url: "https://doi.org/10.1051/0004-6361/201527058" },
      { label: "UCC · NGC 2451", url: "https://ucc.ar/_clusters/ngc2451/" },
    ],
  },
  Chamaleon_I: {
    displayName: "Chamaeleon I",
    type: "Región de formación estelar",
    context: "Chamaeleon I es una región cercana de formación estelar que contiene poblaciones estelares muy jóvenes.",
    distance: "~187–191 pc",
    age: "~1–2 millones de años",
    sources: [
      { label: "A&A · Poblaciones de Chamaeleon I con Gaia DR2", url: "https://doi.org/10.1051/0004-6361/201833890" },
      { label: "A&A · Miembros de Chamaeleon I", url: "https://doi.org/10.1051/0004-6361/201220128" },
    ],
  },
  Mamajek_2: {
    displayName: "Mamajek 2",
    aliases: ["μ Ophiuchi Cluster", "mu Oph Cluster"],
    type: "Agrupación estelar joven",
    context: "Mamajek 2 es una agrupación estelar cercana y joven, también conocida como μ Ophiuchi Cluster.",
    parallax: "~5,05 mas",
    distance: "~198 pc",
    sources: [
      { label: "UCC · Mamajek 2", url: "https://ucc.ar/_clusters/mamajek2/" },
      { label: "Literatura · μ Ophiuchi Cluster", url: "https://arxiv.org/abs/astro-ph/0609064" },
    ],
  },
};
