import FeaturedCourses from "@/components/home/FeaturedCourses";
import HeroSection from "@/components/home/HeroSection";
import { getFeaturedCourses } from "@/lib/server/course";

export const revalidate = 300;

export default async function Home() {
  const courses = await getFeaturedCourses();

  return (
    <>
      <FeaturedCourses courses={courses} />
      <HeroSection />
    </>
  );
}
