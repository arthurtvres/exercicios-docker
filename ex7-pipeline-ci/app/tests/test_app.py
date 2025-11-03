"""Testes para a aplicação"""
import pytest
from app import app, add_numbers, multiply_numbers

@pytest.fixture
def client():
    """Cliente de teste Flask"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_home_endpoint(client):
    """Testa endpoint principal"""
    response = client.get('/')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'
    assert 'message' in data

def test_health_endpoint(client):
    """Testa endpoint de health"""
    response = client.get('/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'ok'

def test_add_numbers():
    """Testa função de adição"""
    assert add_numbers(2, 3) == 5
    assert add_numbers(-1, 1) == 0
    assert add_numbers(0, 0) == 0

def test_multiply_numbers():
    """Testa função de multiplicação"""
    assert multiply_numbers(2, 3) == 6
    assert multiply_numbers(-2, 3) == -6
    assert multiply_numbers(0, 100) == 0

def test_add_numbers_types():
    """Testa tipos da função de adição"""
    assert isinstance(add_numbers(1, 2), int)
    assert isinstance(add_numbers(1.5, 2.5), float)

def test_multiply_floats():
    """Testa multiplicação com floats"""
    result = multiply_numbers(2.5, 4)
    assert result == 10.0
