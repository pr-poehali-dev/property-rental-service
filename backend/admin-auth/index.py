import json
import os
import secrets

def handler(event: dict, context) -> dict:
    """Проверяет логин и пароль администратора, возвращает токен сессии."""
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    login = (body.get("login") or "").strip()
    password = (body.get("password") or "").strip()

    correct_login = os.environ.get("ADMIN_LOGIN", "")
    correct_password = os.environ.get("ADMIN_PASSWORD", "")

    if not secrets.compare_digest(login, correct_login) or not secrets.compare_digest(password, correct_password):
        return {
            "statusCode": 401,
            "headers": cors_headers,
            "body": json.dumps({"error": "Неверный логин или пароль"}),
        }

    token = f"admin-{secrets.token_hex(24)}"

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"ok": True, "token": token}),
    }
