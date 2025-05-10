import { Button } from "@/components/ui/button";
import Image from "next/image";
import Hero from "./_components/Hero";
import Testimonials from "./_components/Testimonials";


export default function Home() {
  return (
    <div>
      {/* hero->searchbar + category */}
      <Hero />
      <Testimonials />
     
    </div>
  );
}
