# Beyond Assessment - Multi-Step Resume Form

A responsive, multi-step form built using **Next.js** and **React** that allows users to upload their resume, enter personal details, manage skills and education entries dynamically (with drag-and-drop support), and view a summary before submission. The UI strictly follows the provided Figma design and includes features like validation, data persistence, and a clean user experience.

## Live Demo

[View the deployed app on Vercel](https://beyond-assesment.vercel.app/)

## Features

- **Multi-step navigation** with validation on each step
- **PDF Resume Upload** and preview on summary page
- **Dynamic Skills Section** with drag-and-drop reordering
- **Dynamic Education Entries**
- **Form validation** with meaningful error messages
- **LocalStorage support** for form data persistence
- **Final Summary Page** with resume download and editable steps
- **Responsive Design** matching Figma UI exactly

## Screenshots

[Include a few key screenshots of the app UI from each step]

## Tech Stack

- **Next.js**
- **React**
- **Tailwind CSS**
- **React Hook Form** (for form state and validation)
- **Zod** (schema validation)
- **Dnd Kit** (for drag-and-drop functionality)
- **LocalStorage** (for data persistence)

## Installation

```bash
git clone https://github.com/karthis17/beyond_assesment.git
cd beyond_assesment
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.


## How It Works

### Step 1: Upload Resume
- Upload only PDF files.
- File is saved in state and shown in the final summary with a download option.

### Step 2: Basic Details
- Inputs for Name, Email, Phone
- Validated using Zod and React Hook Form

### Step 3: Skills
- Dynamically add as many skills as needed
- Drag-and-drop to reorder using Dnd Kit
- Remove any skill as needed

### Step 4: Education
- Add multiple entries with degree, institution, and year
- Remove individual entries
- Validation ensures all fields are filled with correct format

### Step 5: Summary
- Review all entries from previous steps
- Edit any step before final submission

## Bonus Features

- Auto-saves form progress to LocalStorage on each update
- Restores previous state on page refresh

## To-Do / Improvements

- Add backend integration for final submission
- Add file type and size restriction messages
- Unit and E2E testing

## Deployment

Deployed using Vercel:  
[https://beyond-assesment.vercel.app/](https://beyond-assesment.vercel.app/)

## Author

**Karthi Sambath**  
[GitHub Profile](https://github.com/karthis17)

## License

This project is open-source and available under the [MIT License](LICENSE).