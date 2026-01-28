import { MetadataRoute } from 'next';
import { getActivePositions } from '@/lib/firestoreService'; 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://datasea.my.id'; 

  const staticRoutes = [
    '',
    '/tentang_kami',
    '/relawan',
    '/program_kerja',
    '/acara',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let jobRoutes: any[] = [];
  try {
    const jobs = await getActivePositions();
    jobRoutes = jobs.map((job) => ({
      url: `${baseUrl}/relawan/${job.id}`,
      lastModified: new Date(), 
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Sitemap Error:", error);
  }

  return [...staticRoutes, ...jobRoutes];
}