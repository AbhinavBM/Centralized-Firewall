import pymongo
from config import Config
from utils.logger import get_logger

logger = get_logger()

class MongoDBService:
    """
    Service for interacting with MongoDB directly.
    This allows the endpoint client to access the same database as the backend.
    """
    def __init__(self):
        self.uri = Config.MONGODB_URI
        self.client = None
        self.db = None
        self.connected = False

    def connect(self):
        """
        Connect to MongoDB.
        """
        try:
            # Mask the password in the connection string for logging
            masked_uri = self.uri.replace(self.uri.split('@')[0].split(':')[2], '****')
            logger.info(f"Connecting to MongoDB at: {masked_uri}")

            # Connect with a timeout and retry logic
            self.client = pymongo.MongoClient(
                self.uri,
                serverSelectionTimeoutMS=5000,  # 5 second timeout for server selection
                connectTimeoutMS=5000,          # 5 second timeout for initial connection
                socketTimeoutMS=30000,          # 30 second timeout for operations
                maxPoolSize=10,                 # Maximum connection pool size
                retryWrites=True,               # Retry write operations
                w='majority'                    # Write concern
            )

            # Ping the server to check connection
            self.client.admin.command('ping')

            # Get the database (last part of the connection string after the last slash)
            db_name = self.uri.split('/')[-1].split('?')[0] or 'centralized-firewall'
            if not db_name or db_name == '':
                db_name = 'centralized-firewall'
            self.db = self.client[db_name]

            logger.info(f"Connected to MongoDB database: {db_name}")
            self.connected = True
            return True

        except pymongo.errors.ServerSelectionTimeoutError as e:
            logger.error(f"MongoDB server selection timeout: {str(e)}")
            self.connected = False
            return False
        except pymongo.errors.ConnectionFailure as e:
            logger.error(f"MongoDB connection failure: {str(e)}")
            self.connected = False
            return False
        except Exception as e:
            logger.error(f"Error connecting to MongoDB: {str(e)}")
            self.connected = False
            return False

    def disconnect(self):
        """
        Disconnect from MongoDB.
        """
        if self.client:
            self.client.close()
            logger.info("Disconnected from MongoDB")
            self.connected = False

    def get_collection(self, collection_name):
        """
        Get a MongoDB collection.
        """
        if not self.connected:
            if not self.connect():
                logger.error(f"Cannot get collection {collection_name}: Not connected to MongoDB")
                return None

        return self.db[collection_name]

    def find_documents(self, collection_name, query=None, projection=None, limit=0):
        """
        Find documents in a collection.
        """
        collection = self.get_collection(collection_name)
        if not collection:
            return []

        try:
            return list(collection.find(query or {}, projection, limit=limit))
        except Exception as e:
            logger.error(f"Error finding documents in {collection_name}: {str(e)}")
            return []

    def find_one_document(self, collection_name, query, projection=None):
        """
        Find a single document in a collection.
        """
        collection = self.get_collection(collection_name)
        if not collection:
            return None

        try:
            return collection.find_one(query, projection)
        except Exception as e:
            logger.error(f"Error finding document in {collection_name}: {str(e)}")
            return None

    def insert_document(self, collection_name, document):
        """
        Insert a document into a collection.
        """
        collection = self.get_collection(collection_name)
        if not collection:
            return None

        try:
            result = collection.insert_one(document)
            logger.info(f"Inserted document into {collection_name} with ID: {result.inserted_id}")
            return result.inserted_id
        except Exception as e:
            logger.error(f"Error inserting document into {collection_name}: {str(e)}")
            return None

    def update_document(self, collection_name, query, update):
        """
        Update a document in a collection.
        """
        collection = self.get_collection(collection_name)
        if not collection:
            return False

        try:
            result = collection.update_one(query, update)
            logger.info(f"Updated {result.modified_count} document(s) in {collection_name}")
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Error updating document in {collection_name}: {str(e)}")
            return False

    def delete_document(self, collection_name, query):
        """
        Delete a document from a collection.
        """
        collection = self.get_collection(collection_name)
        if not collection:
            return False

        try:
            result = collection.delete_one(query)
            logger.info(f"Deleted {result.deleted_count} document(s) from {collection_name}")
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Error deleting document from {collection_name}: {str(e)}")
            return False

# Create a singleton instance
mongodb_service = MongoDBService()
