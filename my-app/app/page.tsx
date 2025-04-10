import { ArticleTeaser } from "@/components/drupal/ArticleTeaser"
import { drupal } from "@/lib/drupal"
import type { Metadata } from "next"
import type { DrupalNode } from "next-drupal"
import Hero from "@/components/custom/Hero"
import Team from "@/components/custom/Team"
import Blog from "@/components/custom/Blog"
import Sponsor from "@/components/custom/Sponsor"
import Footer from "@/components/custom/Footer"
export const metadata: Metadata = {
  description: "A Next.js site powered by a Drupal backend.",
}

export default async function Home() {
  
  return (
    <>
      <Hero />
      <Blog />
      <Team />
      <Sponsor />
      <Footer />
    </>
  )
}
