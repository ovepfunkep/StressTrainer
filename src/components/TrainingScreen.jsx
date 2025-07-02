import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import useAppStore from '../stores/useAppStore';
import ThemeToggle from './ThemeToggle';

const TrainingScreen = () => {
  const {
    currentWord,
    currentOptions,
    showFeedback,
    lastAnswer,
    isCorrect,
    sessionStats,
    startNewQuestion,
    submitAnswer,
    resetSession
  } = useAppStore();

  useEffect(() => {
    if (!currentWord) {
      startNewQuestion();
    }
  }, [currentWord, startNewQuestion]);

  const handleAnswerClick = (option) => {
    if (showFeedback) return;
    submitAnswer(option);
  };

  const handleNextQuestion = () => {
    startNewQuestion();
  };

  const handleResetSession = () => {
    resetSession();
    startNewQuestion();
  };

  const getProgressPercentage = () => {
    if (sessionStats.total === 0) return 0;
    return Math.round((sessionStats.correct / sessionStats.total) * 100);
  };

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Загрузка слов для тренировки...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with stats */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Тренажёр ударений
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetSession}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Сброс
              </Button>
            </div>
          </div>
          
          {sessionStats.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Прогресс: {getProgressPercentage()}%</span>
                <span>
                  {sessionStats.correct}/{sessionStats.total} правильно
                </span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          )}
        </div>

        {/* Main training card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-lg">
              Как правильно ставится ударение?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Word display */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Слово:</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentWord.word}
              </p>
            </div>

            {/* Answer options */}
            <div className="space-y-3">
              {currentOptions.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    showFeedback
                      ? option.isCorrect
                        ? "default"
                        : lastAnswer === option
                        ? "destructive"
                        : "outline"
                      : "outline"
                  }
                  size="lg"
                  className={`w-full text-xl py-6 ${
                    showFeedback && option.isCorrect
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : showFeedback && lastAnswer === option && !option.isCorrect
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : ""
                  }`}
                  onClick={() => handleAnswerClick(option)}
                  disabled={showFeedback}
                >
                  <span className="flex items-center justify-center gap-3">
                    <span className="text-sm font-normal">
                      [{index + 1}]
                    </span>
                    <span className="font-bold">{option.text}</span>
                    {showFeedback && option.isCorrect && (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    {showFeedback && lastAnswer === option && !option.isCorrect && (
                      <XCircle className="w-5 h-5" />
                    )}
                  </span>
                </Button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className="text-center space-y-4">
                <div className={`text-lg font-semibold ${
                  isCorrect ? "text-green-600" : "text-red-600"
                }`}>
                  {isCorrect ? "Правильно! 🎉" : "Неправильно 😔"}
                </div>
                
                <Button
                  onClick={handleNextQuestion}
                  size="lg"
                  className="w-full"
                >
                  Следующее слово
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session statistics */}
        {sessionStats.total > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Статистика сессии</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {sessionStats.correct}
                  </p>
                  <p className="text-sm text-muted-foreground">Правильно</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {sessionStats.wrong}
                  </p>
                  <p className="text-sm text-muted-foreground">Неправильно</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {sessionStats.total}
                  </p>
                  <p className="text-sm text-muted-foreground">Всего</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrainingScreen;

