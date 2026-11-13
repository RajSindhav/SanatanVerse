# SanatanVerse Security Specification (Firestore Rules TDD)

## 1. Data Invariants
1. **Default-Deny Catch-All**: Unmatched paths deny all reads and writes (`allow read, write: if false`).
2. **Admin-Only Topics**: Only verified administrators (`request.auth.token.email == 'rajsindhav77@gmail.com'` with `email_verified == true`, or existence in `/admins/{uid}`) may create, update, or delete `/topics/{topicId}`.
3. **Creator Ownership & Validation on Media**: `/topicMedia/{mediaId}` allows verified signed-in users (`request.auth.uid == incoming().createdBy`) or admins to attach multiple comics and media items to topics. Creators can only update/delete their own items unless they are admin.
4. **Immutable Ownership & Timestamps**: `createdBy` and `createdAt` cannot be modified on update; `createdAt == request.time` on create; `updatedAt == request.time` on create and update.
5. **PII Isolation**: No personal email addresses, phone numbers, or addresses are stored in publicly readable `/topics` or `/topicMedia`. `/admins/{userId}` can only be `get`-read by the matching `request.auth.uid` and never `list`-queried.
6. **Bounded Strings & Lists**: Every string enforces `.size()` limits, every ID validates `^[a-zA-Z0-9_-]+$` (`<= 128`), and every array enforces bounded `.size()` (`<= 10`).

## 2. Dirty Dozen Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated topic creation**: `POST /topics/t1` with `auth: null` -> DENIED.
2. **Non-admin topic creation**: `POST /topics/t1` with `auth: { uid: 'user1', email: 'other@example.com', email_verified: true }` -> DENIED.
3. **Unverified admin email spoofing**: `POST /topics/t1` with `auth: { uid: 'spoof', email: 'rajsindhav77@gmail.com', email_verified: false }` -> DENIED.
4. **Self-assigned admin escalation**: `POST /admins/user1` with `{ role: 'admin' }` -> DENIED.
5. **Admin list scraping**: `LIST /admins` -> DENIED.
6. **Shadow field injection on topicMedia**: `POST /topicMedia/m1` including extra field `isOfficial: true` -> DENIED (`hasOnly` check).
7. **Spoofed creator UID on topicMedia**: `POST /topicMedia/m1` where `createdBy: 'other-uid'` -> DENIED.
8. **Oversized ID poisoning**: `POST /topicMedia/<200-char-invalid-id>` -> DENIED (`isValidId`).
9. **Client-forged timestamp**: `POST /topicMedia/m1` with `createdAt` set to past client timestamp != `request.time` -> DENIED.
10. **Non-owner media deletion**: `DELETE /topicMedia/m1` by `uid: 'user2'` when `createdBy == 'user1'` -> DENIED.
11. **Mutating `createdBy` on update**: `UPDATE /topicMedia/m1` attempting to change `createdBy` -> DENIED.
12. **Oversized array DoW payload**: `POST /topicMedia/m1` with 25 `comicPanels` (> 12 limit) -> DENIED.
