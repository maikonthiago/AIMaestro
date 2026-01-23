## 2024-05-23 - SQLAlchemy 2.0 Metadata Conflict
**Learning:** SQLAlchemy 2.0+ reserves the 'metadata' attribute on Declarative models. Columns named 'metadata' must be mapped to a different attribute name (e.g. 'meta') to avoid RecursionError or InvalidRequestError during mapper configuration.
**Action:** Always rename 'metadata' columns to 'meta' or similar when defining SQLAlchemy models, mapping them to the underlying "metadata" column name if necessary.
