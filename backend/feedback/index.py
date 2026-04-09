import json
import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p96327491_property_rental_serv")

def handler(event: dict, context) -> dict:
    """Сохраняет сообщение из формы обратной связи в базу данных."""
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = (body.get("name") or "").strip()
    email = (body.get("email") or "").strip()
    message = (body.get("message") or "").strip()

    if not name or not email or not message:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Все поля обязательны"}),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {SCHEMA}.feedback (name, email, message) VALUES (%s, %s, %s) RETURNING id",
        (name, email, message),
    )
    row = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"ok": True, "id": row[0]}),
    }
