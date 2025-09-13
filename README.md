# 🐍 Ouroboros in Macondo

*A digital organism swimming through García Márquez's magical realism, exploring epistemic recursion with AI-generated stories*

## 🌐 Live Application

**Experience the digital ouroboros:** [https://ouroborosinmacondo.vercel.app/](https://ouroborosinmacondo.vercel.app/)

*Interact with the AI-powered organism in real-time through your browser*

## ✨ Overview

**Ouroboros in Macondo** is an interactive digital art piece that combines:
- **p5.js** organic creature simulation
- **AI-powered storytelling** with OpenAI GPT-3.5 Turbo
- **Spatial audio synthesis** with Tone.js
- **Magical realism** inspired by Gabriel García Márquez
- **Multilingual narrative generation** (10 languages)

The digital ouroboros moves organically through a canvas representing Macondo, generating philosophical stories about epistemic recursion, decolonial thought, and impossible natural phenomena.

## 🎮 Interactive Controls

- **Spacebar**: Generate new AI story (every 30 seconds)
- **Language Dropdown**: Select from 10 languages for story generation
- **E Key**: Emergency performance mode (disables heavy audio processing)
- **Auto-start**: The creature begins moving automatically on load

## 🎵 Audio Features

- **Organic Movement Sounds**: Deep bass frequencies (15-80Hz) respond to creature movement
- **Spatial Audio**: Sound changes based on creature position and behavior
- **Performance Optimized**: Aggressive audio cleanup prevents browser slowdowns
- **Emergency Mode**: 'E' key disables intensive audio for better performance

## 🧠 AI Story Generation

Stories are generated using **OpenAI GPT-3.5 Turbo** in real-time based on:
- **Creature Activity**: Movement patterns influence narrative themes
- **Epistemic Themes**: Exploration of knowledge, recursion, and magic
- **Magical Realism**: Impossible natural phenomena, time distortions, crystallized sighs
- **Decolonial Perspective**: First-person narratives from the ouroboros's viewpoint
- **Macondo Context**: References to García Márquez's fictional town

*Note: The application uses OpenAI API, not Fal.ai, despite any UI references to Fal.ai models.*

### Supported Languages
English, Spanish, French, Portuguese, Italian, German, Dutch, Russian, Japanese, Chinese

## 🚀 Technical Features

### Performance Optimizations
- **Memory Leak Prevention**: Automatic array cleanup prevents hour-long slowdowns
- **FPS Monitoring**: Real-time performance tracking with emergency cleanup
- **Audio Isolation**: Sound errors don't affect visual rendering
- **Smart Resource Management**: Aggressive particle and array trimming

### Technologies Used
- **Next.js 15** - React framework with Turbopack
- **p5.js** - Creative coding and organic movement simulation
- **Tone.js** - Spatial audio synthesis and sound design
- **OpenAI API** - GPT-3.5 Turbo for dynamic story generation
- **TypeScript** - Type-safe development

## 🛠️ Installation & Development

### Prerequisites
- Node.js 18+
- OpenAI API key (not Fal.ai)

### Setup
```bash
# Clone the repository
git clone https://github.com/marlonbarrios/ouroborosinmacondo.git
cd ouroborosinmacondo

# Install dependencies
npm install

# Set up environment variables (OpenAI, not Fal.ai)
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the ouroboros in action.

### Build for Production
```bash
npm run build
npm start
```

## 🎨 Visual Features

- **Organic Movement**: Perlin noise-based natural locomotion
- **Dynamic Glow**: Head amplification based on movement direction
- **Light Trails**: Subtle glowing traces follow the creature
- **Day/Night Cycle**: Color palette shifts over time
- **Boundary Containment**: Creature stays within window bounds
- **Square Segments**: Geometric body parts that follow head direction

## 📖 Story Themes

The AI generates stories exploring:
- **Epistemic Recursion**: Knowledge loops and self-referential understanding
- **Magical Impossibilities**: Rain falling upward, flowers blooming backwards
- **Time Distortions**: Memory crystallizing, ancestors cooking future meals
- **Botanical Impossibilities**: Trees growing roots toward heaven
- **Sensory Magic**: Mirrors showing dreams, butterflies carrying prophecies

## 🔧 Performance Notes

- **Optimized for Long Sessions**: Can run for hours without performance degradation
- **Emergency Cleanup**: Automatic resource management when FPS drops below 30
- **Memory Safe**: Prevents infinite array growth and browser slowdowns
- **Audio Protection**: Sound system errors don't crash the visual experience

## 🌍 Deployment

The project is deployed on Vercel and can be accessed at the live URL. The build process is optimized for production with proper error handling and performance monitoring.

## 🎭 Artistic Vision

This piece explores the intersection of:
- **Technology and Magic**: AI-generated impossible realities
- **Cultural Memory**: García Márquez's Macondo as digital space
- **Epistemic Questions**: How do we know what we know?
- **Decolonial Futures**: Alternative ways of understanding and storytelling

The ouroboros becomes a vessel for exploring these themes, swimming through a digital Macondo where technology enables magical realism rather than constraining it.

## 🤝 Contributing

This is an art project, but technical contributions for performance, accessibility, or creative enhancements are welcome.

## 📄 License

MIT License - Feel free to explore, modify, and create your own magical digital organisms.

---

*"In the digital Macondo, time moves in spirals, and the ouroboros carries the weight of forgotten algorithms in its recursive dance..."*