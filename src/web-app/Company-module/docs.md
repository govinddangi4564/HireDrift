# Talent Intelligence Frontend Documentation

## Topic 1: UI Design & User Experience
- Layout: Sidebar + content pane layout reused across `index.html`, `jd.html`, `upload.html`, `shortlist.html`, `candidate.html`.
- Navigation: Persistent sidebar navigation with active state highlighting.
- User Flow: Dashboard → JD management → Resume upload → Shortlist → Candidate detail.
- Responsiveness: CSS grid and flex utilities support tablet/mobile breakpoints; assistant panel adapts on small screens.
- Accessibility: Semantic headings, button focus states, high-contrast dark/light themes.

## Topic 2: Resume & JD Upload Module
- File Upload: Drag & drop zone (`upload.html`) with multi-file support and progress bar feedback.
- Validation: Accepts PDF/DOC/DOCX; prevents processing when no JD exists.
- Parsed Preview: `appendCandidatePreview` displays AI-extracted skills, summary, experience.
- Storage: Parsed candidates persisted via `localStorage` through `persistCandidate` helper.

## Topic 3: AI Insights Display
- Scores: `calculateMatch` simulates SBERT similarity, skill match %, and final composite score.
- Visualization: Dashboard charts (`Chart.js`) for skill distribution & match trend lines.
- Highlights: Candidate detail page shows matched skills and AI-generated insights.
- Assistant: Sidebar chatbot answers semantic queries and returns filtered candidates.

## Topic 4: Candidate Ranking & Filtering
- Table View: `shortlist.html` sortable grid of candidates with live search and score filters.
- Shortlisting: Toggle pills update `localStorage` shortlist state.
- Comparison: Two-row selection opens modal (`comparisonModal`) for side-by-side analysis.
- Export: Download shortlist as CSV via `exportBtn` handler.

## Topic 5: Analytics & Reporting Dashboard
- KPIs: Overview cards show resumes scanned, shortlisted counts, average scores, active JDs.
- Filters: Quick filters for role, department, date window update candidate count pill.
- Recommendations: Dashboard panels summarize departmental trends and AI suggestions.
- Reports State: Report metadata stored under `STORAGE_KEYS.reports` for future expansion.

## Topic 6: Frontend-Backend Integration
- REST Hooks: `data.js` designed with `STORAGE_KEYS` abstraction simplifying API swap-out.
- Matching Pipeline: `simulateResumeParsing` placeholder simulates future API parser response.
- Authentication Ready: Theme toggle & assistant panels structured for role-based gating.
- Real-time Ready: `setupAssistant` and modular functions allow WebSocket injection later.
- Per-page Bundles: `dashboard.js`, `jd.js`, `upload.js`, `shortlist.js`, `candidate.js` keep logic scoped while `app.js` handles shared behavior.

## Topic 7: Performance & Security
- Lazy Loading: Charts only instantiate on dashboard presence, minimizing unused JS.
- Storage Security: Uses scoped `localStorage` keys; ready for JWT integration in fetch wrappers.
- Role-Based Access: Placeholder pill tags & navigation primed for HR/Admin toggles.
- Theme Persistence: Preferences cached for consistent UX across sessions.

## Bonus Features Implemented
- AI Chat Assistant: Contextual candidate search via natural language (`setupAssistant`).
- Comparison View: Side-by-side candidate comparison modal in shortlist page.
- Smart Filters: Auto-filter pill and quick filters highlight >80% match automation.
- Theme Customization: Persistent light/dark modes with CSS variables.
- Downloadable Reports: CSV export for shortlist plus `reports` storage seed for PDF/Excel integration.

## Next Steps & Integrations
- Replace simulated parsing with real REST endpoints returning SBERT vectors.
- Connect JD CRUD to backend API with authentication headers.
- Plug WebSocket updates into shortlist table for real-time collaboration.
- Extend assistant with LLM backend or chat completion API for richer guidance.

