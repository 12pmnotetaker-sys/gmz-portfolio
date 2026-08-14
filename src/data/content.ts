import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

/**
 * Query helpers for the content collections.
 *
 * Pages call these instead of calling getCollection directly, so the rules
 * about what is publishable live in one place: drafts never ship, and an
 * unapproved testimonial never renders anywhere.
 */

export type Project = CollectionEntry<'projects'>;
export type Service = CollectionEntry<'services'>;
export type Testimonial = CollectionEntry<'testimonials'>;

/** True in `astro dev`, false in a production build. */
const isDev = import.meta.env.DEV;

/** Drafts are visible while developing and invisible in production. */
const publishable = <T extends { data: { draft?: boolean } }>(entry: T) =>
  isDev || !entry.data.draft;

const byCompletedDesc = (a: Project, b: Project) =>
  b.data.completed.getTime() - a.data.completed.getTime();

const byOrderThenTitle = (a: Service, b: Service) =>
  a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);

/** Every publishable project, newest completion first. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', publishable);
  return projects.sort(byCompletedDesc);
}

/** Featured projects for the homepage, in explicit `order`, newest as tiebreak. */
export async function getFeaturedProjects(limit?: number): Promise<Project[]> {
  const projects = (await getProjects())
    .filter((p) => p.data.featured)
    .sort((a, b) => a.data.order - b.data.order || byCompletedDesc(a, b));
  return typeof limit === 'number' ? projects.slice(0, limit) : projects;
}

/** Every publishable service, in `order`. */
export async function getServices(): Promise<Service[]> {
  const services = await getCollection('services', publishable);
  return services.sort(byOrderThenTitle);
}

export async function getFeaturedServices(limit?: number): Promise<Service[]> {
  const services = (await getServices()).filter((s) => s.data.featured);
  return typeof limit === 'number' ? services.slice(0, limit) : services;
}

/**
 * Approved testimonials only. An unapproved quote is a client's private
 * words; it stays out of every listing until they have said yes.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const testimonials = await getCollection('testimonials', (t) => t.data.approved);
  return testimonials.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedTestimonials(limit?: number): Promise<Testimonial[]> {
  const testimonials = (await getTestimonials()).filter((t) => t.data.featured);
  return typeof limit === 'number' ? testimonials.slice(0, limit) : testimonials;
}

/** Resolves a project's linked testimonial, respecting the approval gate. */
export async function getProjectTestimonial(project: Project): Promise<Testimonial | undefined> {
  const ref = project.data.testimonial;
  if (!ref) return undefined;
  const entry = await getEntry(ref);
  return entry?.data.approved ? entry : undefined;
}

/** Projects sharing a discipline with the given one, for "related work". */
export async function getRelatedProjects(project: Project, limit = 3): Promise<Project[]> {
  const disciplines = new Set(project.data.disciplines);
  return (await getProjects())
    .filter((p) => p.id !== project.id)
    .map((p) => ({
      project: p,
      overlap: p.data.disciplines.filter((d) => disciplines.has(d)).length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || byCompletedDesc(a.project, b.project))
    .slice(0, limit)
    .map(({ project: p }) => p);
}

/** Every discipline actually used by a published project, with counts. */
export async function getDisciplineFacets(): Promise<{ value: string; count: number }[]> {
  const projects = await getProjects();
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const discipline of project.data.disciplines) {
      counts.set(discipline, (counts.get(discipline) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

/** Human-readable labels for the service-line slugs. */
export const SERVICE_LINE_LABELS: Record<string, string> = {
  'design-build': 'Design / Build',
  maintenance: 'Maintenance',
};

/** Human-readable labels for discipline slugs. */
export const DISCIPLINE_LABELS: Record<string, string> = {
  hardscape: 'Hardscape',
  planting: 'Planting',
  irrigation: 'Irrigation',
  drainage: 'Drainage',
  fencing: 'Fencing',
  lighting: 'Lighting',
  lawn: 'Lawn',
  grading: 'Grading',
  concrete: 'Concrete',
  masonry: 'Masonry',
};

export const labelFor = (map: Record<string, string>, key: string): string => map[key] ?? key;
