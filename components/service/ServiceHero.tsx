import Image from 'next/image';

export default function ServiceHero({ title, image }: Readonly<{ title: string; image: string }>) {
  return (
    <section className="relative isolate">
      {/* H1 lives inside the dark gradient container so CSS contrast tools
          correctly see the dark background, not the page background behind it. */}
      <div className="relative h-[44vh] min-h-[320px] w-full overflow-hidden">
        <Image
          src={image}
          alt={`${title} project by A Cut Above Lawn Care Inc`}
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
        <div className="from-forest-900/80 via-forest-900/40 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-4 pb-8 lg:px-8">
          <h1 className="font-display text-cream-50 text-4xl text-balance sm:text-5xl md:text-6xl">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
