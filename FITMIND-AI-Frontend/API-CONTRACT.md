# API contract expected from the Express backend

Base path `/api`. In development Vite proxies it to `API_PROXY_TARGET` (default `http://localhost:5000`).
Errors: any non-2xx status with `{ "success": false, "error": { "message": "..." } }`.

## POST /api/measurements/body  (multipart/form-data)
Fields: `image` (front, JPG/PNG), `side_image`?, `height_cm`, `weight_kg`, `age`?,
`sizing_profile`? (menswear|womenswear|unisex), `fit_preference`? (slim|regular|relaxed|oversized).

## POST /api/measurements/garment  (multipart/form-data)
Fields: `image`, `garment_category` (shirt|trousers), `garment_type` (shirt|tshirt|trousers),
`calibration_length_cm`, `calibration_start_x`, `calibration_start_y`, `calibration_end_x`,
`calibration_end_y`, `guided_measurement_lines_json`?

## Measurement response (same shape as the Python service)
```json
{ "success": true, "unit": "cm",
  "measurements": { "shoulder_width": { "value": 43.8, "status": "estimated", "confidence": null, "note": null } },
  "warnings": [] }
```
`confidence` is a number from 0 to 1, or null.

## Forwarding to the Python service
Express should receive the upload and forward it as multipart to
`/api/v1/measurements/body` or `/api/v1/measurements/garment`.
The Python service takes the front photo as `image`; it ignores `side_image`, `age`,
`sizing_profile`, `fit_preference` and `garment_type`.
Pass its status code and error body back unchanged.

## POST /api/recommendations  (JSON)  - used when VITE_USE_MOCK_CATALOGUE=false
Request:
```json
{ "preferences": { "occasion": "work", "category": "shirts", "minBudget": "500", "maxBudget": "2000", "fit": "", "marketplace": "" },
  "measurements": { "chest_circumference": 96 } }
```
Response:
```json
{ "products": [ { "id": "1", "title": "...", "marketplace": "myntra", "price": 1299,
  "imageUrl": "https://...", "url": "https://...", "recommendedSize": "M", "sizeChartVerified": true } ] }
```
`recommendedSize` is shown only when `sizeChartVerified` is `true`.
