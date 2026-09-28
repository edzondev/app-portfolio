import type { ImageMetadata } from "astro";
import aularaImage from "../assets/projects/aulara-abstract.webp";
import inkyraImage from "../assets/projects/inkyra-abstract.webp";
import kontiImage from "../assets/projects/konti-abstract.webp";
import quipuImage from "../assets/projects/quipu-abstract.webp";

interface ProjectBase {
  id: number;
  title: string;
  category: string;
  description: string;
  stack: readonly string[];
  year: string;
  image?: ImageMetadata;
}

export interface PublishedProject extends ProjectBase {
  url: string;
  status?: never;
}

export interface DevelopmentProject extends ProjectBase {
  status: "En desarrollo";
  url?: never;
}

export type Project = PublishedProject | DevelopmentProject;

export const projects: readonly Project[] = [
  {
    id: 1,
    title: "Konti",
    category: "Fintech · Tributación",
    description:
      "Asistente tributario móvil para Perú que organiza ingresos, comprobantes y deducciones, utiliza OCR para extraer información y ayuda a estimar obligaciones fiscales.",
    stack: [
      "Expo",
      "React Native",
      "TypeScript",
      "NestJS",
      "PostgreSQL",
      "Cloudflare R2",
      "RevenueCat",
    ],
    year: "2024–actualidad",
    url: "https://www.konti.dev/",
    image: kontiImage,
  },
  {
    id: 2,
    title: "Inkyra",
    category: "Creative tech · IA",
    description:
      "Plataforma que transforma ideas en conceptos de tatuajes mediante IA y conecta la exploración creativa con un flujo estructurado de cotización para tatuadores.",
    stack: [
      "Next.js",
      "TypeScript",
      "Prisma ORM",
      "Neon",
      "Cloudflare R2",
      "Better Auth",
    ],
    year: "2026",
    url: "https://inkyra.app/",
    image: inkyraImage,
  },
  {
    id: 3,
    title: "Quipu",
    category: "Fintech · Finanzas personales",
    description:
      "Aplicación de disciplina financiera que calcula cuánto puedes gastar hoy sin comprometer tu mes, utilizando sobres, disponibilidad diaria y un coach silencioso.",
    stack: [
      "Next.js",
      "Convex",
      "TypeScript",
      "Better Auth",
      "Tailwind CSS",
      "Polar",
    ],
    year: "2026",
    url: "https://quipu-finance.app/",
    image: quipuImage,
  },
  {
    id: 4,
    title: "Aulara",
    category: "Edtech · Gestión escolar",
    description:
      "Plataforma multitenant para colegios privados enfocada en centralizar pensiones, pagos, conciliación y procesos administrativos desde una experiencia moderna.",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Better Auth",
      "Turborepo",
    ],
    year: "2026",
    status: "En desarrollo",
    image: aularaImage,
  },
  {
    id: 5,
    title: "Naya",
    category: "Seguridad personal · Movilidad",
    description:
      "Proyecto de tesis convertido en una app de seguridad para viajes en taxi por aplicativo, con ubicación en tiempo real, botón SOS y alertas a contactos de emergencia.",
    stack: [
      "Expo",
      "React Native",
      "TypeScript",
      "Supabase",
      "Mapbox",
      "Twilio",
    ],
    year: "2026",
    status: "En desarrollo",
  },
];
