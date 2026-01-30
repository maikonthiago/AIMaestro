## 2024-05-22 - SQLAlchemy 2.0 Metadata Conflict
**Learning:** SQLAlchemy 2.0+ declarative models reserve the `metadata` attribute. Using `metadata = Column(...)` causes an `AttributeError` or `InvalidRequestError` during mapper initialization.
**Action:** Always rename columns named "metadata" to something else in the Python model (e.g., `meta` or `metadata_field`) while keeping the database column name as "metadata" if needed (e.g., `meta = Column("metadata", JSON, ...)`).
