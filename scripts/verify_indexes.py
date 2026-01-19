import sys
import os
from sqlalchemy import inspect

# Add backend to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

# Set env var for in-memory DB so we don't touch any real file
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

try:
    from app.database import engine, Base
    from app.models import Message, Agent, Tenant
except ImportError as e:
    print(f"Error importing app modules: {e}")
    sys.exit(1)

def verify_indexes():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)

    success = True

    # Check Message.conversation_id
    print("Checking 'messages' indexes...")
    indexes = inspector.get_indexes("messages")
    found_conv_idx = any(
        idx['column_names'] == ['conversation_id']
        for idx in indexes
    )
    if found_conv_idx:
        print("✅ Index on messages.conversation_id found.")
    else:
        print("❌ Index on messages.conversation_id NOT found.")
        print(f"Found indexes: {indexes}")
        success = False

    # Check Agent.owner_id
    print("Checking 'agents' indexes...")
    indexes = inspector.get_indexes("agents")
    found_agent_owner = any(
        idx['column_names'] == ['owner_id']
        for idx in indexes
    )
    if found_agent_owner:
        print("✅ Index on agents.owner_id found.")
    else:
        print("❌ Index on agents.owner_id NOT found.")
        success = False

    # Check Agent.tenant_id
    found_agent_tenant = any(
        idx['column_names'] == ['tenant_id']
        for idx in indexes
    )
    if found_agent_tenant:
        print("✅ Index on agents.tenant_id found.")
    else:
        print("❌ Index on agents.tenant_id NOT found.")
        success = False

    # Check Tenant.owner_id
    print("Checking 'tenants' indexes...")
    indexes = inspector.get_indexes("tenants")
    found_tenant_owner = any(
        idx['column_names'] == ['owner_id']
        for idx in indexes
    )
    if found_tenant_owner:
        print("✅ Index on tenants.owner_id found.")
    else:
        print("❌ Index on tenants.owner_id NOT found.")
        success = False

    return success

if __name__ == "__main__":
    if verify_indexes():
        print("All indexes verified successfully!")
        sys.exit(0)
    else:
        print("Index verification failed.")
        sys.exit(1)
