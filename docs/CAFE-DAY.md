# Today at the café · v0.7.0

The primary experience is a local-calendar café visit, replacing the previous
seven-step chapter as the home page's main action. Guests, the owner's introduction,
conversation and invitation appear in one scene. There is no numbered sequence to
unlock by submitting cups or closing visits.

## A visit

1. See today's guest and short personal coffee story; the owner brings today's
   bean, tool or recipe into the same scene, with an optional factual explanation.
2. Pull up a chair. This explicitly records a local visit and randomly selects an
   invitation, excluding the previous visited day's activity type.
3. Reply to the guest and/or accept the invitation. Conversation is independent
   of game completion; reply choices produce a short authored response.
4. Stay, decline, change your mind, or say goodbye. All paths are valid. A closed
   visit keeps the guest's narrative memento; optional activities add a small
   local memory. Reopening the same day keeps the same invitation and choices.

Three small interactions plus an optional brew invitation:

- **Cards on the table:** six face-down cards, three matching pairs, no timer,
  penalty, lives or score. A mismatch stays visible until the next choice.
- **Read a coffee label:** classify Guatemala / Washed / Arabica as origin /
  processing / species. A wrong selection offers a hint; it does not prevent exit.
  This is label literacy, not a simulation of tasting or chemical measurement.
- **Keep a café corner:** select lighting and a cup, postcard or plant in a
  code-drawn SVG composition, then keep the picture in the day's memory.
- **Brew with the owner:** try today's catalog suggestion at the existing station.
  Keep/replace protects a current pour or dirty draft. Opening the station is not
  recorded as finishing a brew or completing the activity.

The day does not require playing any game, choosing a reply or reaching a score.
No streak, attendance reward, missed-day punishment or completion quota is added.

## Seven people, not three people repeated through seven steps

| Guest | Personal coffee story |
| --- | --- |
| Linh Nguyễn · Vietnam / Asia | Sketches and memories of talking with her mother while a phin drips. |
| Luca Rossi · Italy / Europe | Nurse and bicycle tinkerer, learning to stay longer than a quick espresso. |
| Amina Njeri · Kenya / Africa | Gardener and birdsong recorder, remembers coffee cherries before coffee in a cup. |
| Camila Santos · Brazil / South America | Translator, plants and postcards; remembers her grandmother's cafezinho. |
| Aiko Tanaka · Japan / Asia | Potter with an uneven first cup, interested in how an object feels in the hand. |
| Noah Martin · Canada / North America | Sound designer whose flat recorder battery leads him to simply listen. |
| Ella Wilson · Australia / Oceania | Book repairer who keeps a café memory beside a stain in her notebook. |

They are fictional individuals; their personal/family memories do not represent
universal national customs. The original three retain their identities, with four
new visitors to make each of the first seven calendar days a different meeting.

## Calendar, library and persistence

- The local day chooses the guest (7-entry rotation) and owner discovery (existing
  12-entry bean → tool → recipe catalog). Same local day gives the same scene.
- **Finite authored pilot:** seven guest stories and twelve coffee entries repeat
  in their cycles. Combining them is not the same as writing 84 distinct stories.
  No AI-generated endless stories or unlimited library is claimed.
- Calendar arithmetic uses local components and UTC day ordinals, so DST does not
  consume a scene. Opening the app never advances a visit counter.
- At midnight/focus, an untouched or closed day updates. An open visit remains
  intact, with a separate explicit button to enter the new day. Existing brew
  settings and station controls are not recreated by a date change.
- `c6s.cafe-day.v1` stores date-keyed invitations, replies, activity state and
  compositions in a separate versioned local envelope. Memory flips survive
  reload. The previous visited activity is excluded, even if days were missed.
- History revisits saved days read-only. Returning to today does not reroll or
  erase the day's state. JSON export is available; there is no cloud sync/import UI.
- Quota failures allow play in the current session with a clear unsaved notice
  and retry. Malformed/unknown storage stays untouched, can be exported as original
  bytes, and does not prevent playing a volatile session.
- Existing chapter/cup/catalog/real-brew keys remain unchanged. The old seven-visit
  chapter remains playable in a collapsed legacy section, and the entire discovery
  catalog is available on a collapsed shelf. Neither is the new primary route.

## Verification

- 91 automated checks, including seven new calendar/content/randomness/memory/
  optional-closure/round-trip/recovery checks. Pages and Vite builds pass.
- `scripts/smoke-cafe-day.mjs`: all four invitations at 320/390/820/1440 px;
  reload-stable invitation/reply/memory/photo, wrong label hint, completion,
  declining, goodbye without completion, same-day return, VI/EN, history, layout
  bounds, brew keep-current dialog, seven independent days and seven distinct
  guests. Real browser midnight in Vietnam/New York preserves the open mini game
  and brew configuration; entering the new day changes guest and invitation.
  Quota retry and corrupt-original export are exercised.
- Eight-case pouring regression preserves control positions, scroll, focus and
  original artwork nodes. Legacy guest and catalog scripts now explicitly open
  their optional sections.
- Synthetic screenshots reviewed: [phone](review/cafe-day/320-daily.png) and
  [desktop](review/cafe-day/1440-daily.png). Actual Safari/mobile hardware and real
  human engagement/retention remain unverified.

This revision corrects the daily structure. The mechanics remain a small pilot,
with a finite content bank and reused mini-game rules; further authoring and human
playtests are needed to establish lasting variety and enjoyment.
