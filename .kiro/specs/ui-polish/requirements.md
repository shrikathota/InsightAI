# UI Polish Requirements - InsightAI

## Introduction

This specification defines the final polish improvements for InsightAI to achieve production-ready, world-class UI/UX quality. The goal is to enhance the existing design (NOT redesign) to match the quality of products like Notion, Linear, and Vercel.

## Glossary

- **System**: InsightAI application
- **Dashboard**: Main overview page showing stats and recent activity
- **Stat_Card**: Individual metric display card (meetings, summaries, tasks)
- **Meeting_Card**: Card displaying meeting information in grid/list
- **Task_Card**: Individual task item in Kanban board
- **AI_Badge**: Visual indicator for AI-generated content
- **Skeleton_Loader**: Loading placeholder animation
- **Micro_Interaction**: Subtle animation or transition on user action

## Requirements

### Requirement 1: Dashboard Visual Hierarchy Enhancement

**User Story:** As a user, I want the dashboard to clearly communicate the most important information at a glance, so that I can quickly understand my meeting and task status.

#### Acceptance Criteria

1. THE System SHALL display stat card numbers in 4xl font size (larger than current 3xl)
2. WHEN displaying stat cards, THE System SHALL add subtle background tint matching the icon color
3. WHEN a stat card is hovered, THE System SHALL elevate it with shadow-lg and scale-[1.02]
4. THE System SHALL add optional trend indicators (+X this week) below stat numbers
5. THE System SHALL use consistent 8-unit spacing (space-y-8) between major sections
6. WHEN displaying recent meetings list, THE System SHALL use card-style rows with distinct borders
7. WHEN a meeting row is hovered, THE System SHALL show elevated shadow and subtle scale
8. THE System SHALL display AI-generated badges with sparkle icon (✨) prefix

### Requirement 2: Skeleton Loading States

**User Story:** As a user, I want to see smooth loading animations instead of spinners, so that the interface feels more polished and responsive.

#### Acceptance Criteria

1. WHEN dashboard data is loading, THE System SHALL display skeleton placeholders matching final layout
2. THE System SHALL animate skeleton loaders with shimmer effect
3. WHEN meetings are loading, THE System SHALL show 3 skeleton meeting cards
4. WHEN tasks are loading, THE System SHALL show skeleton task columns
5. THE System SHALL use pulse animation for skeleton elements

### Requirement 3: AI Visual Identity Strengthening

**User Story:** As a user, I want to immediately recognize AI-generated content, so that I understand which insights are powered by AI.

#### Acceptance Criteria

1. THE System SHALL prefix all AI-generated content badges with ✨ sparkle emoji
2. WHEN displaying AI summary section, THE System SHALL use gradient border (purple to blue)
3. THE System SHALL add "AI Generated" label with gradient text to summary headers
4. WHEN showing summary vs transcript, THE System SHALL visually separate with distinct background colors
5. THE System SHALL highlight AI summary as primary content with larger font and better spacing

### Requirement 4: Meeting Cards Polish

**User Story:** As a user, I want meeting cards to be scannable and actionable, so that I can quickly find and access the meetings I need.

#### Acceptance Criteria

1. WHEN displaying meeting cards, THE System SHALL show clear status indicators (Has Summary / Needs Summary)
2. THE System SHALL use color-coded status badges (green for complete, amber for pending)
3. WHEN a meeting card is hovered, THE System SHALL show "View Details" overlay or button
4. THE System SHALL display meeting date in relative format (Today, Yesterday, 2 days ago)
5. THE System SHALL add subtle gradient overlay on card hover

### Requirement 5: Kanban Board Enhancement

**User Story:** As a user, I want the task board to be visually clear and easy to use, so that I can manage my action items efficiently.

#### Acceptance Criteria

1. THE System SHALL add clear visual separation between Kanban columns with 6px gap
2. WHEN a column is empty, THE System SHALL display contextual empty state message
3. THE System SHALL use distinct background colors for each column status
4. WHEN a task card is hovered, THE System SHALL elevate with shadow-md
5. THE System SHALL add drag handle visual indicator on task cards
6. THE System SHALL display task priority with colored left border accent
7. WHEN task status changes, THE System SHALL animate the transition

### Requirement 6: Typography Hierarchy Refinement

**User Story:** As a user, I want text to be easy to read and scan, so that I can quickly find information.

#### Acceptance Criteria

1. THE System SHALL use font-bold for all section headings
2. THE System SHALL use text-sm for metadata and secondary information
3. THE System SHALL use text-base for body content
4. THE System SHALL use text-muted-foreground for less important text
5. THE System SHALL maintain consistent line-height (leading-relaxed for body text)
6. THE System SHALL use font-semibold for card titles

