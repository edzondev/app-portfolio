import { describe, expect, test } from "bun:test";
import { type Project, projects } from "../src/data/projects";

const expectedTitles = ["Konti", "Inkyra", "Quipu", "Aulara", "Naya"];

const titlesWithCardMedia = ["Konti", "Inkyra", "Quipu", "Aulara"];

function cardImagePath(image: Project["image"] | string): string | undefined {
  if (typeof image === "string") return image;
  return image?.src;
}

describe("project data", () => {
  test("preserves the approved order", () => {
    expect(projects.map(({ title }) => title)).toEqual(expectedTitles);
    expect(projects.map(({ id }) => id)).toEqual([1, 2, 3, 4, 5]);
  });

  test("keeps public destinations only on published projects", () => {
    const publishedProjects = projects.filter(
      (project): project is Extract<Project, { url: string }> =>
        "url" in project,
    );

    expect(publishedProjects.map(({ title, url }) => [title, url])).toEqual([
      ["Konti", "https://www.konti.dev/"],
      ["Inkyra", "https://inkyra.app/"],
      ["Quipu", "https://quipu-finance.app/"],
    ]);

    for (const project of publishedProjects) {
      expect(new URL(project.url).protocol).toBe("https:");
      expect("status" in project).toBe(false);
    }
  });

  test("marks Aulara and Naya as unavailable while in development", () => {
    const developmentProjects = projects.filter(
      (project): project is Extract<Project, { status: "En desarrollo" }> =>
        "status" in project,
    );

    expect(
      developmentProjects.map(({ title, status }) => ({ title, status })),
    ).toEqual([
      { title: "Aulara", status: "En desarrollo" },
      { title: "Naya", status: "En desarrollo" },
    ]);

    for (const project of developmentProjects) {
      expect("url" in project).toBe(false);
    }
  });

  test("keeps every project complete and wires abstract card media", () => {
    expect(projects).toHaveLength(5);

    for (const project of projects) {
      expect(project.id).toBeGreaterThan(0);
      expect(project.category.length).toBeGreaterThan(0);
      expect(project.description.length).toBeGreaterThan(40);
      expect(project.stack.length).toBeGreaterThanOrEqual(5);
      expect(project.year.length).toBeGreaterThan(0);

      if (titlesWithCardMedia.includes(project.title)) {
        expect(cardImagePath(project.image)).toContain(
          `${project.title.toLowerCase()}-abstract.webp`,
        );
      } else {
        expect(project.image).toBeUndefined();
      }
    }
  });
});
