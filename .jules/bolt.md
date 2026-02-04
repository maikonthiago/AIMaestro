
## 2024-05-22 - [SQLAlchemy 2.0 Compatibility & Indexes]
**Learning:** SQLAlchemy 2.0+ reserves `metadata` attribute on declarative models. Using `metadata = Column(...)` causes a crash at startup. Also, SQLAlchemy does not auto-index ForeignKeys, leading to potential performance issues on join/filter.
**Action:** When defining models with a JSON metadata column, map it to a `meta` attribute: `meta = Column("metadata", JSON, ...)`. Always check for explicit `index=True` on ForeignKeys.
