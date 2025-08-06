# Static Ads Generator - Web Interface

A modern, beautiful web application for generating professional advertisements using AI-powered image generation.

## 🚀 Features

- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🖼️ Drag & Drop Upload** - Easy image upload with drag and drop functionality
- **🎨 Template Selection** - Choose from multiple ad templates
- **⚡ Real-time Preview** - See your ad as it's being generated
- **💾 Download & Share** - Download generated ads or share them directly
- **🎯 AI-Powered** - Uses advanced AI to create professional advertisements

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Dropzone** - Drag and drop file uploads

## 📦 Installation

1. **Install Node.js** (if not already installed)
   ```bash
   # Download from https://nodejs.org/
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API URL (your Python Flask server)
BACKEND_URL=http://localhost:5000

# Optional: Cloudinary configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Backend Connection

The web app connects to your Python backend at `http://localhost:5000`. Make sure your Flask server is running:

```bash
cd ../backend
python main.py
```

## 📁 Project Structure

```
web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── components/         # React components
│   │   ├── AdPreview.tsx
│   │   ├── ImageUpload.tsx
│   │   └── TemplateSelector.tsx
│   └── types/             # TypeScript types
│       └── index.ts
├── public/                # Static assets
├── package.json
├── tailwind.config.ts
└── next.config.js
```

## 🎨 Components

### ImageUpload
- Drag and drop file upload
- Image preview
- File validation
- Loading states

### TemplateSelector
- Template selection cards
- Visual previews
- Field information
- Selection indicators

### AdPreview
- Generated ad display
- Download functionality
- Share options
- Status indicators

## 🔌 API Integration

The web app communicates with your Python backend through the `/api/generate-ad` route:

```typescript
POST /api/generate-ad
{
  "image": "base64_encoded_image",
  "template": "simple_ad"
}
```

Response:
```json
{
  "success": true,
  "adUrl": "https://cloudinary.com/..."
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables
4. Deploy!

### Other Platforms
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment

## 🎯 Usage

1. **Upload Image** - Drag and drop or click to upload your product image
2. **Select Template** - Choose from Simple Ad, Discount Ad, or Feature Highlight
3. **Generate** - Click the generate button to create your advertisement
4. **Download/Share** - Download the generated ad or share it directly

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify your backend is running
3. Check environment variables
4. Open an issue on GitHub

---

**Built with ❤️ using Next.js and TypeScript** 