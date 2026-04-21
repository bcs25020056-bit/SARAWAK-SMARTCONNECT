# Entity Relationship Diagram (ERD)

This document describes the data structure and relationships for the **Sarawak Smart Connect** platform.

```mermaid
erDiagram
    USER ||--o{ JOB : "posts (as Company)"
    USER ||--o{ APPLICATION : "applies (as Student)"
    JOB ||--o{ APPLICATION : "receives"
    USER ||--o{ NOTIFICATION : "receives"

    USER {
        string uid PK
        string displayName
        string email
        string role "student | company | admin"
        boolean onboarded
        string bio
        int level
        int xp
        int badges
        stringArray skills
        objectArray education
        object companyInfo
        timestamp createdAt
    }

    JOB {
        string id PK
        string companyId FK "Reference to USER.uid"
        string title
        string company "Denormalized name"
        string location
        string type
        string salary
        string description
        stringArray tags
        string icon
        timestamp postedAt
    }

    APPLICATION {
        string id PK
        string userId FK "Reference to USER.uid"
        string jobId FK "Reference to JOB.id"
        string jobTitle "Denormalized"
        string company "Denormalized"
        string status "Review | Shortlist | Interview | Offer"
        int progress
        timestamp appliedAt
    }

    NOTIFICATION {
        string id PK
        string userId FK "Reference to USER.uid"
        string title
        string message
        string type "info | alert | success"
        boolean read
        timestamp createdAt
    }
```

### 📋 Entity Descriptions

#### 1. User
The core entity representing all participants in the network. Roles determine high-level permissions and features:
- **Students**: Can search for jobs, apply, and track progress.
- **Companies**: Can post jobs and manage recruiting.
- **Admins**: Have broad oversight and system configuration access.

#### 2. Job
Representing professional opportunities. While it contains denormalized company names for performance, it is structurally linked to a User document with the `company` role.

#### 3. Application
A join entity that links a Student to a Job. It maintains stateful information about the hiring process (status, progress percentage).

#### 4. Notification
System-generated alerts that are targeted at specific users based on events (e.g., job application status updates).
