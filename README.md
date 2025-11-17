# Habit Tracker

A comprehensive habit tracking application that helps users monitor their daily habits, visualize progress, receive projections based on their consistency, and analyze their success rate over time.

## Features

- **Track Habits**: Create and manage multiple habits with custom names and goals
- **Daily Check-ins**: Simple interface to mark habits as completed each day
- **Progress Visualization**: View your habit streaks and completion history
- **Success Predictions**: AI-powered projections on future habit completion based on past behavior
- **Analytics Dashboard**: Detailed statistics on success rates, streaks, and trends
- **Goal Setting**: Set realistic targets and track progress toward them
- **Reminders**: Get notifications to help maintain your habits
- **Export Reports**: Generate and download your habit data and insights

## Tech Stack

- **Frontend**: React.js / Vue.js / Angular (to be decided)
- **Backend**: Node.js with Express / Python with Flask/Django
- **Database**: MongoDB / PostgreSQL
- **Data Visualization**: Chart.js / D3.js
- **Authentication**: JWT / OAuth
- **Deployment**: Docker, CI/CD pipelines

## Project Structure

```
habbit-tracker/
├── backend/          # Server-side code
│   ├── models/       # Database models
│   ├── routes/       # API endpoints
│   ├── middleware/   # Authentication and validation
│   └── config/       # Configuration files
├── frontend/         # Client-side code
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── services/     # API service calls
│   └── assets/       # Images, styles, fonts
├── docs/             # Documentation
├── tests/            # Test files
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Clone the Repository

```bash
git clone https://github.com/divijshrivastava/habbit-tracker.git
cd habbit-tracker
```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## Usage

1. Sign up or log in to your account
2. Create new habits you want to track
3. Set goals and frequency for each habit
4. Check in daily to mark habits as completed
5. View your dashboard to see progress and analytics
6. Receive projections on your habit success

## API Documentation

Detailed API documentation is available in `/docs/API.md`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Roadmap

- [ ] Basic habit creation and tracking
- [ ] Daily check-in interface
- [ ] Progress visualization
- [ ] Analytics dashboard
- [ ] Projection algorithm
- [ ] Mobile app (React Native)
- [ ] Social features (share progress, challenges)
- [ ] Integration with calendar apps
- [ ] Machine learning predictions

## Known Issues

None at the moment. Please report bugs by creating an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@habbit-tracker.com or open an issue on GitHub.

## Authors

- **Divij Shrivastava** - Initial work

## Acknowledgments

- Inspired by habit tracking best practices
- Thanks to the open-source community
