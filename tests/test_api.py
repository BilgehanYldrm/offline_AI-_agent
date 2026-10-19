import pytest
from fastapi.testclient import TestClient
from backend.app import create_app


@pytest.fixture
def client(monkeypatch):
    monkeypatch.delenv('SEMANTIC_MODEL_PATH', raising=False)
    with TestClient(create_app()) as client:
        yield client


def test_health_is_truthful(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['mode'] == 'keyword'
    assert response.json()['documents'] > 0


@pytest.mark.parametrize('path', ['/soru-sor', '/ask', '/chat', '/api/chat'])
def test_compatible_routes(client, path):
    response = client.post(path, json={'soru': 'deprem'})
    assert response.status_code == 200
    data = response.json()
    assert data['cevap'] == data['response'] == data['message']
    assert data['method'] == 'keyword'
    assert data['source']


@pytest.mark.parametrize('payload', [{}, {'soru': ''}, {'soru': '   '}, {'soru': 'a' * 1001}, {'soru': 3}, {'soru': 'a', 'extra': 1}])
def test_invalid_input(client, payload):
    assert client.post('/soru-sor', json=payload).status_code == 422


def test_unknown_question_is_not_a_random_answer(client):
    assert client.post('/soru-sor', json={'soru': 'xyz123'}).json()['method'] == 'no_match'


def test_cors_allows_only_configured_origin(client):
    def preflight(origin):
        return client.options('/soru-sor', headers={'Origin': origin, 'Access-Control-Request-Method': 'POST'})
    assert preflight('http://localhost:3000').headers['access-control-allow-origin'] == 'http://localhost:3000'
    assert 'access-control-allow-origin' not in preflight('https://untrusted.example').headers
