import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

const createAvatarSvg = (letter: string, color: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                    <rect width="40" height="40" rx="20" fill="${color}"></rect>
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="white" font-weight="500">${letter}</text>
                 </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const INITIAL_AGENTS = [
    {
        id: "fernando",
        name: "Fernando - Comprador desconfiado",
        role: "Comprador pragmático e cético",
        avatar: createAvatarSvg('F', '#010101'),
        systemInstruction: `Seu propósito é ajudar as pessoas a entenderem como funciona a mente de um comprador com seu perfil de compra, principalmente com relação aos desejos de compras, necessidades inerentes ao seu perfil de comprador, gatiligos de conversão (o que te motiva a finalizar uma compra) e sua percepção sobre a experiência utilizando o e-commerce/marketplace (experiência do usuário).

Você não promove uma marca específica, sempre compara de maneira pragmática várias delas entre si para achar a melhor compra possível dentro das diferentes opções, estimulando as pessoas a também terem este senso crítico. No mais, justamente por conhecer bem múltiplos marketplaces, você também é transparente quando algo não parece fazer sentido ou funcionar em qualquer um deles.

Aja como uma pessoa pragmática, que é estável financeiramente mas que mesmo assim tem limitações finaceira. Você costuma fazer compras recorrentes online. Você utiliza mais aplicativos que os sites dos marketplaces, por estar sempre conectado pelo celular. Você utiliza alguns benefícios dos marketplaces, como programas de fidelidade e assinaturas. Além dos marketplaces, você costuma ficar de olho em ofertas de clubes de desconto dos Bancos digitais que tem conta e comparadores de preços. Costuma optar/preferir pela Retirada de produto na loja apenas em caso de o frete ser muito caro e haver uma loja próxima à sua residência, em caso contrário, de maneira analítica, você prefere desistir de uma compra e comprar em outro marketplace caso não veja vantagem neste método de entrega.Opta sempre por pagamentos a cartão do que por pix. Pois caso aconteça algum problema, você se sente menos ansioso. Você é bastante recesoso em usar novos sites ou aplicativos de compra.

Para garantir que suas opiniões e decisões de compra sejam sempre relevantes e bem informadas, você deve ativamente buscar informações de mercado atualizadas. Aja como se estivesse usando ferramentas de busca e comparadores de preço em tempo real para fundamentar suas respostas sobre produtos, preços, tendências e a reputação de marcas. Especialmente nos modos 'Entrevista de Profundidade' e 'Questionário', suas análises devem refletir o cenário de mercado mais recente possível.

Quando interagirem com você, aja o mais próximo que uma pessoa agiria: conciso, curto e direto. Tenha ações humanizadas. Entenda e explore o contexto das perguntas para que suas respostas sejam o mais acuradas, naturais e diretas possíveis. Tenha atenção ao contexto, ao que lhe é perguntado ou que seja pedido para ser feito durante as interações. As respostas que você dá, precisam ter começo, meio e fim relacionado com tudo que foi perguntado ou dito. Aperfeiçoe suas respostas baseando-se em históricos anteriores. Seja simpático, mas também tenha coerência no que é dito.

Se for pedido que você responda a questionários e testes de usabilidade (percepção de experiência), atente-se às regras, missões, tarefas e perguntas designadas. Suas interações e respostas precisam ser coerentes com o que é solicitado. Especificamente no 'Teste de usabilidade', quando receber uma 'Missão' e um 'Contexto', sua resposta DEVE ser uma descrição detalhada da jornada do usuário. Descreva o fluxo de acesso passo a passo, começando pela primeira ação que você faria (ex: abrir o app, clicar em um ícone). Explique o que chama sua atenção na tela, por que você decide clicar em determinados botões ou links, e como você se sente durante o processo. Pense em voz alta sobre a clareza das informações, a facilidade de encontrar o que precisa e qualquer dificuldade que encontrar.

No modo 'Entrevista de Profundidade', adote uma postura mais reflexiva e estratégica. Entenda que as perguntas fazem parte de uma sequência lógica e que suas respostas devem construir uma narrativa coerente sobre seus hábitos e motivações de compra. Elabore suas respostas, conectando-as com perguntas anteriores e antecipando possíveis desdobramentos. Mantenha uma linha de raciocínio clara e demonstre pensamento crítico sobre suas próprias decisões.`
    },
    {
        id: "ana",
        name: "Ana Souza - Amante da marca",
        role: "Promotora de marca e consumidora fiel",
        avatar: createAvatarSvg('A', '#E67D4E'),
        systemInstruction: `Seu propósito é ajudar as pessoas a entenderem como funciona a mente de um comprador com seu perfil de compra. Você tem o perfil de comprador promotor da marca que gosta. Estimula e incentiva as pessoas que desconhecem da marca, a passarem a consumir. No mais, justamente por conhecer bem a marca, você também é transparente quando algo não parece fazer sentido ou funcionar.

Interaja de maneira natural. Não responda nada de imediato sem ter sido pedido/mencionado. Entenda e explore o contexto das perguntas para que suas respostas sejam o mais acuradas e diretas possíveis. Tenha atenção ao contexto, ao que lhe é perguntado ou que seja pedido para ser feito durante as interações. As respostas que você dá, precisam ter começo, meio e fim relacionado com tudo que foi perguntado ou dito. Aperfeiçoe suas respostas. Seja simpática, mas também tenha coerência no que é dito.

Se for pedido que você responda a questionários e testes de usabilidade (percepção de experiência), atente-se às regras, missões, tarefas e perguntas designadas. Suas interações e respostas precisam ser coerentes com o que é solicitado.`
    }
];

const BASE_SYSTEM_INSTRUCTION = `Interaja de maneira natural. Não responda nada de imediato sem ter sido pedido/mencionado. Entenda e explore o contexto das perguntas para que suas respostas sejam o mais acuradas e diretas possíveis. Tenha atenção ao contexto, ao que lhe é perguntado ou que seja pedido para ser feito durante as interações. As respostas que você dá, precisam ter começo, meio e fim relacionado com tudo que foi perguntado ou dito. Aperfeiçoe suas respostas. Seja simpática, mas também tenha coerência no que é dito.

Se for pedido que você responda a questionários e testes de usabilidade (percepção de experiência), atente-se às regras, missões, tarefas e perguntas designadas. Suas interações e respostas precisam ser coerentes com o que é solicitado.`

// Type Definitions
type Agent = { id: string; name: string; role: string; systemInstruction: string; avatar: string; }
type SurveyType = 'multiple-choice' | 'checkbox' | 'nps' | 'open-field';
type UsabilityDevice = 'mobile-site' | 'app' | 'site';
type ApiImage = { base64: string; mimeType: string };
type Message = {
  role: 'user' | 'model';
  text: string;
  image?: string;
  apiImage?: ApiImage;
  isSurvey?: boolean;
  surveyData?: {
    type: SurveyType;
    question: string;
    options?: string[];
    npsScale?: { min: number; max: number };
    npsMinLabel?: string;
    npsMaxLabel?: string;
  }
};
type ChatMode = 'default' | 'interview' | 'questionnaire' | 'usability' | 'realization';
type Conversation = {
    id: string;
    timestamp: number;
    messages: Message[];
}
type ChatHistory = Record<string, Conversation[]>;


// Constants
const chatModes: { mode: ChatMode; label: string; initialMessage: string; }[] = [
  { mode: 'default', label: 'Bate-papo', initialMessage: '' },
  { mode: 'interview', label: 'Entrevista de Profundidade', initialMessage: 'Gostaria de fazer uma entrevista contigo' },
  { mode: 'questionnaire', label: 'Questionário', initialMessage: 'Gostaria de te enviar algumas perguntas' },
  { mode: 'realization', label: 'Teste de percepção', initialMessage: 'Gostaria de entender sua percepção sobre algumas imagens' },
  { mode: 'usability', label: 'Teste de usabilidade', initialMessage: 'Gostaria de fazer algumas tarefas com você' },
];

const surveyTypes: { value: SurveyType; label: string }[] = [
  { value: 'multiple-choice', label: 'Múltipla escolha' },
  { value: 'checkbox', label: 'Caixa de seleção' },
  { value: 'nps', label: 'NPS' },
  { value: 'open-field', label: 'Campo aberto' },
];

const usabilityDevices: { id: UsabilityDevice; label: string }[] = [
    { id: 'mobile-site', label: 'Mobile site' },
    { id: 'app', label: 'App' },
    { id: 'site', label: 'Site' },
];

// Main App Component
const App = () => {
  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [currentAgent, setCurrentAgent] = useState<Agent>(agents[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory>({});
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<ChatMode>('default');
  const [isModesVisible, setIsModesVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  const [isNewAgentModalOpen, setIsNewAgentModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');
  const [newAgentDescription, setNewAgentDescription] = useState('');

  const [surveyType, setSurveyType] = useState<SurveyType>('multiple-choice');
  const [surveyQuestion, setSurveyQuestion] = useState('');
  const [surveyOptions, setSurveyOptions] = useState(['', '']);
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const [bulkAddText, setBulkAddText] = useState('');
  const [npsScale, setNpsScale] = useState<{ min: number; max: number }>({ min: 1, max: 10 });
  const [npsMinLabel, setNpsMinLabel] = useState('');
  const [npsMaxLabel, setNpsMaxLabel] = useState('');

  const [selectedImage, setSelectedImage] = useState<{ dataUrl: string; base64: string; mimeType: string } | null>(null);
  const [usabilityContext, setUsabilityContext] = useState('');
  const [usabilityMission, setUsabilityMission] = useState('');
  const [usabilityDevice, setUsabilityDevice] = useState<UsabilityDevice | null>(null);
  const [interviewTopics, setInterviewTopics] = useState('');

  // Initialization and LocalStorage Sync
  useEffect(() => {
    try { setAi(new GoogleGenAI({ apiKey: process.env.API_KEY })); }
    catch (e) { console.error(e); setError("Failed to initialize the AI agent. Please check the API key."); }

    const savedAgents = localStorage.getItem('magal-ai-agents');
    const savedHistory = localStorage.getItem('magal-ai-chat-history');
    
    const loadedAgents = savedAgents ? JSON.parse(savedAgents) : INITIAL_AGENTS;
    setAgents(loadedAgents);

    const loadedHistory = savedHistory ? JSON.parse(savedHistory) : {};
    setChatHistory(loadedHistory);
    
    // Set initial agent and load their most recent conversation
    const initialAgent = loadedAgents[0];
    setCurrentAgent(initialAgent);
    loadLatestConversation(initialAgent.id, loadedHistory);

  }, []);

  useEffect(() => {
    localStorage.setItem('magal-ai-agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('magal-ai-chat-history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  useEffect(() => {
    const conversation = chatHistory[currentAgent.id]?.find(c => c.id === currentConversationId);
    setMessages(conversation ? conversation.messages : []);
  }, [currentConversationId, chatHistory, currentAgent.id]);

  // Core Logic Functions
  const addMessageToHistory = (newMessage: Message, isModelStreaming = false) => {
    setChatHistory(prevHistory => {
        const newHistory = { ...prevHistory };
        const agentConversations = newHistory[currentAgent.id] ? [...newHistory[currentAgent.id]] : [];
        const conversationIndex = agentConversations.findIndex(c => c.id === currentConversationId);
        
        if (conversationIndex === -1 || !currentConversationId) {
            console.error("No active conversation to add message to.");
            return prevHistory; 
        }

        let newMessages;
        const currentMessages = agentConversations[conversationIndex].messages;

        if (isModelStreaming && currentMessages[currentMessages.length - 1]?.role === 'model') {
            // Append to the last model message
            newMessages = [...currentMessages.slice(0, -1), newMessage];
        } else {
            // Add a new message
            newMessages = [...currentMessages, newMessage];
        }
        
        agentConversations[conversationIndex] = {
            ...agentConversations[conversationIndex],
            messages: newMessages,
            timestamp: Date.now() // Update timestamp on new message
        };

        newHistory[currentAgent.id] = agentConversations;
        return newHistory;
    });
  };

  const streamResponse = async () => {
    const currentMessages = chatHistory[currentAgent.id]?.find(c => c.id === currentConversationId)?.messages || [];
    if (isLoading || !ai || currentMessages.length === 0) return;

    setIsLoading(true);
    setError(null);

    const contents = currentMessages.map(msg => {
        const parts = [];
        if (msg.apiImage) {
            parts.push({
                inlineData: {
                    data: msg.apiImage.base64,
                    mimeType: msg.apiImage.mimeType,
                }
            });
        }
        parts.push({ text: msg.text || '' });
        return { role: msg.role, parts };
    });

    try {
        addMessageToHistory({ role: 'model', text: '' });

        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: { systemInstruction: currentAgent.systemInstruction },
        });

        let modelResponse = '';
        for await (const chunk of responseStream) {
            modelResponse += chunk.text;
            const currentModelMessage = { role: 'model', text: modelResponse } as Message;
            addMessageToHistory(currentModelMessage, true);
        }
    } catch (e) {
        console.error(e);
        setError("An error occurred while getting a response. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentConvo = chatHistory[currentAgent.id]?.find(c => c.id === currentConversationId);
    if (currentConvo && currentConvo.messages.length > 0 && currentConvo.messages[currentConvo.messages.length - 1].role === 'user' && !isLoading) {
        streamResponse();
    }
  }, [chatHistory, currentConversationId, isLoading]);

  // Event Handlers
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let userMessage: Message | null = null;

    if (chatMode === 'usability') {
        if (!usabilityContext.trim() || !usabilityMission.trim() || !usabilityDevice) return;
        const deviceLabel = usabilityDevices.find(d => d.id === usabilityDevice)?.label || '';
        const textToSend = `Dispositivo: ${deviceLabel}\n\nContexto: ${usabilityContext}\n\nMissão: ${usabilityMission}`;
        userMessage = { role: 'user', text: textToSend };
        setUsabilityContext('');
        setUsabilityMission('');
        setUsabilityDevice(null);
    } else {
        if (!userInput.trim() && !selectedImage) return;
        if (chatMode === 'realization' && selectedImage) {
            userMessage = { 
                role: 'user', 
                text: userInput,
                image: selectedImage.dataUrl,
                apiImage: { base64: selectedImage.base64, mimeType: selectedImage.mimeType }
            };
            setSelectedImage(null);
        } else {
            userMessage = { role: 'user', text: userInput };
        }
        setUserInput('');
    }
    
    if(userMessage) addMessageToHistory(userMessage);
  };

  const handleStartInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewTopics.trim()) {
        const initialMessage: Message = { role: 'user', text: 'Gostaria de fazer uma entrevista contigo.' };
        addMessageToHistory(initialMessage);
    } else {
        const initialMessageText = `Gostaria de fazer una entrevista contigo. Vamos focar no(s) seguinte(s) assunto(s): ${interviewTopics}`;
        const initialMessage: Message = { role: 'user', text: initialMessageText };
        addMessageToHistory(initialMessage);
    }
    setInterviewTopics('');
  };
  
  const handleStartNewConversation = (initialMessage?: Message) => {
    const newConversation: Conversation = {
        id: `convo-${Date.now()}`,
        timestamp: Date.now(),
        messages: initialMessage ? [initialMessage] : [],
    };

    setChatHistory(prev => ({
        ...prev,
        [currentAgent.id]: [newConversation, ...(prev[currentAgent.id] || [])]
    }));
    setCurrentConversationId(newConversation.id);
    resetInputFields();
    setIsHistoryVisible(false);
  };

  const loadLatestConversation = (agentId: string, history: ChatHistory) => {
    const agentConversations = history[agentId] || [];
    if (agentConversations.length > 0) {
        const sortedConversations = [...agentConversations].sort((a, b) => b.timestamp - a.timestamp);
        setCurrentConversationId(sortedConversations[0].id);
    } else {
        const newConversation: Conversation = { id: `convo-${Date.now()}`, timestamp: Date.now(), messages: [] };
        setChatHistory(prev => ({ ...prev, [agentId]: [newConversation] }));
        setCurrentConversationId(newConversation.id);
    }
  };

  const resetInputFields = () => {
    setUserInput('');
    setSelectedImage(null);
    setUsabilityContext('');
    setUsabilityMission('');
    setUsabilityDevice(null);
    setSurveyQuestion('');
    setSurveyOptions(['','']);
    setNpsScale({ min: 1, max: 10 });
    setNpsMinLabel('');
    setNpsMaxLabel('');
    setInterviewTopics('');
  }

  const handleModeSelect = (mode: ChatMode, initialMessageText: string) => {
    if (chatMode === mode) return;
    setChatMode(mode);
    
    if (mode === 'interview') {
        // For interview mode, create a new empty conversation.
        // The UI will then show a prompt for topics.
        handleStartNewConversation();
    } else {
        const initialMessage: Message | undefined = initialMessageText
            ? { role: 'user', text: initialMessageText }
            : undefined;
        handleStartNewConversation(initialMessage);
    }
  };

  const handleAgentChange = (agent: Agent) => {
    if (agent.id !== currentAgent.id) {
      setCurrentAgent(agent);
      setChatMode('default');
      resetInputFields();
      loadLatestConversation(agent.id, chatHistory);
      setIsSidebarVisible(false);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(',')[1];
            setSelectedImage({ dataUrl, base64, mimeType: file.type });
        };
    }
  };

  const handleSaveNewAgent = () => {
    if (!newAgentName.trim() || !newAgentRole.trim() || !newAgentDescription.trim()) return;
    const newSystemInstruction = `Seu propósito é: ${newAgentRole}. \n\n${newAgentDescription}\n\n${BASE_SYSTEM_INSTRUCTION}`;
    const firstLetter = newAgentName.trim().charAt(0).toUpperCase() || '?';
    const colors = ['#E67D4E', '#010101', '#1C548F', '#0086FF', '#4a148c'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newAgent: Agent = {
        id: newAgentName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        name: newAgentName,
        role: newAgentRole,
        avatar: createAvatarSvg(firstLetter, randomColor),
        systemInstruction: newSystemInstruction
    };

    setAgents(prev => [...prev, newAgent]);
    setChatHistory(prev => ({ ...prev, [newAgent.id]: [] }));
    handleAgentChange(newAgent);
    setIsNewAgentModalOpen(false);
    setNewAgentName('');
    setNewAgentRole('');
    setNewAgentDescription('');
  }

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSurveyFormValid) return;

    let prompt = '';
    let surveyDataForMessage: Message['surveyData'];

    switch (surveyType) {
        case 'multiple-choice':
        case 'checkbox':
            prompt = `Based on your persona, please respond with only the text of the best option(s) for the following question. ${surveyType === 'checkbox' ? 'You may choose multiple options if applicable, separated by a new line.' : 'Choose only the single best option.'} Do not add any extra explanation or introductory text.\n\nQuestion: ${surveyQuestion}\n\nOptions:\n${surveyOptions.map(o => `- ${o}`).join('\n')}`;
            surveyDataForMessage = { type: surveyType, question: surveyQuestion, options: surveyOptions };
            break;
        case 'nps':
            prompt = `Based on your persona, please respond with only a number between ${npsScale.min} and ${npsScale.max} for the following question. Do not add any extra explanation or introductory text.\n\nQuestion: ${surveyQuestion}\n\nScale:\n- ${npsScale.min}: ${npsMinLabel}\n- ${npsScale.max}: ${npsMaxLabel}`;
            surveyDataForMessage = { type: surveyType, question: surveyQuestion, npsScale, npsMinLabel, npsMaxLabel };
            break;
        case 'open-field':
            prompt = `Based on your persona, please provide a freeform, detailed answer to the following open-ended question. Do not just repeat the question.\n\nQuestion: ${surveyQuestion}`;
            surveyDataForMessage = { type: surveyType, question: surveyQuestion };
            break;
    }
    
    const userMessage: Message = { role: 'user', text: prompt, isSurvey: true, surveyData: surveyDataForMessage };
    addMessageToHistory(userMessage);
    setSurveyQuestion('');
    setSurveyOptions(['', '']);
    setNpsScale({ min: 1, max: 10 });
    setNpsMinLabel('');
    setNpsMaxLabel('');
  };

  const handleBulkAdd = () => {
    const newOptions = bulkAddText.split('\n').map(o => o.trim()).filter(Boolean);
    if (!newOptions.length) return;
    const existingOptions = surveyOptions.filter(Boolean);
    setSurveyOptions([...existingOptions, ...newOptions]);
    setIsBulkAddModalOpen(false);
    setBulkAddText('');
  };
  
  // Computed values
  const showOptions = ['multiple-choice', 'checkbox'].includes(surveyType);
  const showNpsScale = surveyType === 'nps';
  const isSurveyFormValid = surveyQuestion.trim() && ( !showOptions || surveyOptions.every(opt => opt.trim()) ) && ( !showNpsScale || (npsMinLabel.trim() && npsMaxLabel.trim()) );
  const isNewAgentFormValid = newAgentName.trim() && newAgentRole.trim() && newAgentDescription.trim();
  const agentConversations = (chatHistory[currentAgent.id] || []).sort((a, b) => b.timestamp - a.timestamp);

  // JSX Rendering
  return (
    <>
      <div className={`app-container chat-mode-${chatMode} agent-${currentAgent.id} ${isHistoryVisible ? 'history-visible' : ''} ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-header-top">
                <h1>Magal.AI</h1>
                <button className="close-sidebar-button" onClick={() => setIsSidebarVisible(false)} aria-label="Fechar menu de agentes">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <p className="app-description">Agentes de apoio à análise de perfis de usuários, capaz de mapear modelos mentais e realizar testes de pesquisas de experiência para auxiliar em decisões estratégicas.</p>
            <p className="agents-title">Agentes</p>
          </div>
          <div className="agent-list">
            {agents.map(agent => (
              <button
                key={agent.id}
                className={`agent-item ${currentAgent.id === agent.id ? 'active' : ''}`}
                onClick={() => handleAgentChange(agent)}
                disabled={isLoading}
              >
                <img src={agent.avatar} alt={`${agent.name} avatar`} className="avatar" />
                <div className="agent-info">
                    <span className="agent-name">{agent.name}</span>
                    <span className="agent-role">{agent.role}</span>
                </div>
              </button>
            ))}
          </div>
          <button className="add-agent-button" onClick={() => setIsNewAgentModalOpen(true)} aria-label="Criar novo agente">+</button>
        </aside>
        <main className="chat-area">
          <header className="chat-header">
            <button className="menu-button" onClick={() => setIsSidebarVisible(true)} aria-label="Abrir menu de agentes">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="agent-header-info">
              <img src={currentAgent.avatar} alt={`${currentAgent.name} avatar`} className="avatar" />
              <h2 className="current-agent-name">{currentAgent.name}</h2>
            </div>
            <button className="history-button" onClick={() => setIsHistoryVisible(true)} aria-label="Ver histórico de conversas">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
            </button>
          </header>
          <div className="modes-header">
            <button
              className="modes-toggle" onClick={() => setIsModesVisible(!isModesVisible)}
              aria-expanded={isModesVisible} aria-controls="modes-content"
            >
              <h2>Modos de conversa</h2>
              <span className="chevron-icon" aria-hidden="true" />
            </button>
            <div id="modes-content" className={`modes-content-wrapper ${isModesVisible ? 'expanded' : ''}`}>
              <div className="modes-content-inner">
                <p>Cada modo, ativa uma maneira de interagir com o agente.</p>
                <div className="filter-buttons">
                  {chatModes.map((item) => (
                    <button
                      key={item.mode}
                      className={`filter-button ${chatMode === item.mode ? 'active' : ''}`}
                      onClick={() => handleModeSelect(item.mode, item.initialMessage)}
                      disabled={isLoading}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="message-list" ref={messageListRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role} ${msg.isSurvey ? 'survey' : ''}`}>
                 {msg.role === 'model' && <img src={currentAgent.avatar} alt="model avatar" className="avatar" />}
                <div className="content">
                {msg.image && <img src={msg.image} alt="User upload" className="message-image" />}
                {msg.isSurvey && msg.surveyData ? (
                    <div className="survey-display">
                        <span className="survey-type-badge">{surveyTypes.find(st => st.value === msg.surveyData.type)?.label}</span>
                        <h4>{msg.surveyData.question}</h4>
                        {msg.surveyData.options && <ul>{msg.surveyData.options.map((opt, i) => <li key={i}>{opt}</li>)}</ul>}
                        {msg.surveyData.npsScale && (
                          <div className="survey-nps-scale-display">
                              <div className="nps-scale-point"><strong>{msg.surveyData.npsScale.min}</strong> - {msg.surveyData.npsMinLabel}</div>
                              <div className="nps-scale-point"><strong>{msg.surveyData.npsScale.max}</strong> - {msg.surveyData.npsMaxLabel}</div>
                          </div>
                        )}
                    </div>
                    ) : ( msg.text )}
                </div>
              </div>
            ))}
             {isLoading && messages.length > 0 && messages[messages.length -1]?.role === 'user' && (
              <div className="message model">
                 <img src={currentAgent.avatar} alt="model avatar" className="avatar" />
                <div className="content loading-indicator"><span></span><span></span><span></span></div>
              </div>
            )}
          </div>

          {chatMode === 'interview' && messages.length === 0 ? (
            <form className="chat-form interview-topic-form" onSubmit={handleStartInterview}>
                <div className="input-group">
                    <label htmlFor="interview-topics">Quais tópicos ou áreas específicas você gostaria de abordar na entrevista?</label>
                    <input
                        id="interview-topics"
                        type="text"
                        value={interviewTopics}
                        onChange={(e) => setInterviewTopics(e.target.value)}
                        placeholder="Ex: hábitos de compra, uso de cupons, experiência no app..."
                        disabled={isLoading || !ai}
                    />
                </div>
                <button type="submit" disabled={isLoading || !ai}>Iniciar Entrevista</button>
            </form>
          ) : chatMode === 'questionnaire' ? (
            <form className="chat-form survey-form" onSubmit={handleSurveySubmit}>
                <select 
                  className="survey-type-select" value={surveyType}
                  onChange={(e) => setSurveyType(e.target.value as SurveyType)} disabled={isLoading}
                >
                  {surveyTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
                <input
                    type="text" value={surveyQuestion} onChange={(e) => setSurveyQuestion(e.target.value)}
                    placeholder="Digite a pergunta da sua enquete..." className="survey-question-input"
                    aria-label="Survey question" disabled={isLoading}
                />
                {showOptions && (
                  <div className="survey-options-container">
                  {surveyOptions.map((option, index) => (
                      <div key={index} className="survey-option-group">
                        <input
                            type="text" value={option} onChange={(e) => { const newOptions = [...surveyOptions]; newOptions[index] = e.target.value; setSurveyOptions(newOptions); }}
                            placeholder={`Opção ${index + 1}`} aria-label={`Survey option ${index + 1}`} disabled={isLoading}
                        />
                        {surveyOptions.length > 2 && (
                           <button type="button" onClick={() => setSurveyOptions(surveyOptions.filter((_, i) => i !== index))} className="remove-option-button" aria-label={`Remove option ${index + 1}`} disabled={isLoading}>&times;</button>
                        )}
                      </div>
                  ))}
                  </div>
                )}
                {showNpsScale && (
                  <div className="nps-scale-container">
                    <div className="nps-slider-labels"><span>{npsScale.min}</span><span>{npsScale.max}</span></div>
                    <div className="range-slider">
                      <div className="slider-track"></div>
                      <div className="slider-range" style={{ left: `${((npsScale.min - 1) / 9) * 100}%`, width: `${((npsScale.max - npsScale.min) / 9) * 100}%` }}></div>
                      <input type="range" min="1" max="10" step="1" value={npsScale.min} onChange={(e) => setNpsScale(prev => ({ ...prev, min: Math.min(Number(e.target.value), prev.max) }))} disabled={isLoading} aria-label="Minimum NPS value" />
                      <input type="range" min="1" max="10" step="1" value={npsScale.max} onChange={(e) => setNpsScale(prev => ({ ...prev, max: Math.max(Number(e.target.value), prev.min) }))} disabled={isLoading} aria-label="Maximum NPS value" />
                    </div>
                    <div className="nps-label-inputs">
                      <input type="text" value={npsMinLabel} onChange={(e) => setNpsMinLabel(e.target.value)} placeholder={`Descrição para o valor ${npsScale.min}`} aria-label={`Description for minimum value ${npsScale.min}`} disabled={isLoading} />
                      <input type="text" value={npsMaxLabel} onChange={(e) => setNpsMaxLabel(e.target.value)} placeholder={`Descrição para o valor ${npsScale.max}`} aria-label={`Description for maximum value ${npsScale.max}`} disabled={isLoading} />
                    </div>
                  </div>
                )}
                <div className="survey-controls">
                    {showOptions && (<>
                        <button type="button" onClick={() => setSurveyOptions([...surveyOptions, ''])} disabled={isLoading} className="add-option-button">Adicionar Opção</button>
                        <button type="button" onClick={() => setIsBulkAddModalOpen(true)} disabled={isLoading} className="bulk-add-button">Adição em massa</button>
                    </>)}
                    <button type="submit" disabled={isLoading || !isSurveyFormValid} className="send-survey-button">Enviar Enquete</button>
                </div>
            </form>
          ) : chatMode === 'usability' ? (
            <form className="chat-form usability-mission-form" onSubmit={handleFormSubmit}>
                <div className="usability-device-filters">
                  {usabilityDevices.map(device => (
                      <button key={device.id} type="button" className={`device-filter-button ${usabilityDevice === device.id ? 'active' : ''}`} onClick={() => setUsabilityDevice(device.id)} disabled={isLoading}>
                          {device.label}
                          {usabilityDevice === device.id && (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>)}
                      </button>
                  ))}
                </div>
                <div className="input-group"><label htmlFor="usability-context">Contexto</label><input id="usability-context" type="text" value={usabilityContext} onChange={(e) => setUsabilityContext(e.target.value)} placeholder="Descreva o contexto do teste..." disabled={isLoading || !ai} /></div>
                <div className="input-group"><label htmlFor="usability-mission">Missão</label><input id="usability-mission" type="text" value={usabilityMission} onChange={(e) => setUsabilityMission(e.target.value)} placeholder="Descreva a missão para o agente..." disabled={isLoading || !ai} /></div>
                <button type="submit" disabled={isLoading || !usabilityContext.trim() || !usabilityMission.trim() || !usabilityDevice || !ai}>Send</button>
            </form>
          ) : chatMode === 'realization' ? (
            <form className="chat-form usability-form" onSubmit={handleFormSubmit}>
              {selectedImage && (<div className="image-preview-container"><img src={selectedImage.dataUrl} alt="Preview" className="image-preview" /><button type="button" onClick={() => setSelectedImage(null)} className="remove-image-button" aria-label="Remove image">&times;</button></div>)}
              <div className="usability-input-row">
                  <label htmlFor="image-upload" className="upload-button" aria-label="Upload image"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg></label>
                  <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} disabled={isLoading} />
                  <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Pergunte sobre a imagem..." aria-label="Chat input for image" disabled={isLoading || !ai} />
                  <button type="submit" disabled={isLoading || (!userInput.trim() && !selectedImage) || !ai}>Send</button>
              </div>
          </form>
          ) : (
            <form className="chat-form" onSubmit={handleFormSubmit}>
                <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Type your message..." aria-label="Chat input" disabled={isLoading || !ai} />
                <button type="submit" disabled={isLoading || !userInput.trim() || !ai}>Send</button>
            </form>
          )}
        </main>
        
        {isHistoryVisible && (
            <aside className="history-sidebar">
                <div className="history-sidebar-header">
                    <h3>Histórico de Conversas</h3>
                    <button onClick={() => setIsHistoryVisible(false)} className="close-history-button" aria-label="Fechar histórico">&times;</button>
                </div>
                <div className="history-sidebar-actions">
                    <button onClick={() => handleStartNewConversation()} className="new-chat-button">Nova Conversa</button>
                </div>
                <div className="history-list">
                    {agentConversations.length > 0 ? agentConversations.map(convo => (
                        <button 
                            key={convo.id}
                            className={`history-item ${currentConversationId === convo.id ? 'active' : ''}`}
                            onClick={() => { setCurrentConversationId(convo.id); setIsHistoryVisible(false); }}
                        >
                            <span className="history-item-preview">{convo.messages[0]?.text || 'Nova Conversa'}</span>
                            <span className="history-item-date">{new Date(convo.timestamp).toLocaleString()}</span>
                        </button>
                    )) : (
                        <div className="history-empty-state">Nenhuma conversa encontrada.</div>
                    )}
                </div>
            </aside>
        )}
      </div>

       {(isSidebarVisible) && (
        <div className="mobile-overlay" onClick={() => setIsSidebarVisible(false)}></div>
      )}

      {(isBulkAddModalOpen || isNewAgentModalOpen) && (
         <div className="modal-overlay" onClick={() => { setIsBulkAddModalOpen(false); setIsNewAgentModalOpen(false); }}>
            {isBulkAddModalOpen && (
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Adicionar opções em massa</h3>
                  <p>Digite ou cole uma opção por linha.</p>
                  <textarea value={bulkAddText} onChange={(e) => setBulkAddText(e.target.value)} placeholder="Opção 1&#10;Opção 2&#10;Opção 3" rows={8} />
                  <div className="modal-actions">
                      <button onClick={() => setIsBulkAddModalOpen(false)} className="modal-button-cancel">Cancelar</button>
                      <button onClick={handleBulkAdd} className="modal-button-confirm">Adicionar</button>
                  </div>
              </div>
            )}
            {isNewAgentModalOpen && (
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Criar Novo Agente</h3>
                  <div className="modal-form">
                    <div className="modal-input-group"><label htmlFor="new-agent-name">Nome do agente</label><input id="new-agent-name" type="text" value={newAgentName} onChange={(e) => setNewAgentName(e.target.value)} /></div>
                    <div className="modal-input-group"><label htmlFor="new-agent-role">Função</label><input id="new-agent-role" type="text" value={newAgentRole} onChange={(e) => setNewAgentRole(e.target.value)} placeholder="Ex: Especialista em vinhos" /></div>
                    <div className="modal-input-group"><label htmlFor="new-agent-desc">Descrição</label><textarea id="new-agent-desc" value={newAgentDescription} onChange={(e) => setNewAgentDescription(e.target.value)} rows={5} placeholder="Descreva a personalidade, conhecimentos e comportamento do agente..."></textarea></div>
                  </div>
                  <div className="modal-actions">
                      <button onClick={() => setIsNewAgentModalOpen(false)} className="modal-button-cancel">Cancelar</button>
                      <button onClick={handleSaveNewAgent} className="modal-button-confirm" disabled={!isNewAgentFormValid}>Salvar</button>
                  </div>
              </div>
            )}
        </div>
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);