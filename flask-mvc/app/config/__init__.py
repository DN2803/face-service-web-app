import os, glob

__all__ = [os.path.basename(f)[:-3] for f in glob.glob(os.path.dirname(__file__) + "/*.py")]

from dotenv import load_dotenv

ENV = os.getenv('ENV', 'local')
if ENV == 'production':
    load_dotenv('.env.production')
elif ENV == 'local':
    load_dotenv('.env.dev.local')