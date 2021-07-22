import os

from .base_config import BaseConfig
from .local import LocalConfig

environment = os.getenv('ENVIRONMENT', "LOCAL")

# Default global variable with application configuration.
CONFIG: type[BaseConfig] = LocalConfig