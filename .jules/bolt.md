# Bolt's Journal

## 2024-05-22 - Missing Database Indexes
**Learning:** The database schema is generated via `Base.metadata.create_all`, but several critical Foreign Keys (like `Message.conversation_id`) were missing explicit indexes. In SQLAlchemy, FKs do not automatically create indexes (except on some backends or if configured).
**Action:** Always verify generated schema for missing indexes on foreign keys, especially for high-volume tables like Messages.
