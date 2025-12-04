# FastAPI Integration Guide

## Overview
Aplikasi React Chemic AI telah terintegrasi dengan FastAPI backend yang tersedia di `https://backend-chem.vercel.app`

## Konfigurasi

### Environment Variables
Buat file `.env` di root project dengan konfigurasi berikut:

```
VITE_API_BASE_URL=https://backend-chem.vercel.app
```

Atau untuk development lokal:
```
VITE_API_BASE_URL=http://localhost:8000
```

## API Endpoints yang Digunakan

### 1. Authentication

#### Login
- **Endpoint**: `POST /api/auth/token`
- **Request Body**:
  ```json
  {
    "username": "email@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGc...",
    "token_type": "bearer"
  }
  ```

#### Register
- **Endpoint**: `POST /api/users/`
- **Request Body**:
  ```json
  {
    "username": "username",
    "email": "email@example.com",
    "password": "password123"
  }
  ```
- **Response**: User data dengan ID

### 2. Chemistry - Generate Molecules

#### Generate
- **Endpoint**: `POST /api/chem/generate`
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "smi_string": "[H][C@@]1|2Cc3c[nH]c4cccc(C1=C[C@H](NC(=O)N(CC)CC)CN2C)c34",
    "num_molecules": 30,
    "algorithm": "CMA-ES Controlled Generation",
    "property_to_optimize": "QED",
    "min_similarity": 0.9,
    "particles": 30,
    "iterations": 10,
    "minimize": false
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "user_id": 1,
    "smi_string": "...",
    "num_molecules": 30,
    "algorithm": "CMA-ES Controlled Generation",
    "property_to_optimize": "QED",
    "min_similarity": 0.9,
    "particles": 30,
    "iterations": 10,
    "minimize": false,
    "result": {
      "status": "success",
      "meta": {
        "original_smiles": "...",
        "optimized_property": "QED",
        "algorithm": "CMA-ES Controlled Generation"
      },
      "generated_molecules": [
        {
          "sample": "CC(=O)Oc1ccccc1C(=O)O",
          "score": 0.85
        }
      ],
      "analysis_result": "Analysis text here..."
    },
    "created_at": "2024-01-01T12:00:00"
  }
  ```

#### Get History
- **Endpoint**: `GET /api/chem/history`
- **Query Parameters**:
  - `skip`: (default: 0)
  - `limit`: (default: 50)
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  ```
- **Response**: Array of GenerationResponse objects

#### Get History Detail
- **Endpoint**: `GET /api/chem/history/{generation_id}`
- **Headers**:
  ```
  Authorization: Bearer {access_token}
  ```
- **Response**: Single GenerationResponse object

## Implementasi di Frontend

### Flow Login/Register
1. User memasukkan credentials di form
2. Form di-submit ke `/api/auth/token` atau `/api/users/`
3. Token disimpan di state React `authToken`
4. User diarahkan ke dashboard

### Flow Generate Molecules
1. User mengisi form dengan parameter SMILES dan optimization settings
2. Klik tombol "Run"
3. Form data di-convert ke format API payload
4. POST request ke `/api/chem/generate` dengan Bearer token
5. Response ditampilkan di OutputSection dengan:
   - Summary informasi generasi
   - Grid molecules dengan score dan similarity
   - Analysis text dari API

### Flow Logout
1. User klik tombol "Logout"
2. State `authToken` di-clear
3. User diarahkan kembali ke landing page

## Error Handling

Aplikasi menangani error dengan:
- Try-catch untuk API calls
- Error message display di UI
- Console logging untuk debugging

Contoh error handling:
```javascript
try {
  const response = await fetch(`${API_BASE_URL}/api/chem/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.detail || 'Gagal generate molecules');
  }

  const data = await response.json();
  // Process data...
} catch (error) {
  console.error('Error:', error);
  alert('Gagal: ' + error.message);
}
```

## Token Management

- Token disimpan di React state (sessionStorage/localStorage dapat ditambahkan)
- Token dikirim di header `Authorization: Bearer {token}` untuk authenticated endpoints
- Token hilang saat page refresh (untuk production, gunakan localStorage)

## Testing

Untuk testing lokal dengan FastAPI backend:

1. Jalankan FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

2. Update `.env` ke local:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. Jalankan React app:
   ```bash
   npm run dev
   ```

## Troubleshooting

### CORS Issues
Jika mengalami CORS error, pastikan FastAPI backend memiliki CORS middleware:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Auth Token Expired
Implementasikan refresh token mechanism atau re-login flow

### Data Structure Mismatch
Pastikan response data structure dari API sesuai dengan yang diharapkan frontend

## Future Improvements

- [ ] Implement token refresh mechanism
- [ ] Store token in localStorage untuk persistence
- [ ] Add loading spinner saat API call
- [ ] Implement pagination untuk history
- [ ] Add error boundary component
- [ ] Implement retry mechanism untuk failed requests
