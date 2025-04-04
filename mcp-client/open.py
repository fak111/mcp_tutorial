import os
import requests
import json
from dotenv import load_dotenv
load_dotenv()  # load environment variables from .env
# Get the API key from environment variable
api_key = os.getenv("OPENROUTER_API_KEY")
if not api_key:
    raise ValueError("Please set the OPENROUTER_API_KEY environment variable")

# Make a direct API call to OpenRouter
response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "http://localhost",  # Optional. Site URL for rankings
        "X-Title": "Claude API Test",  # Optional. Site title for rankings
        "Content-Type": "application/json"
    },
    data=json.dumps({
        "model": "anthropic/claude-3.7-sonnet",  # Specify the Claude model you want to use
        "messages": [
            {
                "role": "user",
                "content": "are you claude 3.7 sonnet?"
            }
        ]
    })
)

# Check if the request was successful
if response.status_code == 200:
    result = response.json()
    print(result["choices"][0]["message"]["content"])
else:
    print(f"Error: {response.status_code}")
    print(response.text)
