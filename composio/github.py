from composio_openai import ComposioToolSet, App, Action
from openai import OpenAI
from dotenv import load_dotenv
import os
from password import api_key

load_dotenv()

# Check if OpenAI API key is available in environment
openai_client = OpenAI(api_key=api_key)
composio_toolset = ComposioToolSet(api_key=os.getenv("COMPOSIO_API_KEY"))  # Replace with your API key

tools = composio_toolset.get_tools(actions=[Action.GITHUB_STAR_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER])

task = "Star a repo composiohq/composio on GitHub"

response = openai_client.chat.completions.create(
    model="gpt-4o",
    tools=tools,
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": task},
    ],
)

result = composio_toolset.handle_tool_calls(response)
print(result)