### Requirement 7: Spacing System Consistency

**User Story:** As a developer, I want consistent spacing throughout the app, so that the design feels cohesive.

#### Acceptance Criteria

1. THE System SHALL use space-y-6 for major section spacing
2. THE System SHALL use space-y-3 for list item spacing
3. THE System SHALL use gap-6 for grid layouts
4. THE System SHALL use p-6 for card padding
5. THE System SHALL use p-8 for modal/dialog padding

### Requirement 8: Button and CTA Polish

**User Story:** As a user, I want buttons to feel responsive and clear, so that I know what actions I can take.

#### Acceptance Criteria

1. THE System SHALL add hover:scale-[1.02] to all primary action buttons
2. THE System SHALL use hover:shadow-lg for primary buttons
3. THE System SHALL add transition-all duration-200 to all interactive elements
4. THE System SHALL use disabled:opacity-50 disabled:cursor-not-allowed for disabled states
5. THE System SHALL show loading spinner inside button during async actions

### Requirement 9: Empty State Improvements

**User Story:** As a user, I want helpful guidance when sections are empty, so that I know what to do next.

#### Acceptance Criteria

1. WHEN a section is empty, THE System SHALL display large icon (h-20 w-20)
2. THE System SHALL show clear heading explaining the empty state
3. THE System SHALL provide actionable CTA button to resolve empty state
4. THE System SHALL use muted colors for empty state illustrations
5. THE System SHALL add encouraging copy for empty states

### Requirement 10: Dark Mode Refinement

**User Story:** As a user, I want dark mode to look polished and comfortable, so that I can work in low-light environments.

#### Acceptance Criteria

1. THE System SHALL use smooth transition (transition-colors duration-300) when toggling theme
2. THE System SHALL persist dark mode preference in localStorage
3. THE System SHALL adjust glass effect opacity for dark mode
4. THE System SHALL use appropriate contrast ratios for dark mode text
5. THE System SHALL test all colors for WCAG AA compliance in both modes

### Requirement 11: Micro-Interactions

**User Story:** As a user, I want the interface to feel alive and responsive, so that interactions feel satisfying.

#### Acceptance Criteria

1. WHEN clicking a card, THE System SHALL show active:scale-[0.98] feedback
2. WHEN hovering interactive elements, THE System SHALL show cursor-pointer
3. THE System SHALL add transition-transform to all hover scale effects
4. WHEN data updates, THE System SHALL fade in new content with animate-in
5. THE System SHALL add ripple effect to button clicks (optional enhancement)

### Requirement 12: Status Badge System

**User Story:** As a user, I want consistent status indicators, so that I can quickly understand item states.

#### Acceptance Criteria

1. THE System SHALL use rounded-full for all status badges
2. THE System SHALL use px-3 py-1 for badge padding
3. THE System SHALL use text-xs font-medium for badge text
4. THE System SHALL define color scheme: green (success), blue (in-progress), gray (pending), red (error)
5. THE System SHALL add icon prefix to badges where appropriate

### Requirement 13: Meeting Detail Page Polish

**User Story:** As a user, I want the meeting detail page to clearly separate raw data from AI insights, so that I can focus on what matters.

#### Acceptance Criteria

1. THE System SHALL display AI summary in prominent card with gradient border
2. THE System SHALL use larger font (text-base) for AI summary content
3. THE System SHALL collapse transcript by default with "Show Transcript" toggle
4. WHEN transcript is shown, THE System SHALL use muted background and smaller font
5. THE System SHALL add "Generate Summary" CTA as primary action when no summary exists
6. THE System SHALL show success toast notification after summary generation

### Requirement 14: Responsive Design Verification

**User Story:** As a user on mobile/tablet, I want the app to work smoothly on smaller screens, so that I can access it anywhere.

#### Acceptance Criteria

1. THE System SHALL stack stat cards vertically on mobile (grid-cols-1)
2. THE System SHALL use full-width buttons on mobile
3. THE System SHALL adjust sidebar to overlay on mobile with hamburger menu
4. THE System SHALL ensure touch targets are minimum 44x44px
5. THE System SHALL test all interactions on touch devices

### Requirement 15: Performance Optimization

**User Story:** As a user, I want the interface to feel fast and smooth, so that I can work efficiently.

#### Acceptance Criteria

1. THE System SHALL use CSS transforms for animations (not position/margin)
2. THE System SHALL lazy load meeting cards beyond initial viewport
3. THE System SHALL debounce search/filter inputs
4. THE System SHALL use React.memo for expensive list components
5. THE System SHALL minimize re-renders with proper dependency arrays
