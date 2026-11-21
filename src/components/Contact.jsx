import { useContent } from "../content/ContentContext.jsx";

export default function Contact() {
  const { contact } = useContent();
  return (
    <section id="contact" className="contact">
      <div>
        <h2>{contact.title}</h2>
        <p>{contact.text}</p>
        {contact.email && <a className="btn btn-amber" href={`mailto:${contact.email}`}>Send me an email</a>}
      </div>
      <dl className="info">
        {contact.email && <div><dt>Email</dt><dd>{contact.email}</dd></div>}
        {contact.phone && <div><dt>Phone</dt><dd>{contact.phone}</dd></div>}
        {contact.location && <div><dt>Location</dt><dd>{contact.location}</dd></div>}
      </dl>
    </section>
  );
}
