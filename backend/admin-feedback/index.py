import json
import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p96327491_property_rental_serv")

def handler(event: dict, context) -> dict:
    """Возвращает список всех заявок из формы обратной связи."""
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    method = event.get("httpMethod", "GET")

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    if method == "DELETE":
        params = event.get("queryStringParameters") or {}
        feedback_id = params.get("id")
        if not feedback_id:
            cur.close()
            conn.close()
            return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "id обязателен"})}
        cur.execute(f"DELETE FROM {SCHEMA}.feedback WHERE id = %s", (feedback_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": cors_headers, "body": json.dumps({"ok": True})}

    cur.execute(
        f"SELECT id, name, email, message, created_at FROM {SCHEMA}.feedback ORDER BY created_at DESC"
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    items = [
        {
            "id": r[0],
            "name": r[1],
            "email": r[2],
            "message": r[3],
            "created_at": r[4].isoformat() if r[4] else None,
        }
        for r in rows
    ]

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"items": items, "total": len(items)}, ensure_ascii=False),
    }
