
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Sender, CVSection } from './types';
import { SECTION_PROMPTS } from './constants';
import { getNextStepResponse, generateFinalCV } from './services/geminiService';
import { ChatBubble } from './components/ChatBubble';
import { TypingIndicator } from './components/TypingIndicator';

const SendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);

const CopyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

const App: React.FC = () => {
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentSection, setCurrentSection] = useState<CVSection>(CVSection.WELCOME);
    const [generatedCV, setGeneratedCV] = useState<string>('');
    const [isCvReady, setIsCvReady] = useState<boolean>(false);
    const [copySuccess, setCopySuccess] = useState<string>('');
    
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isLoading]);

    const processNextStep = useCallback(async (history: Message[], instruction: string) => {
        setIsLoading(true);
        const aiResponse = await getNextStepResponse(history, instruction);
        setChatHistory(prev => [...prev, { sender: Sender.AI, text: aiResponse }]);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const initialInteraction = async () => {
            if (currentSection === CVSection.WELCOME && chatHistory.length === 0) {
                await processNextStep([], SECTION_PROMPTS[CVSection.WELCOME]);
            }
        };
        initialInteraction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleGeneration = async () => {
            if (currentSection === CVSection.GENERATING) {
                setIsLoading(true);
                const generatingMessage = "Świetnie! Mam już wszystkie potrzebne informacje. Daj mi chwilkę, przygotowuję Twoje CV...";
                setChatHistory(prev => [...prev, { sender: Sender.AI, text: generatingMessage }]);
                
                const finalCV = await generateFinalCV(chatHistory, SECTION_PROMPTS[CVSection.FINISHED]);
                setGeneratedCV(finalCV);
                setIsCvReady(true);
                setCurrentSection(CVSection.FINISHED);
                setIsLoading(false);
            }
        };
        handleGeneration();
    }, [currentSection, chatHistory]);

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading) return;

        const newUserMessage: Message = { sender: Sender.USER, text: userInput };
        const updatedHistory = [...chatHistory, newUserMessage];
        setChatHistory(updatedHistory);
        setUserInput('');

        const nextSectionIndex = currentSection + 1;
        if (nextSectionIndex < CVSection.GENERATING) {
            setCurrentSection(nextSectionIndex as CVSection);
            await processNextStep(updatedHistory, SECTION_PROMPTS[nextSectionIndex]);
        } else {
             setCurrentSection(CVSection.GENERATING);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCV).then(() => {
            setCopySuccess('Skopiowano!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Błąd kopiowania.');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <main className="bg-slate-200 w-full h-screen flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-full flex flex-col overflow-hidden">
                <header className="p-4 border-b border-slate-200 text-center bg-white z-10">
                    <h1 className="text-2xl font-bold text-slate-800">Asystent CV</h1>
                    <p className="text-sm text-slate-500">Zbuduj z nami swoje pierwsze CV krok po kroku</p>
                </header>
                
                {isCvReady ? (
                    <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Twoje CV jest gotowe!</h2>
                        <div className="bg-white p-6 rounded-lg shadow-inner border border-slate-200">
                           <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">{generatedCV}</pre>
                        </div>
                        <button 
                            onClick={handleCopy}
                            className="mt-6 w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <CopyIcon />
                            {copySuccess ? copySuccess : 'Skopiuj CV do schowka'}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50">
                            {chatHistory.map((msg, index) => (
                                <ChatBubble key={index} sender={msg.sender} message={msg.text} />
                            ))}
                            {isLoading && <TypingIndicator />}
                            <div ref={chatEndRef} />
                        </div>

                        <footer className="p-4 border-t border-slate-200 bg-white">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Wpisz swoją odpowiedź..."
                                    className="flex-1 p-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !userInput.trim()}
                                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    <SendIcon />
                                </button>
                            </div>
                        </footer>
                    </>
                )}
            </div>
        </main>
    );
};

export default App;
