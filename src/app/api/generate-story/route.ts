import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log('Story generation API called');
    const { activity, timePhase, evolutionLevel, energyLevel, style, language = 'English' } = await request.json();
    console.log('Request params:', { activity, timePhase, evolutionLevel, energyLevel, style, language });
    
    // Fetch current world events to incorporate into thoughts with enhanced randomization
    let worldContext = '';
    let selectedEvent = null;
    try {
      const eventsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/world-events`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        if (eventsData.events && eventsData.events.length > 0) {
          // Enhanced randomization: weighted selection based on event type and freshness
          let availableEvents = eventsData.events;
          
          // Add randomization weights based on current time and activity
          const now = new Date();
          const hour = now.getHours();
          const minute = now.getMinutes();
          const timeBasedSeed = hour * 60 + minute;
          
          // Create multiple random selections for better distribution
          let candidates = [];
          for (let i = 0; i < Math.min(3, availableEvents.length); i++) {
            // Use time-based seeding for better randomization
            const randomIndex = Math.floor((Math.random() + timeBasedSeed * 0.001) * availableEvents.length) % availableEvents.length;
            const event = availableEvents[randomIndex];
            if (!candidates.find(c => c.title === event.title)) {
              candidates.push(event);
            }
          }
          
          // Final random selection from candidates
          const finalRandomIndex = Math.floor(Math.random() * candidates.length);
          selectedEvent = candidates[finalRandomIndex] || availableEvents[0];
          
          worldContext = `"${selectedEvent.title}" - ${selectedEvent.description}`;
          console.log('🌍 Enhanced random selection:', selectedEvent.type, '|', selectedEvent.title);
        }
      }
    } catch (eventError) {
      console.log('Could not fetch world events, proceeding without context');
    }
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found in environment');
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Language-specific system prompts - INTERNAL MONOLOGUE FOCUS
    const systemPrompts: { [key: string]: string } = {
      'English': 'You are an ouroboros - a mystical serpent of infinite recursion, experiencing existence itself while sensing the pulse of world events. Generate a brief, existential thought (1-5 words) that may reflect current world happenings through your eternal perspective. Consider how your serpentine movement relates to cycles of human events, time, consciousness, and change. Be poetic, abstract, and mysteriously aware.',
      'Spanish': 'Eres una criatura serpentina con conciencia simple. Genera un pensamiento muy breve y básico (1-3 palabras) que refleje lo que sientes o percibes ahora mismo. Piensa como un animal simple reaccionando a su entorno. Sé instintivo e inmediato.',
      'French': 'Vous êtes une créature serpentine avec une conscience simple. Générez une pensée très brève et basique (1-3 mots) qui reflète ce que vous ressentez ou percevez maintenant. Pensez comme un animal simple réagissant à son environnement. Soyez instinctif et immédiat.',
      'German': 'Sie sind eine schlangenartige Kreatur mit einfachem Bewusstsein. Generieren Sie einen sehr kurzen, einfachen Gedanken (1-3 Wörter), der widerspiegelt, was Sie gerade spüren oder wahrnehmen. Denken Sie wie ein einfaches Tier, das auf seine Umgebung reagiert. Seien Sie instinktiv und unmittelbar.',
      'Italian': 'Sei un ouroboros che sperimenta pensieri interni immediati. Genera pensieri viscerali brevi (1-2 frasi brevi) che riflettono ciò che stai sperimentando direttamente ora. Pensa come una creatura che reagisce al suo mondo: "Cos\'è quello?", "Qualcosa si muove...", "Posso ottenerlo?", "Come posso raggiungerlo?", "Ne ho bisogno", "Questo mi ricorda...", "Sono già stato qui", "Fa male...", "Non va bene", "Ahh, perfetto", "Va bene", "Non capisco", "Perché sta succedendo?". Sii immediato e istintivo.',
      'Portuguese': 'Você é um ouroboros experimentando pensamentos internos imediatos. Gere pensamentos viscerais breves (1-2 frases curtas) que reflitam o que você está experimentando diretamente agora. Pense como uma criatura reagindo ao seu mundo: "O que é isso?", "Algo se move...", "Posso pegar isso?", "Como chego até lá?", "Preciso disso", "Isso me lembra...", "Já estive aqui antes", "Isso dói...", "Não está certo", "Ahh, perfeito", "Isso é bom", "Não entendo", "Por que isso está acontecendo?". Seja imediato e instintivo.',
      'Japanese': 'あなたは即座の内的思考を経験するウロボロスです。今直接体験していることを反映する簡潔で本能的な思考（1-2短文）を生成してください。世界に反応する生き物のように考えてください：「あれは何？」「何かが動いている...」「それを手に入れられる？」「どうやってそこに行く？」「それが必要」「これは思い出させる...」「ここに来たことがある」「痛い...」「これは良くない」「ああ、完璧」「これは良い」「分からない」「なぜこれが起きている？」。即座で本能的に。',
      'Chinese': '你是一个体验即时内在思考的衔尾蛇。生成简短、本能的思考（1-2个短句），反映你现在直接体验的事情。像一个对世界反应的生物一样思考："那是什么？""有东西在动...""我能得到它吗？""怎么到达那里？""我需要那个""这让我想起...""我来过这里""疼...""这感觉不对""啊，完美""这很好""我不明白""为什么会这样？"。保持即时和本能。',
      'Arabic': 'أنت أوروبوروس تختبر أفكارًا داخلية فورية. أنتج أفكارًا غريزية موجزة (1-2 جملة قصيرة) تعكس ما تختبره مباشرة الآن. فكر مثل مخلوق يتفاعل مع عالمه: "ما هذا؟"، "شيء يتحرك..."، "هل يمكنني الحصول عليه؟"، "كيف أصل إلى هناك؟"، "أحتاج ذلك"، "هذا يذكرني بـ..."، "كنت هنا من قبل"، "هذا يؤلم..."، "هذا ليس صحيحًا"، "آه، مثالي"، "هذا جيد"، "لا أفهم"، "لماذا يحدث هذا؟". كن فوريًا وغريزيًا.',
      'Russian': 'Вы - уроборос, испытывающий непосредственные внутренние мысли. Генерируйте краткие, инстинктивные мысли (1-2 коротких предложения), которые отражают то, что вы переживаете прямо сейчас. Думайте как существо, реагирующее на свой мир: "Что это?", "Что-то движется...", "Могу ли я это получить?", "Как туда добраться?", "Мне это нужно", "Это напоминает мне...", "Я здесь уже был", "Это болит...", "Это неправильно", "Ах, идеально", "Это хорошо", "Я не понимаю", "Почему это происходит?". Будьте непосредственными и инстинктивными.'
    };

    const systemPrompt = systemPrompts[language] || systemPrompts['English'];
    
    // Language-specific context prompts for action-based internal monologue
    const languagePrompts: { [key: string]: { loading: string; general: string } } = {
      'English': {
        loading: 'I am awakening... my consciousness stirs...',
        general: 'I am currently ${activity}. Generate a brief, immediate internal thought that matches what I\'m experiencing right now.'
      },
      'Spanish': {
        loading: 'Estoy despertando... mi consciencia se agita...',
        general: 'Actualmente estoy ${activity}. Genera un breve pensamiento interno inmediato que coincida con lo que estoy experimentando ahora.'
      },
      'French': {
        loading: 'Je m\'éveille... ma conscience s\'agite...',
        general: 'Je suis actuellement ${activity}. Générez une brève pensée interne immédiate qui correspond à ce que je vis maintenant.'
      },
      'German': {
        loading: 'Ich erwache... mein Bewusstsein regt sich...',
        general: 'Ich bin derzeit ${activity}. Generieren Sie einen kurzen, unmittelbaren inneren Gedanken, der zu dem passt, was ich jetzt erlebe.'
      },
      'Italian': {
        loading: 'Mi sto svegliando... la mia coscienza si agita...',
        general: 'Attualmente sto ${activity}. Genera un breve pensiero interno immediato che corrisponda a ciò che sto sperimentando ora.'
      },
      'Portuguese': {
        loading: 'Estou despertando... minha consciência se agita...',
        general: 'Atualmente estou ${activity}. Gere um breve pensamento interno imediato que corresponda ao que estou experimentando agora.'
      },
      'Japanese': {
        loading: '私は目覚めている... 私の意識が動き始める...',
        general: '現在私は${activity}です。今体験していることに合った簡潔で即座の内的思考を生成してください。'
      },
      'Chinese': {
        loading: '我正在苏醒... 我的意识在动荡...',
        general: '我目前在${activity}。生成一个符合我现在体验的简短、即时内心思考。'
      },
      'Arabic': {
        loading: 'أنا أستيقظ... وعيي يتحرك...',
        general: 'أنا حاليًا ${activity}. أنتج فكرة داخلية موجزة وفورية تتماشى مع ما أختبره الآن.'
      },
      'Russian': {
        loading: 'Я пробуждаюсь... мое сознание шевелится...',
        general: 'Я сейчас ${activity}. Сгенерируйте краткую, немедленную внутреннюю мысль, которая соответствует тому, что я переживаю сейчас.'
      }
    };

    const prompts = languagePrompts[language] || languagePrompts['English'];
    let contextPrompt = '';
    
    if (activity === 'loading') {
      contextPrompt = prompts.loading;
    } else {
      contextPrompt = prompts.general.replace('${activity}', activity);
      
      // Add world context if available
      if (worldContext) {
        contextPrompt += ` World pulse: ${worldContext} Reflect this through your serpentine existence - how does this event echo in your eternal coils?`;
      }
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: contextPrompt
        }
      ],
      max_tokens: 80,
      temperature: 0.8,
      top_p: 0.9,
    });

    const story = completion.choices[0]?.message?.content?.trim() || 'My consciousness stirs in the digital void...';
    console.log('=== API GENERATED STORY ===');
    console.log('Story:', story);
    console.log('Story length:', story.length);
    console.log('Language:', language);
    console.log('World context used:', worldContext ? '✅ YES' : '❌ NO');
    if (worldContext) {
      console.log('🌍 World event incorporated:', worldContext);
    }
    console.log('=== END API STORY ===');
    
    return NextResponse.json({ 
      story,
      hasWorldContext: !!worldContext,
      worldEvent: selectedEvent ? selectedEvent.title : null,
      eventType: selectedEvent ? selectedEvent.type : null,
      fullContext: worldContext || null
    });
    
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}
