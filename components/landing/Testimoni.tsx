"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { cardTestimonialsData } from "@/constant/cardTestimonials";

export default function Testimoni() {
  const testimonials = cardTestimonialsData.map((item) => ({
    quote: item.description,
    name: item.name,
    title: item.year,
  }));
  return (
    <div
      id="testimonials"
      className=" flex flex-col antialiased items-center justify-center relative overflow-hidden"
    >
      <h1 className="font-light text-2xl md:text-4xl md:pt-10 pt-8 md:pb-12 pb-4 text-dark">
        What do they say?
      </h1>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
      <InfiniteMovingCards items={testimonials} direction="left" speed="slow" />
    </div>
  );
}
