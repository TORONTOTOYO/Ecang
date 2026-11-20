import { about, background } from "../data.js";

export default function About() {
  return (
    <section id="about" className="about">
      <div>
        <h2 className="section-title">{about.title}</h2>
        <p>{about.text}</p>
      </div>

      <div>
        <h2 className="section-title">My background</h2>
        <ol className="timeline">
          {background.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.place}</span>
              <em>{item.year}</em>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
