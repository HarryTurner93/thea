from .base_config import BaseConfig

class LocalConfig(BaseConfig):
    """Configuration for local stack."""

    AWS_BUCKET_NAME: str = "images"
    AWS_ENDPOINT_URL: str = 'http://localstack:4566/'
    AWS_SECRET_ACCESS_KEY: str = "xyz"
    AWS_ACCESS_KEY_ID: str = "123"
    AWS_REGION: str = "us-east-1"

