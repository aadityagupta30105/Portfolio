/**
 * The player character shown beside dialogue text, as an RPG speaker portrait.
 *
 * Uses the same animated idle sheet the world renders, so the portrait and the
 * character you walk around as are literally the same sprite. The sheet holds
 * 24 frames of 16x32 in one row, six per direction, ordered right, up, left,
 * down; frames 18-23 are the front-facing idle, so the portrait looks out at
 * the reader. The stepped animation lives in styles/index.css.
 */
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
