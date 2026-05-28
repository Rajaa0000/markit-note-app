# markIT API Documentation

This document describes the backend API used by the markIT frontend. The API is built with Django REST Framework and uses JWT authentication through Simple JWT.

## Base URL

Production backend:

```text
https://notes-app-1-88gd.onrender.com
```

Local backend:

```text
http://localhost:8000
```

All endpoint paths below are relative to the base URL.

## Authentication

The API uses:

- Access token in the `Authorization` header
- Refresh token in an HttpOnly cookie named `refresh_token`

Authenticated requests should include:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
Accept: application/json
```

Frontend requests must also send credentials so the browser includes the refresh cookie:

```js
fetch(url, {
  credentials: "include",
});
```

## Response Format

Most list endpoints return paginated responses:

```json
{
  "next": null,
  "previous": null,
  "results": []
}
```

Error responses generally return:

```json
{
  "error": "Error message"
}
```

Some backend views use `errors` instead of `error` for specific cases.

## Auth and Account Endpoints

### Register

```http
POST /user/auth/account/
```

Creates a new user, returns an access token, and sets the refresh token cookie.

Request body:

```json
{
  "username": "chahinez",
  "email": "chahinez@example.com",
  "password": "StrongPassword123"
}
```

Success response: `201 Created`

```json
{
  "user": {
    "user_id": 1,
    "username": "chahinez"
  },
  "access": "<jwt_access_token>"
}
```

Possible errors:

- `400 Bad Request` if credentials are missing
- `400 Bad Request` if username already exists
- `400 Bad Request` if email already exists
- `400 Bad Request` if password validation fails

### Delete Account

```http
DELETE /user/auth/account/
```

Requires authentication. Deactivates the current user account, blacklists outstanding tokens, and clears the refresh cookie.

Success response: `204 No Content`

Possible errors:

- `401 Unauthorized` if the user is not authenticated

### Login

```http
POST /user/auth/login/
```

Authenticates a user, returns an access token, and sets the refresh token cookie.

Request body:

```json
{
  "username": "chahinez",
  "password": "StrongPassword123"
}
```

Success response: `200 OK`

```json
{
  "user": {
    "user_id": 1,
    "username": "chahinez"
  },
  "access": "<jwt_access_token>"
}
```

Possible errors:

- `400 Bad Request` if credentials are missing
- `401 Unauthorized` if credentials are invalid
- `403 Forbidden` if account is disabled

### Logout

```http
POST /user/auth/logout/
```

Blacklists the refresh token if present and clears the refresh cookie.

Success response: `200 OK`

```json
{
  "message": "Logged out"
}
```

### Refresh Access Token

```http
POST /user/auth/token/refresh/
```

Reads the refresh token from the HttpOnly cookie and returns a new access token.

Success response: `200 OK`

```json
{
  "access": "<new_jwt_access_token>"
}
```

Possible errors:

- `401 Unauthorized` if no refresh token exists
- `401 Unauthorized` if the refresh token is invalid or expired

### Request Password Reset

```http
POST /user/auth/password/reset/
```

Requests a password reset link for a user email. The backend currently generates the reset link using `FRONTEND_URL`.

Request body:

```json
{
  "email": "chahinez@example.com"
}
```

Success response: `200 OK`

```json
{
  "message": "If an account exists, a reset link has been sent."
}
```

### Confirm Password Reset

```http
POST /user/auth/password/reset/confirm/
```

Sets a new password using the reset UID and token.

Request body:

```json
{
  "uid": "<uidb64>",
  "token": "<reset_token>",
  "new_password": "NewStrongPassword123"
}
```

Success response: `200 OK`

```json
{
  "message": "Password reset successful"
}
```

Possible errors:

- `400 Bad Request` if fields are missing
- `400 Bad Request` if the link is invalid
- `400 Bad Request` if the token is invalid or expired
- `400 Bad Request` if password validation fails

### Change Password

```http
POST /user/auth/password/change/
```

Requires authentication. Updates the current user's password, blacklists old refresh tokens, sets a new refresh cookie, and returns a new access token.

Request body:

```json
{
  "old_password": "OldPassword123",
  "new_password": "NewStrongPassword123"
}
```

Success response: `200 OK`

```json
{
  "message": "Password updated successfully",
  "access": "<new_jwt_access_token>"
}
```

Possible errors:

- `400 Bad Request` if fields are missing
- `400 Bad Request` if old password is incorrect
- `400 Bad Request` if password validation fails

## Notes Endpoints

Note object:

```json
{
  "id": 1,
  "title": "Portfolio ideas",
  "text": "Finish notes app dashboard.",
  "bg_color": "#FFF4DF",
  "is_pinned": true,
  "created_at": "2026-05-28T12:00:00Z",
  "updated_at": "2026-05-28T12:15:00Z"
}
```

### List Unpinned Notes

```http
GET /notes/notes/
```

Requires authentication. Returns non-deleted, unpinned notes for the current user.

Success response: `200 OK`

```json
{
  "next": null,
  "previous": null,
  "results": []
}
```

Implementation note: the backend may return `404` when there are no notes. The frontend treats this as an empty list.

### Create Note

```http
POST /notes/notes/
```

Requires authentication.

Request body:

```json
{
  "title": "Portfolio ideas",
  "text": "Finish the frontend and polish the documentation.",
  "bg_color": "#FFF4DF",
  "is_pinned": true
}
```

Success response: `201 Created`

```json
{
  "id": 1,
  "title": "Portfolio ideas",
  "text": "Finish the frontend and polish the documentation.",
  "bg_color": "#FFF4DF",
  "is_pinned": true,
  "created_at": "2026-05-28T12:00:00Z",
  "updated_at": "2026-05-28T12:00:00Z"
}
```

Possible errors:

- `400 Bad Request` if validation fails
- `401 Unauthorized` if not authenticated

### List Pinned Notes

```http
GET /notes/notes/pinned/
```

Requires authentication. Returns non-deleted pinned notes for the current user.

Success response: `200 OK`

```json
{
  "next": null,
  "previous": null,
  "results": []
}
```

### Search Notes by Title

```http
GET /notes/notes/search/?term=<search_term>
```

Requires authentication. Searches the current user's non-deleted notes by title.

Success response: `200 OK`

```json
{
  "next": null,
  "previous": null,
  "results": []
}
```

Possible errors:

- `400 Bad Request` if `term` is missing

### Retrieve Note

```http
GET /notes/notes/<note_id>/
```

Requires authentication and note ownership.

Success response: `200 OK`

```json
{
  "id": 1,
  "title": "Portfolio ideas",
  "text": "Finish notes app dashboard.",
  "bg_color": "#FFF4DF",
  "is_pinned": true,
  "created_at": "2026-05-28T12:00:00Z",
  "updated_at": "2026-05-28T12:15:00Z"
}
```

Possible errors:

- `403 Forbidden` if the note belongs to another user
- `404 Not Found` if the note does not exist

### Update Note

```http
PATCH /notes/notes/<note_id>/
```

Requires authentication and note ownership.

Request body can include any editable fields:

```json
{
  "title": "Updated title",
  "text": "Updated note body",
  "bg_color": "#EAF1FF",
  "is_pinned": false
}
```

Success response: `200 OK`

```json
{
  "id": 1,
  "title": "Updated title",
  "text": "Updated note body",
  "bg_color": "#EAF1FF",
  "is_pinned": false,
  "created_at": "2026-05-28T12:00:00Z",
  "updated_at": "2026-05-28T12:20:00Z"
}
```

### Delete Note

```http
DELETE /notes/notes/<note_id>/
```

Requires authentication and note ownership. The backend soft-deletes the note by setting `is_deleted=True`.

Success response: `204 No Content`

## Todo List and Task Endpoints

Todo list object:

```json
{
  "id": 1,
  "title": "Launch checklist",
  "day": "2026-05-28",
  "task_set": []
}
```

Task object:

```json
{
  "id": 1,
  "statement": "Run production build",
  "priority": 1,
  "checked": false,
  "todo_list": 1
}
```

### List Todo Lists

```http
GET /todolists/lists/
```

Requires authentication. Returns the current user's todo lists with nested tasks.

Success response: `200 OK`

```json
{
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Launch checklist",
      "day": "2026-05-28",
      "task_set": []
    }
  ]
}
```

### Create Todo List

```http
POST /todolists/lists/
```

Requires authentication.

Request body:

```json
{
  "title": "Launch checklist",
  "day": "2026-05-28"
}
```

Success response: `201 Created`

```json
{
  "id": 1,
  "title": "Launch checklist",
  "day": "2026-05-28",
  "created_at": "2026-05-28T12:00:00Z",
  "user": 1
}
```

Implementation note: the frontend allows the title input to be empty visually, but sends `"Untitled list"` as a fallback because the backend model currently requires a title.

### Retrieve Todo List

```http
GET /todolists/lists/<list_id>/
```

Requires authentication and list ownership.

Success response: `200 OK`

```json
{
  "id": 1,
  "title": "Launch checklist",
  "day": "2026-05-28",
  "task_set": []
}
```

### Update Todo List

```http
PATCH /todolists/lists/<list_id>/
```

Requires authentication and list ownership.

Request body:

```json
{
  "title": "Updated checklist",
  "day": "2026-06-01"
}
```

Success response: `200 OK`

```json
{
  "id": 1,
  "title": "Updated checklist",
  "day": "2026-06-01",
  "created_at": "2026-05-28T12:00:00Z",
  "user": 1
}
```

### Delete Todo List

```http
DELETE /todolists/lists/<list_id>/
```

Requires authentication and list ownership. Deletes the list and its tasks.

Success response: `204 No Content`

### Create Todo List With Tasks

```http
POST /todolists/lists/tasks/
```

Requires authentication. Creates a todo list and a group of tasks in one request.

Request body:

```json
{
  "todo_list": {
    "title": "Launch checklist",
    "day": "2026-05-28"
  },
  "tasks": [
    {
      "statement": "Run production build",
      "priority": 1,
      "checked": false
    },
    {
      "statement": "Write README",
      "priority": 2,
      "checked": false
    }
  ]
}
```

Success response: `201 Created`

```json
{}
```

### Create Task

```http
POST /todolists/tasks/
```

Requires authentication. The task's todo list must belong to the current user.

Request body:

```json
{
  "statement": "Run production build",
  "priority": 1,
  "checked": false,
  "todo_list": 1
}
```

Success response: `201 Created`

```json
{
  "id": 1,
  "statement": "Run production build",
  "priority": 1,
  "checked": false,
  "todo_list": 1
}
```

Possible errors:

- `403 Forbidden` if the todo list belongs to another user
- `400 Bad Request` if validation fails

### Retrieve Task

```http
GET /todolists/tasks/<task_id>/
```

Requires authentication and ownership through the parent todo list.

Success response: `200 OK`

```json
{
  "id": 1,
  "statement": "Run production build",
  "priority": 1,
  "checked": false,
  "todo_list": 1
}
```

### Update Task

```http
PATCH /todolists/tasks/<task_id>/
```

Requires authentication and ownership through the parent todo list.

Request body:

```json
{
  "statement": "Run production build",
  "priority": 1,
  "checked": true
}
```

Success response: `200 OK`

```json
{
  "id": 1,
  "statement": "Run production build",
  "priority": 1,
  "checked": true,
  "todo_list": 1
}
```

### Delete Task

```http
DELETE /todolists/tasks/<task_id>/
```

Requires authentication and ownership through the parent todo list.

Success response: `204 No Content`

### Mark Tasks Done

```http
PATCH /todolists/tasks/done
```

Requires authentication. Marks multiple tasks as checked for a specific list.

Request body:

```json
[
  {
    "id": 1,
    "statement": "Run production build",
    "priority": 1,
    "checked": true,
    "todo_list": 1
  }
]
```

Implementation note: the backend route is registered without a trailing slash and the view expects a `list_id` argument, so this endpoint may require backend adjustment before use.

## Status Code Summary

| Status | Meaning |
| --- | --- |
| `200 OK` | Request succeeded |
| `201 Created` | Resource created |
| `204 No Content` | Resource deleted or completed with no body |
| `400 Bad Request` | Invalid or missing data |
| `401 Unauthorized` | Authentication missing or expired |
| `403 Forbidden` | Authenticated user does not own the resource |
| `404 Not Found` | Resource not found |

## Frontend Integration Notes

- The frontend stores the access token in memory.
- The refresh token is never read by JavaScript because it is stored in an HttpOnly cookie.
- The frontend calls `/user/auth/token/refresh/` on app startup to restore sessions.
- Protected dashboard pages redirect to login only when refresh fails.
- Logout clears both the backend refresh cookie and the frontend auth state.
- The frontend handles empty notes and empty list responses as normal empty states.
