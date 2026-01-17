## 2024-05-23 - [SQLAlchemy 2.0 Namespace Conflict]
**Learning:** SQLAlchemy 2.0+ reserves the `metadata` attribute on declarative models for its internal MetaData object. Attempting to use `metadata` as a column name attribute causes an `InvalidRequestError` at import time.
**Action:** When defining models with a `metadata` column in SQLAlchemy 2.0+, use a different attribute name (e.g., `meta`) mapped to the column name: `meta = Column("metadata", JSON, ...)`.
