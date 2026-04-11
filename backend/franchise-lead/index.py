import json
import os
import boto3
import uuid
from datetime import datetime

S3_ENDPOINT = "https://bucket.poehali.dev"
BUCKET = "files"
PREFIX = "franchise-leads/"

def get_s3():
    return boto3.client(
        "s3",
        endpoint_url=S3_ENDPOINT,
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )

def handler(event: dict, context) -> dict:
    """Принимает заявки из квиза франшизы и хранит их в S3."""
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    method = event.get("httpMethod", "GET")
    s3 = get_s3()

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        phone = (body.get("phone") or "").strip()
        if not phone:
            return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "Телефон обязателен"})}

        lead = {
            "id": str(uuid.uuid4()),
            "city": body.get("city", ""),
            "income_goal": body.get("income_goal", ""),
            "phone": phone,
            "telegram": body.get("telegram", ""),
            "created_at": datetime.utcnow().isoformat(),
        }
        key = f"{PREFIX}{lead['id']}.json"
        s3.put_object(Bucket=BUCKET, Key=key, Body=json.dumps(lead, ensure_ascii=False), ContentType="application/json")
        return {"statusCode": 200, "headers": cors_headers, "body": json.dumps({"ok": True, "id": lead["id"]})}

    if method == "GET":
        try:
            resp = s3.list_objects_v2(Bucket=BUCKET, Prefix=PREFIX)
            items = []
            for obj in (resp.get("Contents") or []):
                data = s3.get_object(Bucket=BUCKET, Key=obj["Key"])
                items.append(json.loads(data["Body"].read()))
            items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        except Exception:
            items = []
        return {"statusCode": 200, "headers": cors_headers, "body": json.dumps({"items": items})}

    if method == "DELETE":
        params = event.get("queryStringParameters") or {}
        lead_id = params.get("id", "")
        if lead_id:
            key = f"{PREFIX}{lead_id}.json"
            s3.delete_object(Bucket=BUCKET, Key=key)
        return {"statusCode": 200, "headers": cors_headers, "body": json.dumps({"ok": True})}

    return {"statusCode": 405, "headers": cors_headers, "body": json.dumps({"error": "Method not allowed"})}
