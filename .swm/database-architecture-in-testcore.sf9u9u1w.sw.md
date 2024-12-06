---
title: 'Database Architecture in Testcore  '
---
&nbsp;

The **database folder** in Testcore is organized to handle both **SQL** and **NoSQL** databases efficiently. Each database has a dedicated file structure and logic to ensure seamless data management and integration with the system's features.&nbsp;&nbsp;

###  **File Organization:**  

1\. **SQL Logic Files**:&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- Major SQL schemas are mapped to `.sql.db.ts` files.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- These files handle structured data such as exam schedules, results, and user profiles, enabling robust and scalable database operations for structured datasets.&nbsp;&nbsp;

2\. **NoSQL Logic Files**:&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- Logic for the **chat system** and other unstructured data is implemented in `.nosql.db.ts` files.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- **MongoDB** is primarily used for unstructured data like chat threads and logs, which require flexibility in schema design.&nbsp;&nbsp;

3\. **Redis Logic Files**:&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- Redis logic is contained in `.redis.query.ts` files.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- Redis acts as a caching layer for both user data and chat system data, enhancing the performance of frequently accessed operations.&nbsp;&nbsp;

### **Mapping Between SQL and NoSQL:**  

\- The **NoSQL database** is mapped to the **SQL database** for efficient cross-referencing and data retrieval.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- For instance, exam data stored in SQL, such as exam schedules and results, is linked with corresponding unstructured data in NoSQL for better searchability.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- A **shortened 8-character token ID** is mapped to a **32-byte exam ID**, making it easier for users to access data without handling lengthy identifiers.&nbsp;&nbsp;

### **Redis Caching:**  

\- Redis is used as a caching layer to store frequently accessed data like:&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- **User session information** for quick authentication.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- **Chat system data** for real-time messaging performance.&nbsp;&nbsp;

&nbsp;&nbsp;&nbsp;- Exam data mappings for faster lookups.&nbsp;&nbsp;

### **Advantages:**  

1\. **Efficiency**: Combining SQL and NoSQL databases ensures that structured and unstructured data is handled optimally.&nbsp;&nbsp;

2\. **User-Friendly IDs**: Mapping lengthy IDs to shorter token IDs simplifies the user experience.&nbsp;&nbsp;

3\. **High Performance**: Redis caching reduces database load and ensures fast data retrieval.&nbsp;&nbsp;

4\. **Flexibility**: NoSQL’s flexible schema design allows the system to adapt to dynamic requirements, like real-time chat logs.&nbsp;&nbsp;

This architecture ensures that Testcore handles data effectively, with SQL managing structured datasets, NoSQL handling dynamic data, and Redis optimizing performance through caching.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBVGVzdGNvcmUlM0ElM0FDT0RFQ1pFUk8=" repo-name="Testcore"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
