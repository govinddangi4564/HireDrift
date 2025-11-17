API Endpoints:

Company Specific:

1. POST /api/auth/company/login
    email, password
    Response (200 OK):
    {
       "token": "your_jwt_token_here",
        "company": { "id": "company-123", "name": "Innovate Inc." }
     }
 
     Error Response (401 Unauthorized):
     { "message": "Invalid credentials" }
 

2. GET /api/company/profile
    return: companyID, companyName, companyEmail, companyWebsite
    validate: companyAuthToken
  - Fetches the current company's data to populate the form.

3. PUT /api/company/profile
    companyName, companyEmail, companyWebsite
    validate: companyAuthToken
    - Updates the company's profile data.

4. POST /api/company/change-password
    currentPassword, confirmPassword, currentPassword
    validate: companyAuthToken
    - Handles password changes.

5. POST /api/companies/register
    firstName, lastName, email, password, plan

6. /api/company/dashboard/stats
    validate: companyAuthToken
    response: 
    {
         resumes_scanned: 150,
         shortlisted: 25,
         avg_match_score: 78,
         active_jds: 5,
         trends: { 
           weekly_growth: 12, 
           conversion_rate: 8,
           top_department: "Engineering",
           top_skill: "Python"
         }
    }

7. /api/company/dashboard/skills-distribution?days=7
    { 
       skills: [
         { name: "Python", count: 45, percentage: 30 },
         { name: "React", count: 32, percentage: 21 },
         ...
       ] 
     }

8. /api/company/dashboard/match-trends?days=7&jd_id=xxx
    { 
        trends: [
        { date: "2025-01-15", avg_score: 85, shortlisted_count: 5, total_candidates: 12 },
        { date: "2025-01-16", avg_score: 82, shortlisted_count: 3, total_candidates: 8 },
        ...
        ],
        jd_breakdown: [
        { jd_id: "jd-1", jd_title: "Full Stack Developer", daily_scores: [...] },
        ...
        ]
    }



JD specific:

1. GET /api/jds
    id, title, department, location, description,
    keywords, created_at, updated_at, created_by

2. GET /api/jds/:id

3. POST   /api/jds

4. PUT    /api/jds/:id

5. DELETE /api/jds/:id



Resumes

1. POST /api/resumes/parse
    auth token
    payload: multipart resume file in formData 'resume'



Shortlist

1. GET  /api/shortlist
    {candidateName}

2. POST  /api/shortlist 
    candidateId, shortlisted, jdId

3. DELETE /api/shortlist/:id



Matching

1. POST   /api/matching/run  
    Run SBERT matching for all candidates

2. POST   /api/matching/candidate/:id
    Match single candidate

3. POST   /api/matching/calculate  
    candidate_id, jd_id, resume_text, jd_text



Candidates:

1. GET  /api/candidates?role=...&department=...&days=...&search=...&minScore=...&sortBy=...
    jdId, jdTitle, department, uploadedAt, 

2. GET  /api/candidates/:id

3. POST /api/candidates

4. PUT  /api/candidates/:id

5. DELETE  /api/candidates/:id



User Specific: (change /api to /api/user for all below endpoints)

1. POST /api/forgot-password
    payload: email => send reset link to email
    response: {"message": "email sent"}

2. POST /api/login
    email, password
    response: name, email, user_id, token, picture, fullName, phone, newsletter

3. POST /api/register
    payload: email, picture(optional), fullName, phone, newsletter, password
    return the same data in response
