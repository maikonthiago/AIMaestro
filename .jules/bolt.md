## 2024-05-22 - [SQLAlchemy 2.0 Conflict & Missing Indexes]
**Learning:** SQLAlchemy foreign keys do not create indexes automatically, which can lead to performance issues on hot paths like fetching messages by conversation.
**Critical Issue:** The codebase uses `metadata` as a column name on models inheriting from `Base`. This conflicts with SQLAlchemy 2.0+ reserved `metadata` attribute, causing the application to crash on import. A migration to rename this column/attribute is required but was out of scope for this performance task.
**Action:** Always explicitly add `index=True` to Foreign Keys that are frequently queried. When upgrading dependencies, verify reserved keyword conflicts.
