# Flutter App Integration Guide

Set the mobile app backend base URL:

```dart
const adminApiBaseUrl = 'http://localhost:8080/api';
```

For production, replace localhost with the deployed backend URL.

This project now includes `lib/core/services/admin_sync_service.dart`, which sends app events to the admin backend. Defaults:

- Android emulator: `http://10.0.2.2:8080/api`
- Windows/desktop/web: `http://127.0.0.1:8080/api`
- Physical phone: run with `--dart-define=JEEVAN_ADMIN_API=http://YOUR_PC_WIFI_IP:8080/api`

## SOS Alert

```http
POST /api/ingest/sos
Content-Type: application/json
```

```json
{
  "userName": "Aarav Kumar",
  "phone": "+91 90000 10001",
  "location": {
    "lat": 25.5941,
    "lng": 85.1376,
    "address": "Gandhi Maidan, Patna"
  },
  "alertType": "Flood Rescue",
  "severity": "CRITICAL",
  "activatedMode": "Shake SOS",
  "batteryLevel": 18,
  "nearbyHazards": ["Flood zone", "Power outage"]
}
```

Dashboard event: `sos:new`.

## Missing / Found Person

```http
POST /api/ingest/missing-person
```

```json
{
  "type": "MISSING",
  "name": "Rohan Singh",
  "age": 9,
  "gender": "Male",
  "lastSeenLocation": "Kankarbagh Shelter Gate",
  "medicalCondition": "Asthma",
  "familyContact": "+91 90000 20001",
  "identificationMarks": "Mole near left eyebrow",
  "location": { "lat": 25.6004, "lng": 85.1549 }
}
```

Dashboard event: `missing:new`.

## Resource Request

```http
POST /api/ingest/resource-request
```

```json
{
  "requester": "Camp Boring Road",
  "category": "Water",
  "quantity": 1200,
  "unit": "litres",
  "priority": "HIGH",
  "location": { "lat": 25.617, "lng": 85.11 }
}
```

Dashboard event: `resource:new`.

## Emergency Call

```http
POST /api/ingest/emergency-call
```

```json
{
  "callerName": "Imran Ali",
  "phone": "+91 90000 30001",
  "incidentType": "Trapped family",
  "operatorNotes": "Needs boat rescue near bridge"
}
```

Dashboard event: `call:new`.

## Live Location

```http
POST /api/ingest/location
```

```json
{
  "entityType": "USER",
  "entityId": "user-123",
  "lat": 25.604,
  "lng": 85.137,
  "batteryLevel": 44,
  "timestamp": "2026-05-14T18:45:00.000Z"
}
```

Dashboard event: `location:update`.

## Camp Management Sync

The camp module now sends its local sync queue to:

```http
POST /api/ingest/camp-sync
```

```json
{
  "entityType": "requests",
  "entityId": 101,
  "action": "insert",
  "payload": {
    "request_type": "ration",
    "item_name": "Rice",
    "quantity": "20"
  },
  "source": "flutter-camp-management"
}
```

Dashboard event: `camp:event`.

Visible in admin:

- Camp Management page: Live Camp App Events
- Resource page: camp requests
- Ration page: ration sync records
- Activity logs: every camp sync event

## Recommended Flutter Service Shape

```dart
Future<void> sendSos(Map<String, dynamic> payload) async {
  final response = await http.post(
    Uri.parse('$adminApiBaseUrl/ingest/sos'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(payload),
  );
  if (response.statusCode >= 400) {
    throw Exception('SOS sync failed: ${response.body}');
  }
}
```
