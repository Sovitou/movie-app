# Movie App — Project Requirements & PocketBase Schemas

> Full-stack mobile Movie Application (Expo + Nativewind + TMDb + PocketBase)

---

## 1. Project summary

A full-featured mobile Movie App built with **Expo (React Native)** that consumes **TMDb** for movie metadata and uses **PocketBase** as the backend for app-specific data (auth, favorites, watchlists, reviews, comments, likes). Data fetching will be done with **Axios** and **TanStack Query** for caching and sync.

**Primary goals**

* Learn a full mobile full-stack flow (auth, third-party API integration, offline caching, user-generated content).
* Build a production-like architecture that's easy to swap API sources.

---

## 2. Tech stack

* Frontend: Expo (React Native), Nativewind, React components
* State & data fetching: Axios + TanStack Query
* Backend / persistence: PocketBase (collections, auth)
* External API: TMDb (The Movie Database)
* Storage: Expo Secure Store or AsyncStorage for session persistence
* Optional: Expo Notifications for push notifications

---

## 3. Functional requirements (short)

1. **Auth & Users**

   * Email/password sign up & login via PocketBase
   * Google OAuth via PocketBase OAuth provider
   * Profile fields: username, avatar, bio
   * Session persistence (keep logged in)

2. **Movie Data**

   * Source: TMDb API
   * Search movies & TV shows by title
   * Browse: Trending, Upcoming, Top Rated
   * Movie details: poster, title, release year, runtime, genres, cast, ratings
   * Recommendations: related / similar movies

3. **User Interactions**

   * Favorites (per-user list)
   * Watchlist (per-user list)
   * Ratings (numeric or star)
   * Reviews (text)
   * Comments on reviews
   * Likes on reviews/comments

---

## 4. Non-functional requirements

* Secure token storage (use expo-secure-store or similar)
* Offline caching for favorites/watchlist and recent searches (movies cache collection)
* Scalable PocketBase schema that avoids duplicating heavy TMDb data (cache only when necessary)
* Clean, reusable UI components styled with Nativewind
* Progressive enhancement: the app should work if TMDb limit is reached by showing cached data

---

## 5. PocketBase schema (collections)

> Notes on design: TMDb is the source of truth for movie metadata. PocketBase stores references (`tmdb_id`) and user-generated content. We'll include an optional `movies_cache` collection for offline/cached metadata or custom entries.

### 5.1 `users` (auth) — default PocketBase users collection

PocketBase provides an auth `users` collection. Extend it with these custom fields in the schema (add via PocketBase admin UI):

| Field         | Type | Required | Unique | Description                     |
| ------------- | ---: | -------: | -----: | ------------------------------- |
| `username`    | text |      yes |    yes | public-friendly handle          |
| `displayName` | text |       no |     no | full name                       |
| `avatar`      | file |       no |     no | profile picture (image)         |
| `bio`         | text |       no |     no | short bio (max length e.g. 300) |
| `locale`      | text |       no |     no | user locale (eg `en`, `km`)     |

**Access rules & notes**

* Creation: open to public (signup)
* Update: `@request.auth.id != "" && @request.auth.id = id` (only user can update their fields)
* Admins can be set with a boolean flag or role field if needed.

---

### 5.2 `favorites`

Store user favorites as individual records referencing `tmdb_id`.

| Field         |                   Type | Required | Description                   |
| ------------- | ---------------------: | -------: | ----------------------------- |
| `user`        |      relation -> users |      yes | owner reference               |
| `tmdb_id`     |                 number |      yes | TMDb movie/TV numeric id      |
| `media_type`  | select (`movie`, `tv`) |      yes | media type                    |
| `title`       |                   text |       no | cached title (optional)       |
| `poster_path` |                   text |       no | cached poster path (optional) |
| `created_at`  |            system date |     auto | when favorited                |

**Constraints & behaviour**

* Enforce (client-side / server-side) uniqueness per `(user, tmdb_id, media_type)` to avoid duplicates.

**Rules**

* Create: `@request.auth.id != ""` (only authenticated users)
* Update/Delete: `@request.auth.id != "" && user = @request.auth.id` (only owner)

---

### 5.3 `watchlist`

Similiar to `favorites` but includes an optional `status` or `priority` field.

| Field        |                                              Type | Required | Description         |
| ------------ | ------------------------------------------------: | -------: | ------------------- |
| `user`       |                                 relation -> users |      yes |                     |
| `tmdb_id`    |                                            number |      yes |                     |
| `media_type` |                                            select |      yes |                     |
| `status`     | select (`plan to watch`, `watching`, `completed`) |       no |                     |
| `priority`   |                                            number |       no | user prioritization |
| `notes`      |                                              text |       no | user notes          |
| `created_at` |                                       system date |     auto |                     |

**Rules**

* Same as `favorites` (auth required; only owner may modify)

---

### 5.4 `ratings`

Store numeric ratings provided by users.

