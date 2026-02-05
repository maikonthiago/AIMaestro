## 2025-02-05 - SQLAlchemy 2.0 Metadata Conflict
**Learning:** SQLAlchemy 2.0+ reserves `metadata` attribute on declarative models for internal use (MetaData object). Using `metadata = Column(...)` causes `InvalidRequestError`.
**Action:** Rename the python attribute to `meta` (or similar) while keeping the column name if needed: `meta = Column("metadata", JSON, ...)`. Update all code references from `.metadata` to `.meta`.
