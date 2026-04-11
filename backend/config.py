"""Configuration settings for KrishiAI backend."""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings from environment variables."""
    
    # Database
    mongo_url: str = "mongodb://localhost:27017"
    db_name: str = "krishiai"
    
    # API
    api_title: str = "KrishiAI API"
    api_version: str = "1.0.0"
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # LLM
    emergent_llm_key: str = ""  # Set via environment variable
    llm_model: str = "gpt-4o"
    
    # Environment
    environment: str = "development"
    debug: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
