# **Testcore**

Testcore is a digital solution designed to replicate and enhance the traditional offline exam conduction process, transforming it into an efficient and scalable online system. It eliminates resource wastage, reduces logistical complexities, and saves time by enabling seamless online exam management.  

With Testcore, exams can be monitored remotely by a few individuals from anywhere in the world, and students can participate without geographical restrictions. This makes Testcore a cost-effective and resource-efficient platform for educational institutions.

---

## **Features**

### **Chat System**
- Structured chat rooms based on institution and class name.
- Enables group discussions to resolve exam-related queries quickly.
- Chat rooms are automatically locked during exams to maintain integrity.

### **Video Call and Streaming**
- Supports one-to-many (1:M) and many-to-many (M:M) video conferencing.
- Centralized monitoring dashboard for live exam supervision.
- Allows invigilators to ensure compliance with examination guidelines remotely.

### **SMS Notification System**
- Automated SMS notifications for exam schedules, subjects, and course registrations.
- Ensures timely updates and minimizes communication gaps.

### **Anti-Virus Scanner**
- File upload scanner to detect and prevent malware.
- Ensures a secure environment for file exchanges.

### **System Monitoring, Logging, and Testing**
- Comprehensive logging of all system activities for debugging and performance tracking.
- Compatible with tools like **Grafana** and **Prometheus** for advanced monitoring, alerting, and proactive issue resolution.

---

## **Architecture Overview**

### **Database Design**
Testcore uses a hybrid database architecture for optimal performance and scalability:
- **SQL Database (PostgreSQL)**: Handles structured and relational data like user details, exam results, and transactions.
- **NoSQL Database (MongoDB)**: Manages unstructured and semi-structured data like dynamic timetables and exam configurations.

This combination ensures reliability, scalability, and adaptability to diverse data requirements.

### **Folder Structure**
- **Client**: Contains the frontend code for the platform, providing a responsive and intuitive user interface.
- **Server**: Houses the backend logic, database operations, and API endpoints.

Both client and server components are independent, enabling separate deployment for scalability and flexibility.

### **Backend Design**
The backend follows a **microservices architecture**:
1. **Modularity**: Each service can operate independently.
2. **Scalability**: Services can be scaled based on demand.
3. **Fault Tolerance**: Failures in one service do not impact others.
4. **Efficient Load Distribution**: Services can be deployed on separate servers for optimal performance.

### **Docker Integration**
Testcore is fully containerized using Docker:
- Services are built into containers for easy portability.
- Multiple services can run on the same server using Docker containers.
- Nginx is used for reverse proxying, load balancing, WebSocket handling, and caching.
- Docker ensures consistent backend deployment across environments.

---

## **Deployment**

### **Prerequisites**
- Docker
- Docker Compose (optional)
- Node.js (for development)
- PostgreSQL and MongoDB instances

### **Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/testcore.git
   cd testcore
   ```
2. Build and run Docker containers:
   ```bash
   docker-compose up --build
   ```
3. Access the services:
   - Frontend: `http://localhost:<frontend_port>`
   - Backend: `http://localhost:<backend_port>`

4. For production:
   - Configure environment variables for `Dockerfile` and `docker-compose.yml`.
   - Use Nginx for reverse proxy and SSL setup.

---

## **Technologies Used**
- **Frontend**: React.js (or your frontend tech)
- **Backend**: Node.js, Express.js
- **Databases**: PostgreSQL, MongoDB
- **Containerization**: Docker
- **Monitoring**: Grafana, Prometheus
- **Web Server**: Nginx

---

## **Contributing**
We welcome contributions to Testcore. Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push to your forked repo.
4. Create a pull request describing your changes.

---

## **License**
Testcore is licensed under the [MIT License](LICENSE).
