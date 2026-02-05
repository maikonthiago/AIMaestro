import sys
import os
import sqlalchemy
from sqlalchemy import inspect

# Add backend directory to path
# Script is in backend/scripts/check_indexes.py
# We want to add backend/ to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

print(f"Added {backend_dir} to sys.path")

try:
    from app.database import Base, engine
    from app import models  # Ensure models are registered
except ImportError as e:
    print(f"Error importing app modules: {e}")
    sys.exit(1)

def verify_indexes():
    print(f"Creating tables using engine: {engine}")
    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)

    # Check Message.conversation_id
    print("\nChecking 'messages' table...")
    try:
        messages_indexes = inspector.get_indexes("messages")
        print("\nIndexes on 'messages':")
        found_msg_idx = False
        for idx in messages_indexes:
            print(f"  - {idx['name']}: {idx['column_names']}")
            if 'conversation_id' in idx['column_names']:
                found_msg_idx = True

        if found_msg_idx:
            print("✅ Index on Message.conversation_id FOUND.")
        else:
            print("❌ Index on Message.conversation_id MISSING.")
    except Exception as e:
         print(f"Error checking messages: {e}")

    # Check Conversation.agent_id
    print("\nChecking 'conversations' table...")
    try:
        conversations_indexes = inspector.get_indexes("conversations")
        print("\nIndexes on 'conversations':")
        found_conv_idx = False
        for idx in conversations_indexes:
            print(f"  - {idx['name']}: {idx['column_names']}")
            if 'agent_id' in idx['column_names']:
                found_conv_idx = True

        if found_conv_idx:
            print("✅ Index on Conversation.agent_id FOUND.")
        else:
            print("❌ Index on Conversation.agent_id MISSING.")
    except Exception as e:
        print(f"Error checking conversations: {e}")

if __name__ == "__main__":
    verify_indexes()
