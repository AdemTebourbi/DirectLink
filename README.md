# DirectLink
**Direct Link Application Summary:**

Direct Link is a file-sharing application designed for local network use. It opens two HTTP services, one for administration (port 3000) and another for accessing shared files (port 3001). Users set up the application by creating a virtual server on port 3001 in their router settings.

Upon launching the app, users access the administration interface at http://localhost:3000 to create shared directories. They specify a sharing name, local directory, and a password for access. The app generates a unique link for sharing files with others. Shared directories are accessible through this link, displaying a user-friendly file explorer interface.

Users can manage their shared directories through the administration interface, with options to delete and stop sharing specific directories. The application prioritizes security with password protection and ensures persistence by saving created sharings on the user's device. Overall, Direct Link simplifies local file sharing, promoting collaboration within a networked environment.
