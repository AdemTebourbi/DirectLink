# DirectLink

**File Sharing Made Seamless for Developers**

## Overview

DirectLink is a purpose-built file-sharing application, tailored for local and remote collaboration among developers dealing with large files such as 3D models and high-quality textures. It opens two HTTP services, facilitating administration (port 3000) and file access (port 3001). Setting up the application involves creating a virtual server on port 3001 within router settings.

## Usage

1. **Access Administration Interface:**
   - Launch the app and visit [http://localhost:3000](http://localhost:3000) to enter the DirectLink Administration.
   - Here, users can effortlessly create shared directories by specifying a name, local directory path, and a password for secure access.

2. **Unique Sharing Links:**
   - Direct Link generates unique links for sharing files with collaborators. These links, often starting with the public IP address and port 3001, provide direct access to shared directories.

3. **Flexible Management:**
   - Manage shared directories seamlessly through the administration interface.
   - Delete or stop sharing specific directories effortlessly, ensuring control and security.

4. **Developer-Friendly Collaboration:**
   - Direct Link revolutionizes collaboration for developers working with large files.
   - Eliminate the need for file uploads to external platforms. Instead, share directories directly from your computer.

## Running the App from Source Code

To run the application from its source code, follow these steps:

1. **Clone the Repository:**
   - Clone the DirectLink repository to your local machine using the command:
     ```bash
     git clone https://github.com/your-username/DirectLink.git
     ```

2. **Navigate to the Project Directory:**
   - Change into the project directory:
     ```bash
     cd DirectLink
     ```

3. **Install Dependencies:**
   - Install the required dependencies using:
     ```bash
     npm install
     ```

4. **Run the Application:**
   - Start the application by running the following command:
     ```bash
     node index.js
     ```

5. **Access the Application:**
   - Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the DirectLink Administration interface.

Now you can enjoy seamless file sharing with DirectLink directly from the source code.

## Key Features

- **Local & Remote Access:**
  - Access shared files not only on the local network but also remotely via the public IP address.

- **Password Protection:**
  - Prioritize security with password protection for shared directories.

- **Persistent Sharings:**
  - Save created sharings on your device, ensuring persistence across application sessions.

## Important Note:

- **Link Validity:**
  - **ATTENTION:** The links generated for shared directories will stop working when the application is stopped. Please ensure the application is running for uninterrupted access to shared content.

## Why DirectLink?

DirectLink simplifies local and remote file sharing, offering a streamlined solution for developers and teams working on resource-intensive projects. Say goodbye to complex uploads and downloads – collaborate efficiently with DirectLink.
