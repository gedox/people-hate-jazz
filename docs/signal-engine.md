# Signal Engine — Technical Spec

**Project:** People Hate Jazz
**Status:** Draft v1
**Purpose:** Industrialize the *research and drafting* behind PHJ's presence in music communities, while keeping every published word human-sent.

---

## 1. The one-line version

A daily pipeline that reads the internet's jazz / avant-garde hip hop / neo-soul conversations, discards ~99% of them, and hands a human 10–20 places where PHJ genuinely has something to say — each with a drafted reply, ready to edit and post *manually*.

---

## 2. Foundational constraint (read this before anything else)

> **The Signal Engine holds zero write credentials.**

No posting tokens. No OAuth write scopes. No session cookies for any account. The system is architecturally incapable of publishing anything, anywhere.

This is not a limitation to be lifted later — it is the core design. It makes astroturfing structurally impossible rather than merely against policy, it forces a quality gate onto every outbound word, and it means the system can never damage the brand while you sleep.

Everything the engine produces ends in a clipboard and a link. You post, from your own logged-in account, as PHJ.

### Derived rules

- One identity. Everything is openly PHJ. No personas, no alts, no "fan" accounts.
- Roster relationships are disclosed in any draft that touches a PHJ artist.
- Official APIs preferred; `robots.txt` honored; rate limits respected with backoff.
- Discord ingestion only from servers where PHJ is present with moderator awareness.
- If the honest answer is "we have nothing to add," the system must be able to output nothing.

---

## 3. Architecture

```
Collectors ──▶ Normalizer ──▶ Enricher ──▶ Scorer ──▶ Drafter ──▶ Review Queue ──▶ (human posts)
     │                            │           │                        │
     └── raw archive              │           └── cheap/expensive       └── feedback ──▶ scorer tuning
                                  │               model tiering
                                  └── entity store ──▶ Relationship CRM
                                                       Scene Radar
```

Six services, one database, one scheduler, one small web UI.

---

## 4. Components

### 4.1 Collectors

Per-source adapters emitting a common record. Each runs on its own cadence and tracks a high-water mark so it never re-fetches.

| Source | Method | Cadence | Priority |
|---|---|---|---|
| Reddit | Official API (PRAW) | 30 min | **P0 — build first** |
| RSS / blogs | `feedparser` | 6 h | P0 |
| Bandcamp | Tag pages + release RSS | 6 h | P1 |
| YouTube | Data API v3 (comments, uploads) | 2 h | P1 |
| Discord | Bot, invited servers only | realtime | P2 |
| Forums (RYM, Steve Hoffman) | Polite scrape / RSS | 12 h | P2 |
| Twitter/X | API (paid tier) | 1 h | P3 — only if budget allows |

**Reddit seed list:** `jazz`, `Jazzfusion`, `avantgarde`, `hiphopheads`, `hiphop101`, `neosoul`, `listentothis`, `vinyl`, `WeAreTheMusicMakers`, `LetsTalkMusic`, `jazzcirclejerk`, `Bandcamp`, `experimentalmusic`.

Reddit alone is ~70% of the value. Ship it alone if you have to.

### 4.2 Normalizer

```python
Signal:
    id: str                    # sha256(source + source_id)
    source: str
    source_url: str
    author_handle: str
    posted_at: datetime
    fetched_at: datetime
    title: str | None
    body: str
    thread_context: list[str]  # parent comments, for reply-worthiness
    community: str             # subreddit / server / domain
    metrics: dict              # upvotes, comment_count, members, velocity
    raw: dict
```

### 4.3 Enricher

LLM extraction plus MusicBrainz reconciliation to pull `artists[]`, `releases[]`, `labels[]`, `venues[]` and link them to canonical IDs.

Why it matters: it turns a pile of text into a queryable scene graph. *"Every conversation mentioning Standing on the Corner in the last 30 days"* becomes one SQL query, and that is a genuinely unfair advantage.

### 4.4 Scorer — the heart of the system

Five independent scores, not one. Each separately tunable and separately debuggable.

| Score | Range | Method | Model tier |
|---|---|---|---|
| `relevance` | 0–1 | Embedding similarity vs. a curated PHJ-topics corpus, then LLM confirm | Haiku |
| `contribution` | 0–1 | *"Reading this whole thread — does PHJ have something to say that nobody has said?"* | Sonnet |
| `reach` | 0–1 | log(community size) × thread velocity × recency decay | deterministic |
| `relationship` | 0–1 | Is a Tier-1/2 person in this thread? | DB lookup |
| `urgency` | 0–1 | Exponential decay on `posted_at` — a 3-hour-old hot thread ≫ a 3-day-old one | deterministic |

```
final = 0.30·contribution + 0.25·relevance + 0.20·reach + 0.15·relationship + 0.10·urgency
```

**Two-stage funnel for cost control.** Stage 1 screens everything with Haiku on `relevance` alone and kills ~95%. Stage 2 runs the expensive `contribution` judge on survivors only.

