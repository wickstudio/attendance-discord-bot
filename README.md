# Attendance Discord Bot

## Introduction
Attendance Discord Bot is a unique bot designed to manage attendance within Discord servers. It allows users to log in and log out, track time, view leaderboards, and much more, making it an ideal solution for communities and groups looking to keep track of participation and activities.

## Features
- **User Login/Logout**: Easily track when users log in and out of the server.
- **Time Tracking**: Add or remove time from a user's record for accurate attendance tracking.
- **Leaderboard**: View a leaderboard to see active and participating members.
- **Additional Commands**: Various commands for managing attendance and user activities.

## Prerequisites
Before you begin, ensure you have:
- Node.js installed on your system.
- A Discord bot token (you can obtain one from the [Discord Developer Portal](https://discord.com/developers/applications)).

## Installation
1. Clone the repository:
```
git clone https://github.com/wickstudio/attendance-discord-bot.git
```
2. Navigate to the cloned directory and install dependencies:
```
cd attendance-discord-bot
npm install
```
## Configuration
1. Open the `src/config.json` file in a text editor.
2. Set the configuration as follows:
```json
{
  "name": "SectionName",
  "admins": ["AdminID1", "AdminID2..."],
  "image": "ImageURL",
  "emoji": "EmojiString",
  "logchannel": "LogChannelID",
  "role": "RoleID"
}
```
Save the changes to `src/config.json.`
## Usage
Run the bot using:
```
node src/index.js
```
# License
This project is licensed under the MIT License.

# Support
For support, questions, or feature requests, please open an issue in the GitHub issue tracker.
