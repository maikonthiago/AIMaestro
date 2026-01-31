## Bolt Journal

This journal tracks critical performance learnings for the AI-Maestro project.

## 2024-05-23 - [SQLAlchemy Attribute Conflict & Index Optimization]
**Learning:** SQLAlchemy 2.0+ (and modern 1.4+) reserves `metadata` attribute on declarative models for schema metadata. Using `metadata = Column(...)` causes `InvalidRequestError` on startup. This blocked benchmarking and likely breaks the app if dependencies are updated.
**Action:** Rename `metadata` attribute to `meta` (or similar) while mapping to `metadata` SQL column using `Column("metadata", ...)` to preserve schema compatibility. Update all usages. Also, foreign keys in SQLAlchemy (like `Message.conversation_id`) do NOT automatically get indexes, leading to full table scans on filtering. Always add `index=True` to foreign keys used in frequent `filter()` clauses.
