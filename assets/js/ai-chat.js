// ===== AI CHAT ASSISTANT =====

class AIChatAssistant {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.init();
    }

    init() {
        this.bindEvents();
        this.addWelcomeMessage();
    }

    bindEvents() {
        const chatToggle = document.getElementById('chatToggle');
        const chatClose = document.getElementById('chatClose');
        const sendMessage = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatInput');
        const quickQuestions = document.querySelectorAll('.quick-question');

        chatToggle?.addEventListener('click', () => this.toggleChat());
        chatClose?.addEventListener('click', () => this.closeChat());
        sendMessage?.addEventListener('click', () => this.sendUserMessage());
        
        chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendUserMessage();
            }
        });

        quickQuestions.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.sendUserMessage(question);
            });
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById('chatWindow');
        const chatBadge = document.getElementById('chatBadge');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatWindow?.classList.add('active');
            chatBadge?.style.setProperty('display', 'none');
        } else {
            chatWindow?.classList.remove('active');
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chatWindow');
        chatWindow?.classList.remove('active');
        this.isOpen = false;
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            content: "Hello! I'm here to help you learn about Didmus Barasa's vision for Bungoma County. Ask me anything about his policies, background, or how to get involved!",
            timestamp: new Date()
        };
        this.messages.push(welcomeMessage);
    }

    sendUserMessage(messageText = null) {
        const chatInput = document.getElementById('chatInput');
        const message = messageText || chatInput?.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage('user', message);
        
        // Clear input
        if (chatInput && !messageText) {
            chatInput.value = '';
        }

        // Show typing indicator
        this.showTypingIndicator();

        // Generate bot response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage('bot', response);
        }, 1000 + Math.random() * 1000); // Random delay for realism
    }

    addMessage(type, content) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}-message`;
        
        const avatarSrc = type === 'bot' ? 'assets/images/didmus-avatar.jpg' : 'assets/images/user-avatar.png';
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                <img src="${avatarSrc}" alt="${type}">
            </div>
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add to messages array
        this.messages.push({
            type,
            content,
            timestamp: new Date()
        });
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const typingElement = document.createElement('div');
        typingElement.className = 'message bot-message typing-indicator';
        typingElement.id = 'typingIndicator';
        
        typingElement.innerHTML = `
            <div class="message-avatar">
                <img src="assets/images/didmus-avatar.jpg" alt="bot">
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        typingIndicator?.remove();
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Intent detection
        const intent = this.detectIntent(message);
        
        switch (intent) {
            case 'greeting':
                return this.getGreetingResponse();
            case 'about':
                return this.getAboutResponse();
            case 'policies':
                return this.getPoliciesResponse();
            case 'agriculture':
                return this.getAgricultureResponse();
            case 'youth':
                return this.getYouthResponse();
            case 'healthcare':
                return this.getHealthcareResponse();
            case 'infrastructure':
                return this.getInfrastructureResponse();
            case 'education':
                return this.getEducationResponse();
            case 'volunteer':
                return this.getVolunteerResponse();
            case 'donate':
                return this.getDonateResponse();
            case 'contact':
                return this.getContactResponse();
            case 'events':
                return this.getEventsResponse();
            case 'experience':
                return this.getExperienceResponse();
            case 'vision':
                return this.getVisionResponse();
            default:
                return this.getDefaultResponse();
        }
    }

    detectIntent(message) {
        const intents = {
            greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
            about: ['about', 'who are you', 'tell me about', 'biography', 'background'],
            policies: ['policies', 'agenda', 'manifesto', 'plans', 'what will you do'],
            agriculture: ['agriculture', 'farming', 'farmers', 'crops', 'food security'],
            youth: ['youth', 'young people', 'employment', 'jobs', 'opportunities'],
            healthcare: ['health', 'medical', 'hospital', 'clinic', 'healthcare'],
            infrastructure: ['roads', 'infrastructure', 'electricity', 'water', 'connectivity'],
            education: ['education', 'schools', 'learning', 'students', 'teachers'],
            volunteer: ['volunteer', 'help', 'join', 'support', 'get involved'],
            donate: ['donate', 'contribution', 'fund', 'money', 'support financially'],
            contact: ['contact', 'reach', 'phone', 'email', 'address'],
            events: ['events', 'rally', 'meeting', 'campaign', 'schedule'],
            experience: ['experience', 'qualifications', 'work', 'career', 'achievements'],
            vision: ['vision', 'future', 'goals', 'objectives', 'dreams']
        };

        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return intent;
            }
        }

        return 'default';
    }

    getGreetingResponse() {
        const greetings = [
            "Hello! I'm excited to share Didmus Barasa's vision for Bungoma County with you. What would you like to know?",
            "Hi there! Welcome to our campaign. I'm here to answer any questions about Didmus Barasa and his plans for Bungoma.",
            "Greetings! Thank you for your interest in our campaign. How can I help you learn more about Didmus Barasa?"
        ];
        return this.getRandomResponse(greetings);
    }

    getAboutResponse() {
        return `Didmus Wekesa Barasa is a seasoned leader with deep roots in Bungoma County. He holds a Master's in Public Administration from Mount Kenya University and a Bachelor's in Electrical & Electronic Engineering from JKUAT. 

He has served as MP for Kimilili since 2017 and has extensive experience in both public and private sectors, including work with Kenya Power, Shell Co. Ltd, and Bollore Africa Logistics. His military background as an Avionics Tech in the Kenya Armed Forces instilled in him the discipline and values that guide his leadership today.

Would you like to know more about his specific achievements or policies?`;
    }

    getPoliciesResponse() {
        return `Didmus Barasa's agenda focuses on six key areas:

🌾 **Agriculture & Food Security** - Subsidized inputs, modern farming techniques, and market linkages
👥 **Youth Empowerment** - Tech hubs, vocational training, and startup funding
🏥 **Healthcare Access** - Improved facilities, digital health systems, and community clinics
🛣️ **Infrastructure Development** - Better roads, reliable electricity, and digital connectivity
🎓 **Education Excellence** - Scholarships, improved facilities, and digital learning
⚖️ **Good Governance** - Transparent budgets, digital services, and anti-corruption measures

Which area interests you most?`;
    }

    getAgricultureResponse() {
        return `Agriculture is the backbone of Bungoma's economy, and Didmus has comprehensive plans:

• **Subsidized Farm Inputs** - Affordable seeds, fertilizers, and equipment
• **Modern Irrigation** - Water systems for year-round farming
• **Market Linkages** - Direct connections between farmers and buyers
• **Value Addition** - Processing facilities to increase crop value
• **Agricultural Extension** - Technical support and training for farmers
• **Cooperative Strengthening** - Empowering farmer groups and cooperatives

His engineering background brings a technical approach to solving agricultural challenges. Want to know about specific crops or programs?`;
    }

    getYouthResponse() {
        return `Youth empowerment is central to Didmus's vision for Bungoma:

• **Tech Innovation Hubs** - Digital skills training centers in every sub-county
• **Vocational Training** - Practical skills for immediate employment
• **Startup Incubation** - Funding and mentorship for young entrepreneurs
• **Sports Development** - Facilities and programs to nurture talent
• **Leadership Programs** - Preparing youth for future leadership roles
• **Job Creation** - Public-private partnerships for employment opportunities

The goal is to make Bungoma a destination for young talent, not a place they leave. Interested in any specific youth program?`;
    }

    getHealthcareResponse() {
        return `Healthcare transformation is a priority for Didmus:

• **Hospital Upgrades** - Modern equipment and expanded facilities
• **Community Health** - Clinics in every ward with qualified staff
• **Digital Health Systems** - Electronic records and telemedicine
• **Maternal Health** - Specialized care for mothers and children
• **Mental Health** - Counseling services and awareness programs
• **Health Insurance** - Affordable coverage for all residents

His vision is quality healthcare accessible to every Bungoma resident, regardless of location or economic status. Any specific health concerns you'd like addressed?`;
    }

    getInfrastructureResponse() {
        return `Infrastructure development will transform Bungoma:

• **Road Network** - All-weather roads connecting rural areas to markets
• **Rural Electrification** - Reliable power for homes and businesses
• **Digital Connectivity** - High-speed internet in trading centers
• **Water Systems** - Clean water access for all communities
• **Market Infrastructure** - Modern facilities for traders and farmers
• **Transport Hubs** - Improved bus stations and transport links

Didmus's engineering background ensures technically sound and sustainable infrastructure projects. Want details about any specific infrastructure area?`;
    }

    getEducationResponse() {
        return `Education excellence is key to Bungoma's future:

• **Scholarship Programs** - Supporting bright students from poor families
• **School Infrastructure** - Modern classrooms and learning facilities
• **Digital Learning** - Computers and internet in rural schools
• **Teacher Training** - Continuous professional development
• **Technical Education** - Polytechnics and vocational institutes
• **Early Childhood Development** - Quality pre-primary education

The goal is to make Bungoma an education hub that produces skilled graduates ready for the modern economy. Interested in any specific education level?`;
    }

    getVolunteerResponse() {
        return `We'd love to have you join our movement! Here's how you can get involved:

• **Campaign Volunteers** - Help with rallies, door-to-door campaigns, and events
• **Digital Ambassadors** - Share our message on social media
• **Community Mobilizers** - Organize support in your local area
• **Skills-Based Volunteering** - Use your professional skills for the campaign
• **Youth Coordinators** - Lead youth engagement activities

Visit our 'Get Involved' page or contact us directly. Every contribution, big or small, makes a difference in building the Bungoma we want!`;
    }

    getDonateResponse() {
        return `Thank you for considering supporting our campaign! Your contribution helps us:

• Organize community rallies and events
• Print campaign materials and manifestos
• Run digital campaigns and advertisements
• Support grassroots mobilization efforts
• Fund policy research and development

All donations are handled in full compliance with IEBC regulations. Visit our 'Get Involved' page for secure donation options. Together, we can engineer Bungoma's future!`;
    }

    getContactResponse() {
        return `You can reach us through multiple channels:

📞 **Phone**: +254 700 000 000
📧 **Email**: info@didmusbarasa.com
📍 **Office**: Kimilili, Bungoma County
🌐 **Website**: didmusbarasa.com

**Social Media:**
• Facebook: @DidmusBarasa
• Twitter: @DidmusBarasa
• Instagram: @DidmusBarasa
• WhatsApp: Join our broadcast list

We're always ready to listen to your concerns and suggestions. Your voice matters in shaping Bungoma's future!`;
    }

    getEventsResponse() {
        return `Stay updated with our campaign activities:

**Upcoming Events:**
• Community rallies across all sub-counties
• Policy dialogue sessions with stakeholders
• Youth engagement forums
• Women's empowerment meetings
• Agricultural shows and farmer meetings

Check our 'News & Events' page for the latest schedule. You can RSVP for events and get reminders. We believe in taking our message directly to the people!`;
    }

    getExperienceResponse() {
        return `Didmus brings extensive experience to leadership:

**Political Experience:**
• MP Kimilili (2017-present) - 7+ years serving constituents
• Multiple development projects delivered
• Strong parliamentary performance record

**Professional Background:**
• Kenya Power & Lighting Company - Engineering expertise
• Shell Co. Ltd (Australia) - International exposure
• Bollore Africa Logistics - Management experience

**Military Service:**
• Kenya Armed Forces - Discipline and leadership training
• Avionics Technology - Technical specialization

This diverse experience uniquely qualifies him to lead Bungoma County's transformation.`;
    }

    getVisionResponse() {
        return `Didmus's vision for Bungoma County:

**"A prosperous, inclusive, and digitally-empowered county where every resident has access to opportunities, quality services, and a dignified life."**

**Key Pillars:**
• **Economic Transformation** - From subsistence to commercial agriculture and industry
• **Digital Innovation** - Making Bungoma a tech-savvy county
• **Social Inclusion** - Opportunities for all, regardless of background
• **Environmental Sustainability** - Green development practices
• **Good Governance** - Transparent, accountable leadership

This vision guides every policy and program in his agenda. Which aspect resonates most with you?`;
    }

    getDefaultResponse() {
        const responses = [
            "That's an interesting question! Could you be more specific about what you'd like to know regarding Didmus Barasa's campaign or policies?",
            "I'd be happy to help! You can ask me about Didmus's background, policies, how to get involved, or any other campaign-related questions.",
            "I'm here to provide information about Didmus Barasa and his vision for Bungoma County. What specific area would you like to explore?",
            "Great question! Feel free to ask about his agenda, experience, upcoming events, or how you can support the campaign."
        ];
        return this.getRandomResponse(responses);
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    initializeKnowledgeBase() {
        return {
            candidate: {
                name: "Didmus Wekesa Barasa",
                position: "Gubernatorial Candidate",
                constituency: "Kimilili (Current MP)",
                county: "Bungoma County",
                party: "UDA",
                slogan: "Engineering Bungoma's Future"
            },
            education: {
                masters: "Master of Arts in Public Administration & Management (Mount Kenya University)",
                bachelors: "Bachelor of Science in Electrical & Electronic Engineering (JKUAT)"
            },
            experience: {
                political: "MP Kimilili (2017-present)",
                military: "Kenya Armed Forces - Tradesman, Avionics Tech Wing Lab",
                private: ["Kenya Power & Lighting Company", "Shell Co. Ltd (Australia)", "Bollore Africa Logistics"]
            },
            policies: {
                agriculture: "Subsidized inputs, irrigation, market linkages, value addition",
                youth: "Tech hubs, vocational training, startup funding, sports development",
                healthcare: "Hospital upgrades, community clinics, digital health systems",
                infrastructure: "Roads, electricity, water, digital connectivity",
                education: "Scholarships, modern facilities, digital learning",
                governance: "Transparency, digital services, anti-corruption"
            }
        };
    }
}

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiChat = new AIChatAssistant();
});

// Add CSS for typing indicator
const typingCSS = `
.typing-indicator .typing-dots {
    display: flex;
    gap: 4px;
    padding: 8px 0;
}

.typing-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.4;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: 0s; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
    0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.4;
    }
    30% {
        transform: translateY(-10px);
        opacity: 1;
    }
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--card-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    z-index: var(--z-tooltip);
    animation: slideInRight 0.3s ease-out;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4);
    color: var(--text-primary);
}

.notification-success { border-left: 4px solid var(--success-color); }
.notification-error { border-left: 4px solid var(--error-color); }
.notification-warning { border-left: 4px solid var(--warning-color); }
.notification-info { border-left: 4px solid var(--primary-color); }

.notification-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--space-1);
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary-color);
    color: var(--accent-color);
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: var(--z-tooltip);
}

.skip-link:focus {
    top: 6px;
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = typingCSS;
document.head.appendChild(style);