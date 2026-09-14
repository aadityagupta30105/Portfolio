// Speaker portrait: the front-facing idle frames, animated in index.css.
export default function Portrait() {
  return (
    <div
      aria-hidden="true"
      className="portrait shrink-0 self-end rounded-sm"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}tiles/adam_idle_anim.png)`,
      }}
    />
  );
}
