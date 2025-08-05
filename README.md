# STATICO - AI-Powered Image Analysis & Advertisement Generator

STATICO is a modern web application that uses AI to analyze images and generate professional advertising copy with precise positioning, colors, and typography.

## 🚀 Features

### Frontend (React Native/Expo)
- **Modern UI**: Clean, contemporary design with smooth interactions
- **Image Upload**: Camera and gallery integration with image preview
- **Template Selection**: Multiple advertisement templates (Simple Ad, Discount Ad, Feature Highlight)
- **Real-time Analysis**: Live connection to AI backend for instant results
- **Responsive Design**: Works seamlessly across different screen sizes

### Backend (Python/Flask)
- **AI Integration**: OpenAI GPT-4 Vision for intelligent image analysis
- **Function Calling**: Structured JSON responses with precise positioning data
- **Image Processing**: Base64 encoding/decoding with error handling
- **Template System**: Flexible JSON-based template system
- **Image Composition**: Automatic text overlay with custom fonts and colors

## 🛠️ Tech Stack

### Frontend
- **React Native** with Expo SDK 53
- **TypeScript** for type safety
- **Expo Image Picker** for image selection
- **Ionicons** for beautiful icons
- **Modern UI Components** with custom styling

### Backend
- **Python 3.12** with Flask framework
- **OpenAI GPT-4 Vision** for AI analysis
- **PIL (Pillow)** for image processing
- **CORS** enabled for cross-origin requests
- **JSON Schema** validation for structured responses

## 📁 Project Structure

```
STATICO/
├── app/
│   ├── frontend/                 # React Native/Expo app
│   │   ├── app/
│   │   │   └── index.tsx        # Main UI component
│   │   ├── package.json
│   │   └── app.json
│   └── backend/                  # Python Flask server
│       ├── server.py            # Main Flask application
│       ├── text_gen.py          # AI image analysis
│       ├── image_compose.py     # Image composition
│       ├── load_template.py     # Template loader
│       ├── templates/           # JSON template definitions
│       └── imgs/               # Sample images
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- OpenAI API key

### Backend Setup
```bash
cd app/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the backend directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

Start the backend server:
```bash
python server.py
```

### Frontend Setup
```bash
cd app/frontend
npm install
npx expo start
```

## 📱 Usage

1. **Select Template**: Choose from Simple Ad, Discount Ad, or Feature Highlight
2. **Upload Image**: Use camera or select from gallery
3. **Analyze**: AI analyzes the image and generates advertising copy
4. **View Results**: See the generated text with positioning and styling
5. **Compose Image**: Backend can overlay text on the original image

## 🎨 Templates

### Simple Ad
- Headline with positioning
- Subheadline for support text
- Call-to-action button

### Discount Ad
- Compelling headline
- Discount percentage/amount
- Validity period
- Urgent call-to-action

### Feature Highlight
- Main headline
- Up to 3 feature points
- Price information
- Action button

## 🔧 Configuration

### Backend Configuration
- **Port**: 5000 (configurable in server.py)
- **Host**: 0.0.0.0 for network access
- **CORS**: Enabled for frontend communication

### Frontend Configuration
- **Backend URL**: Update in index.tsx for your server IP
- **Image Quality**: Configurable in image picker settings
- **Timeout**: 30 seconds for API requests

## 🎯 AI Features

### Smart Analysis
- Product/service identification
- Target audience detection
- Benefit-focused copy generation
- Strategic text positioning

### Visual Design
- Automatic color selection for contrast
- Font size hierarchy
- Position optimization
- Professional typography

## 🔒 Security

- Environment variables for API keys
- CORS configuration for secure communication
- Input validation and sanitization
- Error handling and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 Vision API
- Expo team for the excellent development platform
- React Native community for the robust framework

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**STATICO** - Transforming images into compelling advertisements with AI power! ✨ 