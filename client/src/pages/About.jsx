export default function About() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 820 }}>
        <h1 className="section-title">About the Studio</h1>
        <p className="section-sub">A small practice working at the intersection of craft, climate and context.</p>
        <div className="prose">
          <p>
            Founded in 2015, Studio.Arch is an architecture practice led by a registered architect
            working with a rotating team of collaborators — engineers, landscape designers,
            fabricators and photographers.
          </p>
          <p>
            We take on a limited number of projects each year so that every commission receives
            the attention it deserves. Our work spans private houses, adaptive reuse of industrial
            buildings, cultural spaces and small commercial interiors.
          </p>
          <h2 style={{ marginTop: 32, fontSize: 22, fontWeight: 500 }}>What we do</h2>
          <ul>
            <li>Feasibility studies and site analysis</li>
            <li>Concept design through to construction documentation</li>
            <li>Interior architecture and furniture design</li>
            <li>Heritage and adaptive reuse consultancy</li>
            <li>Construction administration and site supervision</li>
          </ul>
          <h2 style={{ marginTop: 32, fontSize: 22, fontWeight: 500 }}>How we work</h2>
          <p>
            Every project starts with listening. We spend time on site, in the existing building,
            or with the brief before drawing a single line. The design process is iterative and
            transparent — clients see models, drawings and material samples at every stage.
          </p>
          <p>
            We believe good architecture is not a signature style but a careful response to a
            specific place, budget and way of living.
          </p>
        </div>
      </div>
    </section>
  );
}
