import { expect, test } from "bun:test";

const rootUrl = new URL("../", import.meta.url);

async function readOutput(relativePath: string): Promise<string> {
  return Bun.file(new URL(relativePath, rootUrl)).text();
}

test("builds a Spanish static document with complete metadata", async () => {
  const html = await readOutput("dist/index.html");
  const scripts = html.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) ?? [];

  expect(html).toContain('<html lang="es">');
  expect(html).toContain("<title>Edzon Perez — Fullstack Engineer</title>");
  expect(html).toContain(
    'name="description" content="Portfolio de Edzon Perez, Fullstack Engineer que crea productos digitales claros, útiles y técnicamente sólidos."',
  );
  expect(html).toContain(
    'rel="canonical" href="https://edzon-dev.vercel.app/"',
  );
  expect(html).toContain('rel="sitemap" href="/sitemap-index.xml"');
  expect(scripts).toHaveLength(1);
  expect(scripts[0]).toContain("data-theme-script");
  expect(scripts[0]).not.toMatch(/\bsrc=/i);
  expect(html).not.toContain("ClientRouter");
  expect(html).not.toContain("client:");
  expect(html).not.toContain("framer-motion");
  expect(html).not.toContain("motion/react");
});

test("publishes crawler discovery files", async () => {
  const robots = await readOutput("dist/robots.txt");
  const sitemapIndex = await readOutput("dist/sitemap-index.xml");
  const sitemap = await readOutput("dist/sitemap-0.xml");

  expect(robots).toContain("Allow: /");
  expect(robots).toContain(
    "Sitemap: https://edzon-dev.vercel.app/sitemap-index.xml",
  );
  expect(sitemapIndex).toContain("sitemap-0.xml");
  expect(sitemap).toContain("https://edzon-dev.vercel.app/");
});

test("renders the complete personal identity and contact paths", async () => {
  const html = await readOutput("dist/index.html");

  expect(html.match(/<h1\b/g)).toHaveLength(1);
  expect(html).toContain("Edzon");
  expect(html).toContain("Perez");
  expect(html).toContain("Ingeniero de Software · Lima, Perú");
  expect(html).toContain(
    "Desarrollo productos digitales que resuelven problemas reales con precisión técnica y simplicidad.",
  );
  expect(html).toContain("Disponible para nuevos proyectos");
  expect(html).toContain(
    "Soy Edzon, desarrollador fullstack. Construyo productos claros y agradables de usar, con experiencias fluidas que resuelven problemas sin complicar la vida.",
  );
  for (const skill of [
    "React / Next.js",
    "TypeScript",
    "Node.js / NestJS",
    "PostgreSQL / Supabase",
    "Tailwind CSS",
  ]) {
    expect(html).toContain(`<li>${skill}</li>`);
  }
  expect(html).toContain('href="mailto:edzonperez.castillo@gmail.com"');
  for (const [label, url] of [
    ["GitHub", "https://github.com/Renedz21"],
    [
      "LinkedIn",
      "https://www.linkedin.com/in/brad-edzon-perez-castillo-5342b1205/",
    ],
  ]) {
    expect(html).toContain(
      `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${label} (abre en una pestaña nueva)">`,
    );
  }
  expect(html).toContain('href="#contenido">Saltar al contenido</a>');
});

test("renders an accessible progressively enhanced theme selector", async () => {
  const html = await readOutput("dist/index.html");
  const themeToggle =
    html.match(/<input\b[^>]*\bid="theme-toggle"[^>]*>/i)?.[0] ?? "";

  expect(html).toContain(
    '<input type="checkbox" id="theme-toggle" role="switch" aria-label="Modo claro"',
  );
  expect(themeToggle).not.toBe("");
  expect(themeToggle).not.toMatch(/\schecked(?:\s|=|>)/i);
  expect(html).toContain('for="theme-toggle"');
  expect(html).toContain('class="theme-option theme-option-sun"');
  expect(html).toContain('class="theme-option theme-option-moon"');
});

test("renders published projects as safe external links", async () => {
  const html = await readOutput("dist/index.html");
  const expectedUrls = [
    "https://www.konti.dev/",
    "https://inkyra.app/",
    "https://quipu-finance.app/",
  ];
  const projectLinks =
    html.match(/<a\b[^>]*class="project-entry project-link"[^>]*>/g) ?? [];

  expect(html).not.toContain("¿QuéComo?");
  expect(html).not.toContain("que-como.vercel.app");
  expect(html.match(/<article class="project-card"/g)).toHaveLength(5);
  expect(html.match(/<h2\b/g)).toHaveLength(5);
  expect(projectLinks).toHaveLength(3);
  expect(html).not.toContain("PROJECT VISUAL — COMING SOON");
  expect(html.match(/class="project-image"/g)).toHaveLength(4);
  expect(html.match(/class="project-arrow"/g)).toHaveLength(3);

  for (const title of ["Konti", "Inkyra", "Quipu", "Aulara"]) {
    expect(html).toContain(`alt="Vista previa de ${title}"`);
  }

  for (const url of expectedUrls) {
    expect(html).toContain(`href="${url}"`);
  }

  for (const link of projectLinks) {
    expect(link).toContain('target="_blank"');
    expect(link).toContain('rel="noopener noreferrer"');
    expect(link).toContain("abre en una pestaña nueva");
  }
});

test("renders projects in development as non-interactive previews", async () => {
  const html = await readOutput("dist/index.html");
  const articles =
    html.match(/<article class="project-card"[\s\S]*?<\/article>/g) ?? [];
  const developmentArticles = articles.filter(
    (article) =>
      article.includes(">Aulara</h2>") || article.includes(">Naya</h2>"),
  );

  expect(developmentArticles).toHaveLength(2);
  expect(html.match(/>EN DESARROLLO</g)).toHaveLength(2);
  expect(html.match(/PROYECTO EN DESARROLLO/g)).toHaveLength(1);
  expect(html).toContain('alt="Vista previa de Aulara"');

  for (const article of developmentArticles) {
    expect(article).toContain('class="project-entry project-preview"');
    expect(article).toContain('class="project-status"');
    expect(article).not.toContain("<a ");
    expect(article).not.toContain("href=");
    expect(article).not.toContain("target=");
    expect(article).not.toContain('class="project-arrow"');
  }
});
