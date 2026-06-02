# Uni Stats

A simple, fast, and secure desktop application to track your university exams, calculate your averages (arithmetic and weighted), and project your graduation starting grade.

## Features

- **Offline First & Secure**: All your data is stored locally on your machine using your browser's local storage. No data is ever sent to an external server. Your personal data remains yours.
- **Grade Projections**: Instantly see your weighted and arithmetic averages, and calculate the exact starting grade for your graduation (`(Weighted Average / 30) × 110`).
- **Exam Simulation**: Add hypothetical exams to see how they would impact your overall average and final grade.
- **Visual Analytics**: Interactive charts to track your performance trend over time (by exam or by semester).
- **Sleek Interface**: Built with modern web technologies, providing a fluid and premium dark-mode experience.

## Getting Started

### Prerequisites
- Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Lorenzo1901/Uni-Stats.git
   cd Uni-Stats
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Technologies Used
- React
- Vite
- Electron (for desktop packaging)
- Recharts (for data visualization)
- Lucide React (for icons)

## Privacy
This app does not collect, transmit, or store any personal information externally. All exams and grades are stored locally within your application data.

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
