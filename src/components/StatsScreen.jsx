import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import useAppStore from '../stores/useAppStore';

const StatsScreen = () => {
  const { wordStats, dictionary, getWordProgress, excludedWords } = useAppStore();

  const getWordsWithStats = () => {
    return dictionary
      .filter(word => !excludedWords.includes(word.word))
      .map(word => ({
        ...word,
        stats: wordStats[word.word] || { correctCount: 0, wrongCount: 0, lastAnswer: null },
        progress: getWordProgress(word.word)
      }))
      .sort((a, b) => {
        // Sort by progress (ascending) then by total attempts (descending)
        if (a.progress !== b.progress) {
          return a.progress - b.progress;
        }
        const totalA = a.stats.correctCount + a.stats.wrongCount;
        const totalB = b.stats.correctCount + b.stats.wrongCount;
        return totalB - totalA;
      });
  };

  const wordsWithStats = getWordsWithStats();
  
  const totalWords = wordsWithStats.length;
  const masteredWords = wordsWithStats.filter(w => w.progress === 100).length;
  const strugglingWords = wordsWithStats.filter(w => w.progress < 50 && (w.stats.correctCount + w.stats.wrongCount) > 0).length;
  const overallProgress = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBadge = (progress, stats) => {
    const total = stats.correctCount + stats.wrongCount;
    if (total === 0) return <Badge variant="secondary">Не изучено</Badge>;
    if (progress === 100) return <Badge variant="default" className="bg-green-500">Освоено</Badge>;
    if (progress >= 80) return <Badge variant="default" className="bg-blue-500">Хорошо</Badge>;
    if (progress >= 50) return <Badge variant="default" className="bg-yellow-500">Средне</Badge>;
    return <Badge variant="destructive">Нужна практика</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Статистика
        </h1>

        {/* Overall stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{overallProgress}%</p>
                  <p className="text-sm text-muted-foreground">Общий прогресс</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{masteredWords}</p>
                  <p className="text-sm text-muted-foreground">Освоено слов</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{strugglingWords}</p>
                  <p className="text-sm text-muted-foreground">Требуют практики</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Общий прогресс</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Освоено {masteredWords} из {totalWords} слов</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Words list */}
        <Card>
          <CardHeader>
            <CardTitle>Детальная статистика по словам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wordsWithStats.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Начните тренировку, чтобы увидеть статистику
                </p>
              ) : (
                wordsWithStats.map((word, index) => {
                  const total = word.stats.correctCount + word.stats.wrongCount;
                  return (
                    <div
                      key={word.word}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-lg">{word.word}</span>
                          {getProgressBadge(word.progress, word.stats)}
                        </div>
                        {total > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>
                                Правильно: {word.stats.correctCount}, 
                                Неправильно: {word.stats.wrongCount}
                              </span>
                              <span className={getProgressColor(word.progress)}>
                                {word.progress}%
                              </span>
                            </div>
                            <Progress value={word.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsScreen;

