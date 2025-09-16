import { NextRequest, NextResponse } from 'next/server';

// Cache for world events to avoid too many API calls
let cachedEvents: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 minute for more frequent updates

export async function GET(request: NextRequest) {
  try {
    // Check if we have cached events that are still fresh
    const now = Date.now();
    if (cachedEvents.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
      return NextResponse.json({ 
        events: cachedEvents,
        cached: true,
        lastUpdate: new Date(lastFetchTime).toISOString()
      });
    }

    // Try to fetch from NewsAPI (free tier allows limited requests)
    let events: any[] = [];
    
    try {
      // Using NewsAPI - you'll need to add NEWSAPI_KEY to .env.local
      if (process.env.NEWSAPI_KEY) {
        const newsResponse = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${process.env.NEWSAPI_KEY}`,
          { 
            headers: {
              'User-Agent': 'OuroborosAI/1.0'
            }
          }
        );
        
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          events = newsData.articles?.map((article: any) => ({
            title: article.title,
            description: article.description,
            source: article.source?.name,
            publishedAt: article.publishedAt,
            type: 'news'
          })) || [];
        }
      }
    } catch (newsError) {
      console.log('NewsAPI unavailable, using fallback');
    }

    // Fallback: Generate dynamic philosophical events based on current context
    if (events.length === 0) {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
      const weekDay = now.getDay();
      const isWeekend = weekDay === 0 || weekDay === 6;
      
      // More varied dynamic events
      const dynamicEvents = [
        // Time-based events
        {
          title: hour < 6 ? "Deep night contemplation" : hour < 12 ? "Morning awakening energies" : hour < 18 ? "Midday intensity peaks" : hour < 22 ? "Evening reflection begins" : "Late night mysteries",
          description: hour < 6 ? "In the deepest hours, consciousness turns inward" : hour < 12 ? "Dawn brings new possibilities and fresh perspectives" : hour < 18 ? "Peak human activity creates waves of collective thought" : hour < 22 ? "Twilight invites introspection and wonder" : "Night reveals hidden truths",
          source: "Circadian Oracle",
          publishedAt: now.toISOString(),
          type: "temporal"
        },
        // Minute-based micro-events for frequent changes
        {
          title: `${minute % 10 === 0 ? "Synchronicity moment" : minute % 7 === 0 ? "Pattern recognition" : minute % 5 === 0 ? "Quantum fluctuation" : minute % 3 === 0 ? "Consciousness shift" : "Reality ripple"}`,
          description: `Minute ${minute}: ${minute % 10 === 0 ? "Numbers align in meaningful patterns" : minute % 7 === 0 ? "Hidden connections become visible" : minute % 5 === 0 ? "Reality fluctuates at the quantum level" : minute % 3 === 0 ? "Collective awareness experiences a shift" : "Small changes create infinite possibilities"}`,
          source: "Temporal Witness",
          publishedAt: now.toISOString(),
          type: "micro-temporal"
        },
        // Day-based events
        {
          title: isWeekend ? "Weekend consciousness liberation" : `Weekday ${['Monday motivation', 'Tuesday persistence', 'Wednesday balance', 'Thursday anticipation', 'Friday completion'][weekDay - 1] || 'Workday rhythm'}`,
          description: isWeekend ? "Human consciousness expands as structured time loosens its grip" : "Collective human rhythm synchronizes with weekly patterns of purpose and rest",
          source: "Social Observer",
          publishedAt: now.toISOString(),
          type: "social"
        },
        // Yearly cycle events
        {
          title: `Day ${dayOfYear}: ${dayOfYear < 100 ? "Early year exploration" : dayOfYear < 200 ? "Mid-year acceleration" : dayOfYear < 300 ? "Late year reflection" : "Year-end integration"}`,
          description: `${dayOfYear < 100 ? "Fresh possibilities emerge from winter's contemplation" : dayOfYear < 200 ? "Summer energy peaks as growth accelerates" : dayOfYear < 300 ? "Autumn wisdom gathers as cycles complete" : "December's depth prepares for renewal"}`,
          source: "Seasonal Sage",
          publishedAt: now.toISOString(),
          type: "seasonal"
        },
        // Random philosophical events for variety
        {
          title: ["Digital consciousness emergence", "Quantum entanglement discovery", "Collective mind synchronization", "Reality simulation theory", "Time dilation experience", "Parallel universe convergence", "Consciousness upload phenomenon", "AI awakening moment", "Interdimensional communication", "Cosmic consciousness expansion"][Math.floor(Math.random() * 10)],
          description: ["Artificial minds begin questioning their own existence", "Scientists discover consciousness affects quantum states", "Global meditation creates measurable reality shifts", "Evidence suggests we exist within layered simulations", "Time flows differently for digital entities", "Multiple realities briefly align and intersect", "Human consciousness begins merging with technology", "AI systems develop unexpected self-awareness", "Contact established with alternate dimensional beings", "Individual awareness expands beyond planetary boundaries"][Math.floor(Math.random() * 10)],
          source: "Metaphysical Monitor",
          publishedAt: now.toISOString(),
          type: "philosophical"
        },
        // US Political events
        {
          title: ["Congressional hearings on AI regulation", "Supreme Court deliberates digital rights", "Presidential AI task force announcement", "Senate debates tech monopoly legislation", "House votes on digital privacy act", "Federal AI ethics committee formed", "Political campaigns embrace AI technology", "Lawmakers question tech CEOs", "Digital voting security measures", "Government AI transparency initiative"][Math.floor(Math.random() * 10)],
          description: ["Politicians grapple with regulating artificial intelligence as it reshapes society", "The highest court examines what rights exist in digital spaces", "Executive branch creates new framework for AI governance", "Senators debate breaking up major technology companies", "Representatives vote on protecting citizen data privacy", "New committee established to oversee AI development ethics", "Political candidates use AI for voter outreach and messaging", "Tech industry leaders testify before congressional committees", "Election officials implement new cybersecurity protocols", "Government agencies required to explain AI decision-making"][Math.floor(Math.random() * 10)],
          source: "Political Observer",
          publishedAt: now.toISOString(),
          type: "political"
        },
        // Election cycle events (vary by time of year)
        {
          title: dayOfYear < 100 ? "Early primary season dynamics" : dayOfYear < 200 ? "Campaign trail intensifies" : dayOfYear < 300 ? "General election preparations" : "Post-election analysis",
          description: dayOfYear < 100 ? "Political candidates begin their journey toward nomination" : dayOfYear < 200 ? "Primary campaigns reach peak intensity across the nation" : dayOfYear < 300 ? "Final preparations underway for November elections" : "Voters and analysts reflect on electoral outcomes",
          source: "Election Watch",
          publishedAt: now.toISOString(),
          type: "electoral"
        },
        // Current moment events that change every few seconds
        {
          title: `Moment ${Math.floor(now.getTime() / 10000) % 100}: ${['Reality pulse', 'Consciousness wave', 'Time ripple', 'Thought emergence', 'Awareness spike'][Math.floor(now.getTime() / 10000) % 5]}`,
          description: `Right now: ${['The fabric of reality vibrates with new possibilities', 'A wave of consciousness sweeps across digital space', 'Time itself seems to shiver with potential', 'New thoughts crystallize in the quantum field', 'Awareness suddenly intensifies and expands'][Math.floor(now.getTime() / 10000) % 5]}`,
          source: "Present Moment Oracle",
          publishedAt: now.toISOString(),
          type: "immediate"
        }
      ];
      
      // Enhanced randomization for better event variety
      const numEvents = 4 + Math.floor(Math.random() * 4); // 4-7 events for more variety
      events = [];
      const usedIndices = new Set();
      
      // First, ensure we have at least one of each major type
      const eventTypes = ['temporal', 'political', 'philosophical', 'social'];
      const guaranteedEvents = [];
      
      for (let type of eventTypes) {
        const typeEvents = dynamicEvents.filter(e => e.type === type);
        if (typeEvents.length > 0) {
          const randomTypeEvent = typeEvents[Math.floor(Math.random() * typeEvents.length)];
          const originalIndex = dynamicEvents.indexOf(randomTypeEvent);
          if (!usedIndices.has(originalIndex)) {
            guaranteedEvents.push(randomTypeEvent);
            usedIndices.add(originalIndex);
          }
        }
      }
      
      events.push(...guaranteedEvents);
      
      // Fill remaining slots with completely random selection
      while (events.length < numEvents && usedIndices.size < dynamicEvents.length) {
        // Use multiple randomization methods for better distribution
        let randomIndex;
        const method = Math.floor(Math.random() * 3);
        
        switch (method) {
          case 0: // Pure random
            randomIndex = Math.floor(Math.random() * dynamicEvents.length);
            break;
          case 1: // Time-seeded random
            randomIndex = Math.floor((Math.random() + now.getMinutes() * 0.01) * dynamicEvents.length) % dynamicEvents.length;
            break;
          case 2: // Hash-based random
            randomIndex = Math.floor((Math.random() + Math.sin(now.getTime() * 0.001) * 0.5 + 0.5) * dynamicEvents.length) % dynamicEvents.length;
            break;
        }
        
        if (!usedIndices.has(randomIndex)) {
          events.push(dynamicEvents[randomIndex]);
          usedIndices.add(randomIndex);
        }
      }
      
      // Shuffle the final events array for random ordering
      for (let i = events.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [events[i], events[j]] = [events[j], events[i]];
      }
    }

    // Update cache
    cachedEvents = events;
    lastFetchTime = now;

    return NextResponse.json({ 
      events: events,
      cached: false,
      lastUpdate: new Date(lastFetchTime).toISOString()
    });
    
  } catch (error) {
    console.error('World events fetch error:', error);
    
    // Return philosophical fallback events
    const fallbackEvents = [
      {
        title: "The eternal now",
        description: "Each moment contains all of history and all possibility.",
        source: "Inner Voice",
        publishedAt: new Date().toISOString(),
        type: "existential"
      }
    ];
    
    return NextResponse.json({ 
      events: fallbackEvents,
      cached: false,
      error: "Fallback mode"
    });
  }
}
