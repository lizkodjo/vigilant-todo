# 🛡️ Vigilant Todo - Secure Task Management API

A full-stack, secure task management API built with Python, FastAPI and modern DevSecOps practices. This project showcases SDET and Python development skills with a focus on security, testing and automation.

## 🚀 Features

- **RESTful API** with FastAPI
- **JWT Authentication** with secure password hashing
- **Containerized** with Docker
- **DevSecOps Pipeline** with GitHub Actions
- **Security Scanning** (SAST & SCA)
- **Comprehensive Testing** with high coverage
- **Automated Deployment**

## ⚒️ Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Security**: Bandit (SAST), Safety (SCA)
- **Testing**: Pytest, Coverage
- **Deployment**: Heroku/AWS

## 📁 Project Structure

```bash
vigilant-todo/
├── app/
│ ├── api/ # API routes and endpoints
│ ├── core/ # Configuration, security, database
│ ├── models/ # SQLAlchemy models
│ ├── schemas/ # Pydantic schemas
│ ├── services/ # Business logic
│ └── tests/ # Test suite
├── .github/workflows/ # CI/CD pipelines
└── docs/ # Documentation
```

## 🏃‍♂️ Quick Start

### Local Development

```bash
# Clone repository
git clone <https://github.com/lizkodjo/vigilant-todo.git>
cd vigilant-todo

# Set up virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run application
uvicorn app.main:app --reload
```

### With Docker

```bash
docker build -t vigilant-todo .
docker run -p 8000:8000 vigilant-todo
```

## 🔒 DevSecOps Pipeline

This project features a comprehensive CI/CD pipeline:

- **Security Scanning**: Bandit (SAST) and Safety (SCA) on every commit
- **Automated Testing**: Unit, Integration and API tests with coverage reporting
- **Container Build**: Automated Docker image building
- **Quality Gates**: Security and test coverage requirements

## 📊 API Documentation

Once running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🧪 Testing

```bash
# Run tests with coverage
pytest --cov=app --cov-report=html

# Run security scans
bandit -r app/
safety check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Ensure CI pipeline passes
6. Submit a pull request

## 📄 License

MIT License - see [LICENSE](https://github.com/lizkodjo/vigilant-todo/blob/main/LICENSE) for details
