export default function MediaGallery({ media = [] }) {
  if (!media.length) return null;
  return (
    <div className="gallery">
      {media.map((m, i) => (
        <figure key={i} className="gallery-item" style={{ margin: 0 }}>
          {m.type === 'video' ? (
            <video src={m.url} controls playsInline preload="metadata" />
          ) : (
            <img src={m.url} alt={m.caption || ''} loading="lazy" />
          )}
          {m.caption && <figcaption>{m.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
