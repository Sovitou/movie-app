# Project TODO List

This document outlines the tasks required to complete the Movie App project, based on the `PRD-v1.md`.

## Immediate Tasks

- [✅ ] Decide on PocketBase hosting (self-host with Docker or managed).
- [ ✅ ] Set up TMDb API key and PocketBase URL in environment variables.
- [ ✅] Generate TypeScript types from the PocketBase schema.

---

## Milestone A: Project Setup & Infrastructure

- [✅ ] Initialize Expo project and configure TypeScript.
- [✅ ] Install necessary libraries: `axios`, `@tanstack/react-query`, `pocketbase`, `nativewind`, `expo-secure-store`.
- [✅ ] Set up PocketBase instance (local Docker or hosted).
- [ ] Create the initial `users` collection and configure the signup/login flow.
- [✅ ] Add environment variable configuration (`.env`) for TMDb key and PocketBase URL.

**Acceptance Criteria**: App boots; user can create an account and remain logged in.

---

## Milestone B: TMDb Integration & Search

- [ ] Implement the TMDb Axios client service.
- [ ] Create the search screen with an input field and a results list component.
- [ ] Integrate TanStack Query for handling search queries and caching results.
- [ ] Implement the movie details screen.
- [ ] Fetch extra details like credits and recommendations using `append_to_response`.

**Acceptance Criteria**: Search returns results from TMDb; details screen shows movie information, cast, and recommendations.

---

## Milestone C: Favorites & Watchlist

- [ ] Create `favorites` and `watchlist` collections in PocketBase.
- [ ] Implement UI buttons for adding/removing items from favorites and watchlist.
- [ ] Implement the underlying functions to interact with the PocketBase collections.
- [ ] Use optimistic updates for a smoother user experience.
- [ ] Implement the `movies_cache` collection and write to it when a user favorites, adds to watchlist, or views a movie.

**Acceptance Criteria**: User can add/remove movies to their favorites and watchlist; these items persist across sessions.

---

## Milestone D: Reviews & Ratings

- [ ] Create `ratings` and `reviews` collections in PocketBase.
- [ ] Design and implement UI for submitting ratings (e.g., star rating).
- [ ] Design and implement UI for writing and submitting reviews.
- [ ] Connect the UI to create records in the PocketBase collections.
- [ ] Display reviews and ratings on the movie details screen.
- [ ] Calculate and display the average rating for a movie on the client-side.

**Acceptance Criteria**: Users can post reviews and ratings for movies; other users can view them.

---

## Milestone E: Comments & Likes

- [ ] Create `comments` and `likes` collections in PocketBase.
- [ ] Implement UI for users to comment on reviews.
- [ ] Implement UI for users to like/unlike reviews and comments.
- [ ] Update like counts on the relevant review/comment.
- [ ] Ensure proper data relationships are established in PocketBase (e.g., a comment is linked to a review).

**Acceptance Criteria**: Users can comment on reviews and like both reviews and comments.

---

## Milestone F: Social Features & Polish

- [ ] Implement user profile editing (avatar upload, bio, display name).
- [ ] (Optional) Add follow/unfollow functionality and an activity feed.
- [ ] Add support for dark mode.
- [ ] General UI/UX polishing and refinement.

**Acceptance Criteria**: User profile updates are saved and reflected in the UI; the app is visually polished.

---

## Milestone G: Admin & Moderation

- [ ] Create `admin_logs` collection in PocketBase.
- [ ] Define an admin role for certain users.
- [ ] Implement UI for admins to moderate (delete/edit) reviews and comments.
- [ ] Log moderation actions in the `admin_logs` collection.

**Acceptance Criteria**: Admins can remove inappropriate content, and these actions are logged.

---

## Milestone H: Offline, Caching, and Final Polish

- [ ] Improve the `movies_cache` logic with a Time-To-Live (TTL) strategy.
- [ ] Enhance offline functionality, allowing users to view cached movies.
- [ ] Implement robust error handling and request retry logic (e.g., with TanStack Query).
- [ ] Prepare the app for a release build (e.g., create production builds for Android/iOS).

**Acceptance Criteria**: The app functions reasonably with intermittent connectivity and is ready for distribution.
