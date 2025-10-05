# ShareIt

**Ephemeral, secure, and anonymous file sharing rooms.**

🔗 **Live Demo:** [https://shareit-cvr.vercel.app/](https://shareit-cvr.vercel.app/)

ShareIt is a modern web application that enables users to create private, password-protected rooms for sharing files. Built with security and privacy in mind, it provides a seamless experience for collaborative file sharing without requiring user accounts or personal information.

## Features

- **🔒 Secure Rooms**: Create password-protected rooms with dual-layer security (access password + delete password)
- **📤 File Sharing**: Upload and share files of any type with room members
- **🔍 Smart Filtering**: Search and filter files by name and category (Images, Videos, Docs, Archives, Others)
- **🎨 Modern UI**: Clean, responsive interface with dark mode support
- **⚡ Real-time Updates**: Automatically refresh file lists to show new uploads
- **🗑️ Controlled Deletion**: Separate delete password ensures only authorized users can remove files
- **🌐 No Authentication Required**: Join rooms instantly without creating an account
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎬 Dynamic Backgrounds**: Rotating video backgrounds with accessibility support

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account for backend storage

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shareit.git
cd shareit
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
Run the following SQL in your Supabase SQL editor:

```sql
   -- Create rooms table
   CREATE TABLE IF NOT EXISTS rooms (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     room_name VARCHAR(100) NOT NULL UNIQUE,
     room_password VARCHAR(255) NOT NULL,
     delete_password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create files table
   CREATE TABLE IF NOT EXISTS files (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     file_name VARCHAR(255) NOT NULL,
     file_type VARCHAR(100) NOT NULL,
     file_size BIGINT DEFAULT 0,
     upload_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     storage_url TEXT NOT NULL,
     room_name VARCHAR(100) NOT NULL REFERENCES rooms(room_name) ON DELETE CASCADE
   );

   -- Create indexes for better performance
   CREATE INDEX IF NOT EXISTS idx_rooms_name ON rooms(room_name);
   CREATE INDEX IF NOT EXISTS idx_files_room ON files(room_name);
   CREATE INDEX IF NOT EXISTS idx_files_upload_time ON files(upload_time);

   -- Enable Row Level Security
   ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
   ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on rooms" ON rooms FOR ALL USING (true);
CREATE POLICY "Allow all operations on files" ON files FOR ALL USING (true);
```

5. Set up Supabase Storage:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `files`
   - Make the bucket public

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a Room

1. Click **Create Room** on the landing page
2. Enter a unique room name
3. Set an access password (for joining the room)
4. Set a delete password (for managing files)
5. Click **Create Room** to enter

### Joining a Room

1. Click **Join Room** on the landing page
2. Enter the room name
3. Provide the access password
4. Click **Join Room** to enter

### Sharing Files

1. Once inside a room, drag and drop files or click to browse
2. Files are automatically categorized and displayed in the room
3. Use the search bar to find specific files
4. Apply filters to view files by category

### Managing Files

1. Click the key icon in the header
2. Enter the delete password to enable delete mode
3. Delete unwanted files while in delete mode
4. Disable delete mode when finished

## Project Structure

```
shareit/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── background/   # Video background components
│   │   ├── Dashboard.tsx # Main dashboard view
│   │   ├── FileCard.tsx  # File display component
│   │   ├── FileUpload.tsx# File upload component
│   │   └── LandingPage.tsx # Landing page
│   ├── context/          # React context providers
│   ├── lib/              # Utilities and types
│   └── styles/           # Global styles
├── public/               # Static assets
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Remove build artifacts

## Security Considerations

- All rooms are password-protected with separate access and delete passwords
- Files are stored securely using Supabase storage
- No user data or personal information is collected
- Rooms are ephemeral and can be deleted at any time

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Next.js team for the excellent framework
- Supabase for backend infrastructure
- Vercel for hosting and deployment
- Lucide for the beautiful icon set

---

**Built with Next.js and Supabase**