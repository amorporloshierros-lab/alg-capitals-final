import asyncio
import os
from telethon import TelegramClient

API_ID   = 34122599
API_HASH = "7708eb2f486f6be3d884df12d82a9c71"
GRUPO    = -1003302514005
CARPETA  = "telegram_descargas"

async def descargar():
    os.makedirs(CARPETA, exist_ok=True)
    async with TelegramClient("sesion", API_ID, API_HASH) as client:
        print("Conectado.")
        entity = await client.get_entity(GRUPO)
        print(f"Grupo: {entity.title}")
        descargados = 0
        async for msg in client.iter_messages(entity):
            if msg.photo or (msg.document and
               "image" in (msg.document.mime_type or "")):
                nombre = f"{CARPETA}/{msg.id}.jpg"
                if not os.path.exists(nombre):
                    await msg.download_media(file=nombre)
                    descargados += 1
                    print(f"  {descargados} - {nombre}")
        print(f"\nListo. {descargados} imagenes descargadas.")
        print(f"Carpeta: {os.path.abspath(CARPETA)}")

asyncio.run(descargar())