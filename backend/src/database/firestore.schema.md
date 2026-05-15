# Firestore Database Design

## Collections

### admins
- id
- username
- passwordHash
- role: SUPER_ADMIN | DISTRICT_ADMIN | CAMP_ADMIN | NGO_ADMIN | EMERGENCY_OPERATOR
- name
- district
- status
- createdAt

### users
- id
- fullName
- mobile
- email
- bloodGroup
- emergencyContacts[]
- lastKnownLocation
- deviceInfo

### sosAlerts
- id
- userId
- userName
- phone
- location { lat, lng, address }
- timestamp
- alertType
- severity
- activatedMode
- batteryLevel
- nearbyHazards[]
- status
- assignedTeamId
- resolutionNotes

### missingPersons
- id
- type: MISSING | FOUND
- name
- age
- gender
- photoUrl
- lastSeenLocation
- medicalCondition
- familyContact
- identificationMarks
- status
- location
- matchedPersonId

### resourceRequests
- id
- requesterType
- requesterId
- category
- quantity
- unit
- priority
- status
- allocatedInventory[]
- deliveryStatus
- location

### rescueTeams
- id
- name
- leader
- members[]
- vehicle
- medicalKits
- status
- currentMissionId
- location

### rescueMissions
- id
- sosAlertId
- teamId
- state
- route
- startedAt
- completedAt

### camps
- id
- name
- adminId
- capacity
- occupancy
- bedsAvailable
- waterStatus
- electricityStatus
- foodStock
- medicalSupport
- demographics
- location

### volunteers
- id
- volunteerId
- fullName
- dob
- gender
- mobile
- identityPlaceholder
- skills[]
- bloodGroup
- address
- emergencyContact
- assignedCampId
- username
- passwordHash
- verificationStatus
- documents[]

### ngos
- id
- ngoName
- registrationNumber
- workerId
- workerName
- contactInfo
- assignedCampId
- responsibilities[]
- username
- passwordHash
- verificationStatus
- documents[]

### rationLogs
- id
- campId
- rice
- wheat
- water
- milk
- babyFood
- medicines
- status
- grantedBy
- createdAt

### notifications
- id
- title
- message
- channel
- severity
- targetAudience
- sentBy
- createdAt

### auditLogs
- id
- actorId
- actorRole
- action
- target
- metadata
- timestamp

## Relationship Logic

- `sosAlerts.assignedTeamId` references `rescueTeams.id`.
- `rescueMissions.sosAlertId` references `sosAlerts.id`.
- `rescueMissions.teamId` references `rescueTeams.id`.
- `camps.adminId` references `admins.id`.
- `volunteers.assignedCampId` and `ngos.assignedCampId` reference `camps.id`.
- `rationLogs.campId` references `camps.id`.
- `resourceRequests.requesterId` references either `users.id` or `camps.id` based on `requesterType`.

