# AI Story Generation Setup

## OpenAI API Key Required

To enable dynamic AI story generation (no templates), you need to add your OpenAI API key:

1. **Get an OpenAI API Key:**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key

2. **Add to Environment Variables:**
   - Create or update `.env.local` file in the project root
   - Add this line:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

3. **Restart the Development Server:**
   ```bash
   npm run dev
   ```

## How It Works

- **100% AI Generated**: All story text is generated dynamically by GPT-3.5
- **No Templates**: Zero premade phrases - everything is contextual
- **Ethical Theme**: Stories focus on the moral dilemmas of gradient descent → conquest
- **Context Aware**: Stories adapt to organism behavior, time, evolution level, and energy

## Story Generation Modes

- **Contextual**: Adapts to organism behavior
- **Dynamic**: Real-time consciousness simulation  
- **Philosophical**: Deep ethical exploration
- **Poetic**: Lyrical consciousness expression
- **Technical**: Algorithm-focused narrative
- **Mystical**: Transcendent digital experience

## Fallback

If no API key is provided, stories will be disabled (no templates used).