| Field        |              Type | Required | Description         |
| ------------ | ----------------: | -------: | ------------------- |
| `user`       | relation -> users |      yes |                     |
| `tmdb_id`    |            number |      yes |                     |
| `media_type` |            select |      yes |                     |
| `value`      |            number |      yes | range 1–10 (or 1–5) |
| `created_at` |       system date |     auto |                     |

**Rules**

* Create: authenticated only
* Update/Delete: only owner
* Option: disallow multiple ratings by same user for same `tmdb_id` (can replace existing rating client-side)

---

### 5.5 `reviews`

User-written text reviews.

| Field        |                    Type | Required | Description                                    |
| ------------ | ----------------------: | -------: | ---------------------------------------------- |
| `user`       |       relation -> users |      yes |                                                |
| `tmdb_id`    |                  number |      yes |                                                |
| `media_type` |                  select |      yes |                                                |
| `title`      |                    text |       no |                                                |
| `content`    | text (markdown allowed) |      yes |                                                |
| `rating`     |     relation -> ratings |       no | optional pointer to a rating record            |
| `like_count` |                  number |       no | denormalized count (updated by server or cron) |
| `created_at` |             system date |     auto |                                                |
| `updated_at` |             system date |     auto |                                                |

**Rules**

* Create: `@request.auth.id != ""`
* Update/Delete: `@request.auth.id != "" && user = @request.auth.id`
* Admins can moderate (delete/edit) reviews

---

### 5.6 `comments`

Comments attached to a `review`.

| Field        |                Type | Required | Description |
| ------------ | ------------------: | -------: | ----------- |
| `user`       |   relation -> users |      yes |             |
| `review`     | relation -> reviews |      yes |             |
| `content`    |                text |      yes |             |
| `created_at` |         system date |     auto |             |

**Rules**

* Create: auth required
* Update/Delete: only owner (or admin)

---

### 5.7 `likes`

Track likes for reviews or comments. Option A: single likes collection with optional relations; Option B: dedicated `likes_reviews` and `likes_comments`. We'll pick Option A with two nullable relation fields.

| Field        |                 Type | Required | Description |
| ------------ | -------------------: | -------: | ----------- |
| `user`       |    relation -> users |      yes |             |
| `review`     |  relation -> reviews |       no |             |
| `comment`    | relation -> comments |       no |             |
| `created_at` |          system date |     auto |             |

**Rules**

* Create: `@request.auth.id != ""`
* Prevent double-likes by same user for same target (client-side check + server-side validation if needed)

---

### 5.8 `movies_cache` (optional but recommended)

Cache TMDb responses for offline viewing and to reduce API calls.

| Field          |        Type | Required | Description                           |
| -------------- | ----------: | -------: | ------------------------------------- |
| `tmdb_id`      |      number |      yes | unique                                |
| `media_type`   |      select |      yes |                                       |
| `data`         |        json |      yes | full TMDb payload (or trimmed subset) |
| `poster_file`  |        file |       no | optional cached poster image          |
| `last_updated` | system date |     auto |                                       |

**Usage**

* When user favorites or views details, create or update a cache record.
* On fetch: prefer cache if `last_updated` within a given TTL (e.g., 7 days).

---

### 5.9 `admin_logs` (optional)

For moderation actions. Useful for auditing deletes/edits.

| Field               |              Type | Required | Description           |
| ------------------- | ----------------: | -------: | --------------------- |
| `action`            |              text |      yes | e.g., `delete_review` |
| `performed_by`      | relation -> users |      yes |                       |
| `target_collection` |              text |      yes |                       |
| `target_id`         |              text |      yes |                       |
| `reason`            |              text |       no |                       |
| `timestamp`         |       system date |     auto |                       |

---

## 6. API & data flow (how things connect)

1. **Search flow**

   * Client calls TMDb `/search/movie` or `/search/tv` via Axios.
   * Use TanStack Query to cache and deduplicate queries.

2. **View details flow**

   * Client queries `movies_cache` for `tmdb_id`.
   * If cache miss or stale, fetch TMDb `/movie/{id}?append_to_response=credits,recommendations,videos` and store in `movies_cache`.
   * Display movie details plus recommendations.

3. **Favorites/watchlist**

   * Create record in PocketBase favorites/watchlist. PocketBase returns a record id and timestamp.
   * Client updates local cache/UI optimistically.

4. **Reviews/ratings/comments/likes**

   * CRUD operations performed against PocketBase collections.
   * Displayed by combining PocketBase content (reviews) with TMDb metadata (title/poster) by joining on `tmdb_id` on the client.

---

## 7. PocketBase rules examples (policy snippets)

* Reviews create: `@request.auth.id != ""`
* Reviews update/delete: `@request.auth.id != "" && user = @request.auth.id`
* Favorites create: `@request.auth.id != ""`
* Favorites delete: `@request.auth.id != "" && user = @request.auth.id`

> Note: PocketBase rule expressions allow referencing request properties and record fields. Use admin UI to configure rules per collection action (list, get, create, update, delete).

---

## 8. Example code snippets

