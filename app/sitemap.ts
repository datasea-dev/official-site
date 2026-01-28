import { MetadataRoute } from 'next';
import { getActivePositions } from '@/lib/firestoreService'; // Import fungsi lowongan kita

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://datasea.my.id'; // Domain Anda

  // 1. Halaman Statis
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

  // 2. Halaman Dinamis (Lowongan Relawan)
  // Kita ambil data dari Firebase agar lowongan juga terindex Google
  let jobRoutes: any[] = [];
  try {
    const jobs = await getActivePositions();
    jobRoutes = jobs.map((job) => ({
      url: `${baseUrl}/relawan/${job.id}`,
      lastModified: new Date(), // Idealnya ambil dari job.createdAt
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Sitemap Error:", error);
  }

  return [...staticRoutes, ...jobRoutes];
}