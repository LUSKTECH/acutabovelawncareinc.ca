const props = [
  {
    title: 'Local crews, local know-how',
    body: 'Halton-region soils, climate, and bylaws are second nature to our teams.',
  },
  {
    title: 'Commercial & multi-site',
    body: 'From condominium grounds to corporate campuses — one team, one standard.',
  },
  {
    title: 'Year-round programs',
    body: 'Lawn care, landscaping, hardscaping, and snow management on one schedule.',
  },
];

export default function ValueProps() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="grid gap-10 md:grid-cols-3">
        {props.map((p, i) => (
          <div key={p.title} data-reveal data-reveal-delay={i + 1}>
            <h2 className="font-display text-forest-900 text-2xl">{p.title}</h2>
            <p className="text-ink-700 mt-2">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