**The contribution gate is the anti-slop mechanism.** Its prompt must explicitly reward returning a low score. The failure mode to design against is a queue that is always comfortably full — that means the gate is broken and you have built a spam machine with extra steps. A good day may legitimately produce three items.

### 4.5 Drafter

For each surviving signal, produce a reply in PHJ's voice.

**Inputs:** the thread, `voice.md` (tone, vocabulary, hard nevers), and retrieval over PHJ's own knowledge base — track annotations, past posts, roster notes — so drafts cite real specifics instead of generic enthusiasm.

**Hard constraints in the prompt:**

- Always identifiable as PHJ; never impersonate a civilian fan
- Disclose any roster relationship inline
- At most one link, and only when it genuinely answers the question
- Prefer a concrete claim over a compliment
- Return `null` if the best contribution is silence

**Output:** `{ draft, confidence, reasoning, disclosure_required }`. The `reasoning` field is for you, not the thread — it is how you audit the machine's judgment.

### 4.6 Review Queue (web UI)

The only human surface. A ranked daily digest of cards; each card shows:

- Thread context and a deep link to the original
- **Why this surfaced** — the five scores, plus the drafter's reasoning
- The draft, in an editable box
- `Copy & open thread` · `Skip` · `Mute this community` · `Mute this topic`

Skips capture a one-click reason (`not relevant` / `nothing to add` / `too old` / `wrong tone`) which feeds back into scorer tuning. That loop is what makes the system sharpen over ~6 weeks instead of staying static.

### 4.7 Relationship CRM

```python
Person:
    id: str
    handles: dict              # {reddit, discord, twitter, email}
    tier: int                  # 1 = matters enormously, 3 = on the radar
    role: str                  # curator | dj | writer | artist | label | venue | promoter
    scene_tags: list[str]
    warmth: float              # decays with silence
    last_interaction: datetime
    interaction_log: list
    notes: str
```

Surfaces tracked people the moment they post, and nudges when a Tier-1 relationship has gone cold for 60 days. It suggests; it never sends. Target: 300 people who actually matter, hand-curated, enriched automatically.

Almost nobody in independent music does this properly. It compounds harder than any content tactic in the plan.

### 4.8 Scene Radar (scouting)

Embed everything you have ever loved into a taste vector. Crawl new Bandcamp / SoundCloud / YouTube releases in your tags. Rank by similarity. Ship a weekly *"23 new releases you'd probably care about."*

Start with metadata + tag embeddings (cheap, works surprisingly well). Graduate to audio embeddings (CLAP or similar) once volume justifies it.

Long term this is likely the most valuable component in the system — it is how you scout 500 artists a week instead of 5, and signing the right unknown artist early is worth more than any amount of promotion.

---

## 5. Stack

Deliberately boring.

- **Python 3.12** — best ecosystem for this exact job (`praw`, `feedparser`, `musicbrainzngs`, `google-api-python-client`)
- **SQLite** + `sqlite-vec` for embeddings — genuinely sufficient for years at this scale. Postgres/pgvector only when it hurts.
- **Claude API** — Haiku for bulk screening, Sonnet for the contribution gate and drafting. The tiering is what keeps cost near zero.
- **APScheduler** — not Airflow. You do not need Airflow.
- **FastAPI + htmx** for the review queue. Server-rendered, no build step.
- **Deployment:** one cheap VPS, or just run it locally. It does not need to be always-on.

### Cost

~2,000 items/day screened on Haiku, ~50 deep-analyzed on Sonnet, ~20 drafted. Roughly **$30–80/month all-in** including hosting. Reddit and YouTube free API tiers cover this volume.

---

## 6. Build order

| Phase | Scope | Success test |
|---|---|---|
| **1** | Reddit collector → SQLite → relevance scoring → plaintext digest in terminal. No UI. | You read the digest and think *"I'd actually reply to three of these."* |
| **2** | Contribution gate + drafter + web review queue + skip feedback | You post from the queue 5 days running without heavy editing |
| **3** | Relationship CRM | 300 people loaded; first cold-relationship nudge acted on |
| **4** | Scene Radar | It surfaces one artist you would genuinely have missed |
| **5** | Remaining collectors | — |

**Do not skip Phase 1's success test.** If the raw signal is not there, no amount of UI fixes it — and you will know inside a week, for about four hours of work.

---

## 7. Metrics

- **Precision@10** — of the top 10 daily cards, how many did you actually post? Target >40% by week 6.
- **Reply rate** — do PHJ's posts get engaged with, or ignored?
- **Warmth delta** — Tier-1 relationships trending warmer month over month
- **Radar hit rate** — artists surfaced that you would have missed and later cared about
- **Silence rate** — % of days the queue correctly returns <5 items. If this is 0%, the contribution gate is broken.

---

## 8. Open questions

1. Which city anchors the scene work? It changes the venue/promoter half of the CRM.
2. Is `voice.md` written yet? The drafter is only as good as that file — it is the highest-leverage 500 words in the project.
3. Discord: which servers, and have you cleared ingestion with their mods?
