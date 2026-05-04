import Image from "next/image";

export default function CtaBanner() {
  return (
    <section className="md:py-24 py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden h-48 md:h-80">
          <Image
            src="/images/conclu.jpg"
            alt="Join us now"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-dark/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-xl md:text-4xl font-semibold text-center md:px-0 px-6">
              Join us now, we will wait for your kind contribution
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
