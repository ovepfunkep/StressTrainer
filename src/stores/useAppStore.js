import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default dictionary with some example words
const defaultDictionary = [
  {
    word: "клала",
    correctIndex: 1,
    wrongIndex: 2
  },
  {
    word: "крала", 
    correctIndex: 1,
    wrongIndex: 2
  },
  {
    word: "обеспечение",
    correctIndex: 5,
    wrongIndex: 3
  },
  {
    word: "договор",
    correctIndex: 2,
    wrongIndex: 1
  },
  {
    word: "каталог",
    correctIndex: 2,
    wrongIndex: 0
  },
  {
    word: "звонит",
    correctIndex: 2,
    wrongIndex: 0
  },
  {
    word: "торты",
    correctIndex: 0,
    wrongIndex: 2
  },
  {
    word: "красивее",
    correctIndex: 3,
    wrongIndex: 1
  }
];

const useAppStore = create(
  persist(
    (set, get) => ({
      // Dictionary management
      dictionary: defaultDictionary,
      excludedWords: [],
      
      // Current training session
      currentWord: null,
      currentOptions: [],
      sessionStats: {
        correct: 0,
        wrong: 0,
        total: 0
      },
      
      // User statistics per word
      wordStats: {},
      
      // UI state
      showFeedback: false,
      lastAnswer: null,
      isCorrect: false,
      
      // Actions
      addWord: (word) => {
        const { dictionary } = get();
        if (!dictionary.find(w => w.word === word.word)) {
          set({ dictionary: [...dictionary, word] });
        }
      },
      
      excludeWord: (word) => {
        const { excludedWords } = get();
        if (!excludedWords.includes(word)) {
          set({ excludedWords: [...excludedWords, word] });
        }
      },
      
      includeWord: (word) => {
        const { excludedWords } = get();
        set({ excludedWords: excludedWords.filter(w => w !== word) });
      },
      
      getAvailableWords: () => {
        const { dictionary, excludedWords } = get();
        return dictionary.filter(word => !excludedWords.includes(word.word));
      },
      
      generateWordOptions: (wordObj) => {
        const { word, correctIndex, wrongIndex } = wordObj;
        const vowels = 'аеёиоуыэюя';
        
        // Find all vowel positions
        const vowelPositions = [];
        for (let i = 0; i < word.length; i++) {
          if (vowels.includes(word[i].toLowerCase())) {
            vowelPositions.push(i);
          }
        }
        
        // Generate correct option
        const correctOption = word.split('').map((char, index) => {
          if (index === vowelPositions[correctIndex]) {
            return char.toUpperCase();
          }
          return char;
        }).join('');
        
        // Generate wrong option
        const wrongOption = word.split('').map((char, index) => {
          if (index === vowelPositions[wrongIndex]) {
            return char.toUpperCase();
          }
          return char;
        }).join('');
        
        // Randomize order
        const options = Math.random() > 0.5 
          ? [{ text: correctOption, isCorrect: true }, { text: wrongOption, isCorrect: false }]
          : [{ text: wrongOption, isCorrect: false }, { text: correctOption, isCorrect: true }];
          
        return options;
      },
      
      startNewQuestion: () => {
        const availableWords = get().getAvailableWords();
        if (availableWords.length === 0) return;
        
        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        const options = get().generateWordOptions(randomWord);
        
        set({
          currentWord: randomWord,
          currentOptions: options,
          showFeedback: false,
          lastAnswer: null
        });
      },
      
      submitAnswer: (selectedOption) => {
        const { currentWord, wordStats, sessionStats } = get();
        const isCorrect = selectedOption.isCorrect;
        
        // Update session stats
        const newSessionStats = {
          ...sessionStats,
          total: sessionStats.total + 1,
          correct: isCorrect ? sessionStats.correct + 1 : sessionStats.correct,
          wrong: isCorrect ? sessionStats.wrong : sessionStats.wrong + 1
        };
        
        // Update word stats
        const wordKey = currentWord.word;
        const currentWordStats = wordStats[wordKey] || { correctCount: 0, wrongCount: 0, lastAnswer: null };
        const newWordStats = {
          ...wordStats,
          [wordKey]: {
            correctCount: isCorrect ? currentWordStats.correctCount + 1 : currentWordStats.correctCount,
            wrongCount: isCorrect ? currentWordStats.wrongCount : currentWordStats.wrongCount + 1,
            lastAnswer: new Date().toISOString()
          }
        };
        
        set({
          showFeedback: true,
          lastAnswer: selectedOption,
          isCorrect,
          sessionStats: newSessionStats,
          wordStats: newWordStats
        });
      },
      
      getWordProgress: (word) => {
        const { wordStats } = get();
        const stats = wordStats[word];
        if (!stats) return 0;
        
        const total = stats.correctCount + stats.wrongCount;
        if (total === 0) return 0;
        
        return Math.round((stats.correctCount / total) * 100);
      },
      
      resetSession: () => {
        set({
          sessionStats: { correct: 0, wrong: 0, total: 0 },
          currentWord: null,
          currentOptions: [],
          showFeedback: false,
          lastAnswer: null
        });
      },
      
      importDictionary: (newDictionary) => {
        set({ dictionary: newDictionary });
      },
      
      exportDictionary: () => {
        const { dictionary } = get();
        return { слова: dictionary };
      }
    }),
    {
      name: 'russian-stress-trainer-storage',
      partialize: (state) => ({
        dictionary: state.dictionary,
        excludedWords: state.excludedWords,
        wordStats: state.wordStats
      })
    }
  )
);

export default useAppStore;