### 8.1 Axios TMDb service (TypeScript)

```ts
// lib/tmdb.ts
import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

export const tmdbClient = axios.create({
  baseURL: TMDB_BASE,
  params: { api_key: TMDB_API_KEY },
});

export const searchMovies = (query: string) =>
  tmdbClient.get("/search/movie", { params: { query } }).then(r => r.data);

export const getMovieDetails = (id: number) =>
  tmdbClient
    .get(`/movie/${id}`, { params: { append_to_response: "credits,recommendations,videos" } })
    .then(r => r.data);
```

### 8.2 TanStack Query usage (basic)

```ts
// hooks/useMovieDetails.ts
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "../lib/tmdb";

export const useMovieDetails = (tmdbId: number) => {
  return useQuery(["movie", tmdbId], () => getMovieDetails(tmdbId), {
    staleTime: 1000 * 60 * 60 * 24, // 24h cache
    retry: 1,
  });
};
```

### 8.3 PocketBase example: add favorite

```ts
import PocketBase from "pocketbase";

const pb = new PocketBase("https://your-pocketbase.example.com");

export async function addFavorite(userId: string, tmdbId: number, mediaType: string) {
  const record = await pb.collection("favorites").create({
    user: userId,
    tmdb_id: tmdbId,
    media_type: mediaType,
  });
  return record;
}
```

---

## 9. Roadmap (step-by-step milestones)

Below are recommended milestones and tasks to implement this project. **Do not treat these as time estimates** — these are ordered steps you can follow.

### Milestone A — Project setup & infra

* Initialize Expo project + configure TypeScript.
* Install libraries: axios, @tanstack/react-query, pocketbase, nativewind, expo-secure-store.
* Setup PocketBase (local Docker or hosted) and create initial `users` collection (signup flow).
* Add environment configs (.env for TMDb key and PocketBase URL).

**Acceptance**: App boots; user can create an account and remain logged in.

### Milestone B — TMDb integration & search

* Implement TMDb axios client.
* Create search screen and results list.
* Integrate TanStack Query for searching and caching.
* Implement movie details screen with `append_to_response` to fetch credits & recommendations.

**Acceptance**: Search returns results; details screen shows cast & recommendations.

### Milestone C — Favorites & Watchlist

* Add `favorites` and `watchlist` collections in PocketBase.
* Implement add/remove actions, UI buttons, and local optimistic updates.
* Implement `movies_cache` write on add/view.

**Acceptance**: User can favorite/ watchlist; items persist across sessions.

### Milestone D — Reviews & Ratings

* Add `ratings` and `reviews` collections in PocketBase.
* Allow users to create a rating and a review (connected UI flows).
* Display average rating (calculate on client by fetching user ratings or a server-side computed value if you choose to denormalize).

**Acceptance**: Users can post reviews & ratings; other users can view them.

### Milestone E — Comments & Likes

* Implement `comments` and `likes` collections and UI components.
* Allow nested comments (optional) or one-level comments.
* Add like/unlike functionality and update counts.

**Acceptance**: Users can comment and like reviews and comments.

### Milestone F — Social features & polish

* Add follow/unfollow (if desired) and an activity feed (optional).
* Implement profile editing (avatar upload, bio).
* Add dark mode support & UX polish.

**Acceptance**: Profile updates persist; UI polished.

### Milestone G — Admin & moderation

* Add `admin_logs` and admin roles; implement moderation endpoints in the PocketBase UI.
* Add UI for admins to moderate reviews/comments.

**Acceptance**: Admins can remove inappropriate content and logs are stored.

### Milestone H — Offline, caching, and final polish

* Improve `movies_cache` TTL and offline flows.
* Add robust error handling and request retries.
* Prepare release build and distribution.

**Acceptance**: App works reasonably with intermittent connectivity and is ready for distribution.

---

## 10. Environment variables & secrets

* `TMDB_API_KEY` — TMDb API key
* `POCKETBASE_URL` — PocketBase instance URL
* `GOOGLE_OAUTH_CLIENT_ID` — for Google OAuth (configure PocketBase provider)

Store secrets in `.env` and in your build configuration. Use `expo-constants` or environment plugin for Expo.

---

## 11. Additional recommendations & notes

* **Google OAuth**: configure redirect URIs in Google Cloud console and add provider in PocketBase admin settings.
* **Unique constraints**: PocketBase does not provide compound unique constraints out-of-the-box. Enforce uniqueness (e.g. avoid duplicate favorites) client-side or via server-side hooks if you run a custom PocketBase backend.
* **Type generation**: consider script to generate TypeScript types from PocketBase schema to keep client types in sync.

---

## 12. Next steps (suggested immediate tasks)

1. Decide PocketBase hosting: self-host (Docker) or managed. If self-hosting, prepare Docker setup.
2. Provide TMDb API key and PocketBase URL (or stop here and implement generically using env vars).
3. I can scaffold the PocketBase collection JSON or produce TypeScript models next — which would you prefer?

---

*End of document.*
