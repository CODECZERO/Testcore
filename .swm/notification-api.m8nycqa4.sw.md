---
title: Notification Api
---
### **Notification API Documentation**

#### **Main Endpoint**:

`/api/v1/notification`

---

### **Endpoints**

#### **1. Send Notification**

**Endpoint**: `/api/v1/notification/sendNotification`\
**Method**: `POST`

**Description**:\
Allows users, including examiners, to send notifications or messages related to exam schedules to students of a specific college. The message is broadcast to all students associated with the provided `collegeID`.

**Input Payload**:

```json
{
  "message": "String containing the notification message",
  "collegeID": "Unique identifier for the college",
  "subjectID": "Unique identifier for the subject"
}
```

&nbsp;

**Example Request**:

```json
{
  "message": "Exam schedule for Semester 2 is now available. Check the portal for             details.",
  "collegeID": "123456",
  "subjectID": "CS101"
}
```

**Response**:

    **Success**:

```json
{
  "status": "success",
  "message": "Notification sent to all students in the college."
}
```

&nbsp;&nbsp;&nbsp;**Error**:

```json
{
  "status": "error",
  "message": "Failed to send notification. Please check the input data."
}

```

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBVGVzdGNvcmUlM0ElM0FDT0RFQ1pFUk8=" repo-name="Testcore"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
