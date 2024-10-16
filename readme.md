# Attendance Discord Bot

A robust Discord bot built with **Discord.js** and **TypeScript** designed to manage user time tracking, handle managerial requests, and provide administrative controls within your Discord server. This bot facilitates user logins/logouts, tracks active time across various sections, manages leaderboard displays, and handles managerial operations such as leave requests and resignations.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Commands](#commands)
  - [Buttons & Interactions](#buttons--interactions)
  - [Managerial Operations](#managerial-operations)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Time Tracking:** Users can log in and out of specific sections, with their active time being tracked and stored.
- **Leaderboards:** Display top users based on the time they've spent in each section.
- **Administrative Commands:** Add or remove time from users, reset user time data, and more.
- **Managerial Requests:** Managers can handle leave requests and resignations through interactive modals and buttons.
- **Persistent Storage:** Utilizes `quick.db` for efficient and straightforward data management.
- **Interactive Components:** Employs buttons, select menus, and modals for a seamless user experience.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** Version 16.9.0 or higher. [Download Node.js](https://nodejs.org/)
- **Discord Bot Token:** You need a Discord bot token. [Create a Discord Bot](https://discord.com/developers/applications)
- **Git:** To clone the repository. [Download Git](https://git-scm.com/)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/wickstudio/attendance-discord-bot.git
   cd attendance-discord-bot
   ```

2. **Install Dependencies**

   Ensure you have `npm` installed. Then run:

   ```bash
   npm install
   ```

3. **Setup Configuration**

   - Rename the `config.example.json` to `config.json` and fill in the required details.
   - Create a `.env` file in the root directory and add your Discord bot token and other necessary environment variables.

   ```bash
   cp config.example.json config.json
   cp .env.example .env
   ```

4. **Build the Project**

   Compile the TypeScript code to JavaScript:

   ```bash
   npm run build
   ```

5. **Run the Bot**

   Start the bot using:

   ```bash
   npm start
   ```

   The bot should now be online and ready to use in your Discord server.

## Configuration

The `config.json` file is pivotal for customizing the bot's behavior. Below is a breakdown of the configuration options:

```json
{
  "TOKEN": "YOUR_BOT_TOKEN",
  "CLIENT_ID": "YOUR_CLIENT_ID",
  "GUILD_ID": "YOUR_GUILD_ID",
  "options": [
    {
      "name": "Section Name",
      "admins": ["ADMIN_USER_ID1", "ADMIN_USER_ID2"],
      "image": "IMAGE_URL",
      "emoji": "🛠️",
      "logchannel": "LOG_CHANNEL_ID",
      "role": "ROLE_ID"
    }
  ],
  "managerLogChannel": "MANAGER_LOG_CHANNEL_ID"
}
```

### Configuration Fields

- **TOKEN:** Your Discord bot token.
- **CLIENT_ID:** The Client ID of your Discord application.
- **GUILD_ID:** The ID of the Discord server where you want to register the bot's commands (useful for development).
- **options:** An array defining different sections within your server. Each section includes:
  - **name:** The name of the section.
  - **admins:** Array of user IDs who have administrative privileges for this section.
  - **image:** URL to an image representing the section.
  - **emoji:** Emoji associated with the section.
  - **logchannel:** Channel ID where logs related to this section will be sent.
  - **role:** Role ID associated with the section.
- **managerLogChannel:** Channel ID where managerial logs (e.g., leave requests) will be sent.

## Usage

Once the bot is up and running, you can interact with it using various commands and interactive components.

### Commands

All commands are slash commands and can be accessed by typing `/` in your Discord server.

#### `/add_time`

**Description:** Add time to a user's total in a specific section.

**Options:**

- **user:** The user to whom you want to add time.
- **type:** The section where time is being added.
- **time:** Duration to add (e.g., `1m`, `2h`, `3d`).

**Usage:**

```
/add_time user:@username type:Section Name time:2h
```

#### `/leaderboard`

**Description:** Display the top users based on time spent in a specific section.

**Options:**

- **type:** The section for which to display the leaderboard.

**Usage:**

```
/leaderboard type:Section Name
```

#### `/list`

**Description:** Show a list of users currently logged into a specific section.

**Options:**

- **type:** The section to display the logged-in users for.

**Usage:**

```
/list type:Section Name
```

#### `/remove_time`

**Description:** Remove time from a user's total in a specific section.

**Options:**

- **user:** The user from whom you want to remove time.
- **type:** The section where time is being removed.
- **time:** Duration to remove (e.g., `1m`, `2h`, `3d`).

**Usage:**

```
/remove_time user:@username type:Section Name time:1h
```

#### `/reset`

**Description:** Reset a user's time data for a specific section.

**Options:**

- **user:** The user whose time data you want to reset.
- **type:** The section for which to reset the time.

**Usage:**

```
/reset user:@username type:Section Name
```

#### `/setup`

**Description:** Set up login/logout buttons for a specific section.

**Usage:**

```
/setup
```

This command will prompt you to select a section and then create an embedded message with login and logout buttons in the current channel.

#### `/total`

**Description:** Display the total time a user has spent in a specific section.

**Options:**

- **type:** The section to check time for.
- **user:** (Optional) The user to check time for. Defaults to the command issuer if not provided.

**Usage:**

```
/total type:Section Name user:@username
```

#### `/show`

**Description:** Display users who have logged into a specific section.

**Options:**

- **type:** The section to display logged-in users for.

**Usage:**

```
/show type:Section Name
```

#### `/manager`

**Description:** Display managerial options for leave requests and resignations.

**Usage:**

```
/manager
```

### Buttons & Interactions

The bot utilizes interactive buttons and modals for user interactions.

- **Login Button:** Allows users to log into a specific section.
- **Logout Button:** Allows users to log out of a section, optionally providing a report.
- **Managerial Buttons:** For managers to accept or reject leave and resignation requests.

### Managerial Operations

Managers can handle leave requests and resignations through interactive modals and buttons.

1. **Requesting Leave:**
   - Use the `/manager` command to display managerial options.
   - Click on the "طلب إجازة" (Request Leave) button.
   - Fill out the modal with your name, reason, and duration.
   - Submit the modal to send a leave request for approval.

2. **Resignation:**
   - Use the `/manager` command to display managerial options.
   - Click on the "استقالة" (Resignation) button.
   - Fill out the modal with your name and reason.
   - Submit the modal to send a resignation request for approval.

Managers will receive the requests in the designated log channel and can approve or reject them using the provided buttons.

## Folder Structure

Here's an overview of the project's folder structure:

```
src/
├── buttons/
│   ├── login.ts
│   ├── logout.ts
│   ├── manager_off.ts
│   ├── manager_resignation.ts
├── commands/
│   ├── addtime.ts
│   ├── leaderboard.ts
│   ├── list.ts
│   ├── manager.ts
│   ├── removetime.ts
│   ├── reset.ts
│   ├── setup.ts
│   ├── show.ts
│   ├── total.ts
├── events/
│   └── interaction.ts
├── modals/
│   ├── manager_off_modal.ts
│   ├── manager_resignation_modal.ts
├── selects/
│   └── setup.ts
├── utils/
│   └── types.ts
.env
.json.sqlite
config.json
index.ts
package-lock.json
package.json
tsconfig.json
```

### Description of Key Folders and Files

- **buttons/**: Handles button interactions like login, logout, and managerial approvals.
- **commands/**

: Contains all slash commands the bot can execute.
- **events/**: Manages Discord events, primarily interactions.
- **modals/**: Handles modal submissions for managerial requests.
- **selects/**: Manages select menu interactions, such as setup selections.
- **utils/**: Contains utility files, including custom client types.
- **config.json**: Configuration file for bot settings and sections.
- **index.ts**: The entry point of the bot, responsible for loading commands, events, buttons, and selects.
- **.env**: Environment variables file (not included in the repository for security).

## Contributing

Contributions are welcome! To contribute, please follow these steps:

1. **Fork the Repository**

   Click the [Fork](https://github.com/wickstudio/attendance-discord-bot/fork) button at the top right of this page.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/wickstudio/attendance-discord-bot.git
   cd attendance-discord-bot
   ```

3. **Create a New Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Make Your Changes**

   Commit your changes with clear and descriptive messages.

   ```bash
   git commit -m "Add new feature"
   ```

5. **Push to Your Fork**

   ```bash
   git push origin feature/YourFeatureName
   ```

6. **Create a Pull Request**

   Go to the original repository and click on the "Compare & pull request" button. Provide a clear description of your changes.

## License

This project is licensed under the [MIT License](LICENSE).

---

- **GitHub**: [wickstudio](https://github.com/wickstudio)
- **Discord**: [Wick's Discord](https://discord.gg/wicks)
- **Website**: [wickdev.me](https://wickdev.me)