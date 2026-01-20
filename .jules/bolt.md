# Bolt's Journal

## 2024-05-22 - [First Run]
**Learning:** Initialized Bolt's journal.
**Action:** Always check this file for past learnings before starting.

## 2024-05-22 - [Database Indexing]
**Learning:** SQLAlchemy's `ForeignKey` does not automatically create an index on the foreign key column. This is a common performance pitfall that leads to N+1 query issues and slow joins.
**Action:** Always explicitly set `index=True` on `ForeignKey` columns unless they are already covered by a unique constraint or composite index. Note that `metadata` attribute in models conflicts with SQLAlchemy 2.0+ internal API, causing issues with verification scripts.
