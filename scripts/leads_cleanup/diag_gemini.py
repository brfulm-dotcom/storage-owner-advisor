"""
Diagnostic: try a trivial Gemini call against several model names to find which
one your API key actually has access to.

Run:
    python scripts/leads_cleanup/diag_gemini.py
"""

import os
import sys
from pathlib import Path

import httpx

ENV_PATH = Path(
    r"C:\Projects\StorageOwnerAdvisor-project\storage-owner-advisor\.env.local"
)

MODELS_TO_TRY = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-8b",
]

API_VERSIONS = ["v1beta", "v1"]


def load_env():
    if not ENV_PATH.exists():
        print(f"ERROR: {ENV_PATH} not found")
        sys.exit(1)
    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def try_model(client, key, version, model):
    url = f"https://generativelanguage.googleapis.com/{version}/models/{model}:generateContent"
    body = {"contents": [{"parts": [{"text": "Say 'ok' as plain text."}]}]}
    try:
        r = client.post(
            url,
            headers={"Content-Type": "application/json", "x-goog-api-key": key},
            json=body,
            timeout=30,
        )
    except Exception as e:
        return f"EXCEPTION {type(e).__name__}: {e}"
    status = r.status_code
    if status == 200:
        try:
            text = r.json()["candidates"][0]["content"]["parts"][0]["text"]
            return f"OK   -> {text.strip()[:60]}"
        except Exception:
            return f"OK (200 but weird body: {r.text[:120]})"
    return f"HTTP {status}: {r.text[:300]}"


def list_models(client, key, version):
    url = f"https://generativelanguage.googleapis.com/{version}/models"
    try:
        r = client.get(
            url,
            headers={"x-goog-api-key": key},
            timeout=30,
        )
    except Exception as e:
        return f"EXCEPTION: {e}"
    if r.status_code != 200:
        return f"HTTP {r.status_code}: {r.text[:300]}"
    try:
        models = r.json().get("models", [])
        names = [m.get("name", "") for m in models if "generateContent" in m.get("supportedGenerationMethods", [])]
        return names
    except Exception as e:
        return f"parse: {e}"


def main():
    load_env()
    key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not key:
        print("ERROR: GEMINI_API_KEY not in .env.local")
        return 1
    print(f"Key detected (first 6 chars): {key[:6]}...  length={len(key)}")
    print()

    with httpx.Client() as client:
        for version in API_VERSIONS:
            print(f"=== API version {version} ===")
            print(f"  listModels:")
            listing = list_models(client, key, version)
            if isinstance(listing, list):
                print(f"    {len(listing)} models available that support generateContent:")
                for n in listing[:15]:
                    print(f"      - {n}")
                if len(listing) > 15:
                    print(f"      (+{len(listing)-15} more)")
            else:
                print(f"    {listing}")
            print()

            for model in MODELS_TO_TRY:
                result = try_model(client, key, version, model)
                print(f"  {version}/{model:28s}  {result}")
            print()

    return 0


if __name__ == "__main__":
    sys.exit(main())
