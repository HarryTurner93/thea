# Third Party
import boto3
import botocore.client
import classutilities


class BaseConfig(classutilities.ConfigClassMixin):
    """Base class for app configuration."""

    # S3 Configuration
    AWS_ENDPOINT_URL: str
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_ENDPOINT_URL: str
    AWS_REGION: str
    AWS_BUCKET_NAME: str

    # Redis
    REDIS_HOSTNAME: str
    REDIS_PASSWORD: str
    REDIS_PORT: int
    REDIS_DB_NUMBER: int

    @classutilities.classproperty
    def S3_CLIENT(cls) -> botocore.client.BaseClient:
        """Create S3 client (connector)."""
        return boto3.client(
            service_name="s3",
            aws_access_key_id=cls.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=cls.AWS_SECRET_ACCESS_KEY,
            endpoint_url=cls.AWS_ENDPOINT_URL,
            region_name=cls.AWS_REGION,
        )

    @classutilities.classproperty
    def CELERY_URL(cls) -> str:
        """Generate Celery connection URL."""
        return (
            f"redis://:{cls.REDIS_PASSWORD}@{cls.REDIS_HOSTNAME}:"
            f"{cls.REDIS_PORT}/{cls.REDIS_DB_NUMBER}"
        )
