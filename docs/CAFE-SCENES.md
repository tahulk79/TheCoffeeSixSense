# Play the café story · v0.8.0

v0.7 shipped the intended daily scheduling but exposed it as a long dashboard.
The opening screen was dominated by a room banner, large heading, navigation and
legacy practice. Guest stories were paragraphs, the owner discovery was a text
card, and generic games had little connection to the guest. This revision changes
presentation and interaction rather than calling those cards a finished story.

## First screen and playable sequence

The first viewport now contains an original illustrated café, two characters,
a named story, the owner's coffee/tool/recipe teaser and **Step inside**. A visible
v0.8.0 badge distinguishes it from prior cached pages. The room includes rain,
steam and blinking, with reduced-motion support. All art is code-drawn SVG/CSS;
there is no generated portrait, external art engine, voice acting or automatic audio.

The visit plays as short scenes, one speaker at a time:

1. A concrete incident draws the visitor in.
2. The guest introduces a personal situation in direct dialogue.
3. A second line gives its emotional context; the player may reply or just listen.
4. The response leads the owner to the table with today's object.
5. A large original bean bag, V60, gooseneck kettle, scale, grinder or recipe page
   appears between the characters. Its name and kind are explicit; **Pick it up**
   reveals an introductory fact and keeps a discovery marker for the day's notebook.
6. A guest-specific invitation leads into the existing random optional activity.
   Memory-card props now refer to the guest's world, rather than the same generic
   coffee objects. A completed game can be replayed explicitly without rerolling
   the activity. Playing and finishing are never required to hear the ending.
7. An authored resolution returns to the incident, with a small narrative keepsake.
   Saying goodbye brings a tomorrow teaser. Replaying today's dialogue is optional.

A separate **Show me today's discovery first** route lets players skip straight
to the owner. No timed clicking, score, attendance requirement or forced brew is
introduced. Opening a brew invitation does not fabricate cup completion.

## Seven short stories

| Guest | Opening and resolution |
| --- | --- |
| Linh · Vietnam | An unfinished sketch slides off the table. She discovers she is trying to draw a conversation with her mother, not just a chair. |
| Luca · Italy | He checks his watch on a day off. The nurse and bicycle tinkerer finds a morning that need not be rushed. |
| Amina · Kenya | A cherry photo is mistaken for grapes. A bag of coffee acquires a connection to fruit and a garden. |
| Camila · Brazil | She asks for a seat while between jobs. A blank postcard becomes a note about being welcomed without needing to finish everything first. |
| Aiko · Japan | A crooked cup is unwrapped. She stops hiding the rim of the cup whose handle fits her father's hand. |
| Noah · Canada | His recorder has no battery. He listens without collecting a file and leaves a little drawing of the sound. |
| Ella · Australia | A book repairer keeps a coffee stain. Her notebook preserves a remembered conversation as well as a café address. |

These are individual fictional memories, not rules about national personality or
verified inventory/farm history. The same seven stories and twelve existing owner
introductions rotate by local day; this does not add an infinite content bank or
claim that the bean itself is newly added in every software release.

## Navigation and compatibility

- Legacy free practice is now collapsed. Its button opens the section before
  starting a cup. Studio, bean shelf, seven-visit chapter and actual-brew journal
  remain available below the story.
- Music is optional in a named disclosure, silent until explicitly enabled.
  Music/counter/library disclosure state survives language changes.
- Optional `sceneVersion`, `beat` and `inspected` fields extend the existing
  `c6s.cafe-day.v1` records. Old v0.7 records, including completed days, remain
  readable and start at the new arrival until the player enters the new scene.
- Existing replies, games, compositions and old storage keys are retained. A game
  resets only when the player explicitly chooses replay. Scene position and
  inspection survive reload. Original-byte recovery, volatile play and quota
  retry remain available.
- A local midnight preserves an open story/game and offers explicit entry to the
  new day. Existing brew settings and original pouring nodes are not recreated.
- Pouring physics, scientific limits and the old game scoring model are unchanged.

## Verification

94 automated checks and Pages/Vite builds pass. `smoke-cafe-scene.mjs` replaces the
obsolete flat daily-UI matrix (the old script name delegates to it) and covers:

- 320/390/820/1440 px, all four invitations; entry button is inside the initial
  viewport, before any scrolling or legacy menu interaction.
- Direct story, reply/listen, physical item reveal/inspection, saved scene reload,
  matching cards, wrong-label hint, photo composition, brew keep-current protection,
  explicit ending, EN and read-only history.
- All seven independent calendar stories, including no-mini-game endings, upgrade
  from a previously completed v0.7 day, explicit game replay, quota retry and
  corrupt original export.
- Vietnam/New York browser midnight keeps the scene/game and station configuration.
- Existing eight-case pour controls/scroll/focus/artwork-node matrix and original
  counter hold/release, keyboard, blur, notes/comparison/reload checks.
- Real background audio signal, volume, language/visibility state, reload/mute,
  unsupported audio fallback and reduced-motion scenery checks.

Captures are synthetic, with reduced motion for stable illustration states:
[phone arrival](review/cafe-scene/320-arrival.png),
[phone discovery](review/cafe-scene/320-discovery.png),
[desktop arrival](review/cafe-scene/1440-arrival.png),
[desktop discovery](review/cafe-scene/1440-discovery.png),
[tool](review/cafe-scene/390-tool.png),
[recipe](review/cafe-scene/390-recipe.png).

This is functional and visual verification. Whether the stories feel engaging or
make a person return remains a human playtest question; no enjoyment or retention
score is inferred from automated passes. Actual Safari/mobile hardware is unverified.
