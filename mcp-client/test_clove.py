import anthropic

client = anthropic.Anthropic(
    base_url="http://localhost:5201",
    api_key="sk-2a9vaDu2Ed6ebxDxetkTdXtdUdPGUANW5PQyngpx3EyaWbb8",  # 在管理界面创建
)

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    messages=[
        {
            "role": "user",
            "content": "Hello, Claude!你是什么模型？知识库截止日期是？什么时候发布的",
        }
    ],
    max_tokens=1024,
)
print(response.content[0].text)
