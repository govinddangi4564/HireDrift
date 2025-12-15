import requests

url = "http://127.0.0.1:8000/api/companies/register"
headers = {
    "Origin": "http://localhost:5173",
    "Content-Type": "application/json"
}
data = {
    "name": "Test Company",
    "email": "test@company.com",
    "password": "password123",
    "website": "http://test.com",
    "location": "Test Location",
    "description": "Test Description",
    "plan": "Pro Plan"
}

try:
    response = requests.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print("Headers:")
    for k, v in response.headers.items():
        print(f"{k}: {v}")
    print("\nBody:")
    print(response.text)
except requests.exceptions.ConnectionError:
    print("Connection refused. The server might be down.")
except Exception as e:
    print(f"An error occurred: {e}")
